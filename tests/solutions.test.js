// Verifica que la solución provista de CADA lección ejecutable pasa su propia
// validación (pruebas ocultas + salida + checks DOM). Evita publicar lecciones
// cuya solución "oficial" no aprueba el reto.
const test = require("node:test");
const assert = require("node:assert/strict");
const { JSDOM } = require("jsdom");

global.window = global;
require("../js/content.js");
require("../js/expansion-content.js");
require("../js/academic-content.js");
require("../js/runner.js");
const validator = require("../js/validator.js");

function serialize(value) {
  if (typeof value === "string") return value;
  if (typeof value === "undefined") return "undefined";
  if (typeof value === "function") return `[Function ${value.name || "anonymous"}]`;
  try { return JSON.stringify(value); } catch (_) { return String(value); }
}
const esperar = (value, ms = 2) => new Promise((r) => setTimeout(() => r(value), Math.min(ms, 5)));
const asegurar = (condition, message = "La comprobación falló") => { if (!condition) throw new Error(message); };
const apiSimulada = async (path) => {
  await esperar(null, 2);
  if (path === "/fallo") throw new Error("Servicio no disponible");
  const data = path === "/usuarios" ? [{ id: 1, nombre: "Ada" }, { id: 2, nombre: "Lin" }]
    : path === "/perfil" ? { nombre: "Ada", nivel: 4 } : [];
  return { ok: true, status: 200, json: async () => data };
};

async function runConsoleNode(code, tests) {
  const output = [];
  const fakeConsole = { log: (...v) => output.push(v.map(serialize).join(" ")), warn: (...v) => output.push("Aviso: " + v.map(serialize).join(" ")) };
  const hiddenTests = [];
  const runHidden = async (name, check) => {
    try { hiddenTests.push({ name, ok: Boolean(await check()) }); }
    catch (e) { hiddenTests.push({ name, ok: false, error: e && e.message ? e.message : String(e) }); }
  };
  const instrumented = CodeRunner.instrumentLoops(code);
  const hiddenChecks = (tests || []).map((t) => `await __runHiddenTest(${JSON.stringify(t.name || "x")}, async () => (${t.expression}));`).join("\n");
  const body = `return (async () => {\n${instrumented}\n${hiddenChecks}\n})();`;
  try {
    const fn = new Function("console", "esperar", "asegurar", "__runHiddenTest", "apiSimulada", body);
    await fn(fakeConsole, esperar, asegurar, runHidden, apiSimulada);
    return { ok: true, output, hiddenTests };
  } catch (e) {
    return { ok: false, output, hiddenTests, error: e && e.message ? e.message : String(e) };
  }
}

function evaluateChecks(document, checks) {
  return (checks || []).map((check) => {
    const nodes = [...document.querySelectorAll(check.selector)];
    if (Object.prototype.hasOwnProperty.call(check, "count") && nodes.length !== check.count) {
      return { ok: false, message: `Se esperaban ${check.count} para ${check.selector}; hay ${nodes.length}.` };
    }
    if (Object.prototype.hasOwnProperty.call(check, "text") && (!nodes[0] || nodes[0].textContent.trim() !== check.text)) {
      return { ok: false, message: `${check.selector} debe mostrar "${check.text}".` };
    }
    if (Object.prototype.hasOwnProperty.call(check, "textIncludes") && !nodes.some((n) => n.textContent.includes(check.textIncludes))) {
      return { ok: false, message: `No se encontró "${check.textIncludes}" en ${check.selector}.` };
    }
    return { ok: true };
  });
}

async function runDomNode(code, lesson) {
  const dom = new JSDOM(`<!doctype html><html><body>${lesson.html || "<main id=app></main>"}</body></html>`, { pretendToBeVisual: true });
  const { window } = dom;
  const { document } = window;
  const output = [];
  const fakeConsole = { log: (...v) => output.push(v.map(serialize).join(" ")) };
  const instrumented = CodeRunner.instrumentLoops(code);
  const body = `return (async () => {\n${instrumented}\n})();`;
  try {
    const fn = new Function("document", "window", "console", "esperar", "asegurar", "apiSimulada", "setTimeout", "alert", body);
    await fn(document, window, fakeConsole, esperar, asegurar, apiSimulada, window.setTimeout.bind(window), () => {});
    await new Promise((r) => setTimeout(r, 25));
    const checks = evaluateChecks(document, lesson.checks);
    return { ok: checks.every((c) => c.ok), output, checks };
  } catch (e) {
    return { ok: false, output, checks: [], error: e && e.message ? e.message : String(e) };
  }
}

test("toda solución de consola (code/debug) pasa su propia validación", async () => {
  const lessons = COURSE_DATA.allLessons.filter((l) => l.type === "code" || l.type === "debug");
  const failures = [];
  for (const lesson of lessons) {
    assert.ok(typeof lesson.solution === "string" && lesson.solution.trim(), `${lesson.id} no tiene solución`);
    const result = await runConsoleNode(lesson.solution, lesson.tests || []);
    const validation = validator.validate(lesson, result);
    if (!validation.ok) failures.push(`${lesson.id}: ${validation.detail}${result.error ? " | error: " + result.error : ""}`);
  }
  assert.deepEqual(failures, [], `Soluciones de consola que no aprueban:\n${failures.join("\n")}`);
});

test("toda solución DOM cumple sus comprobaciones", async () => {
  const lessons = COURSE_DATA.allLessons.filter((l) => l.type === "dom");
  const failures = [];
  for (const lesson of lessons) {
    assert.ok(typeof lesson.solution === "string" && lesson.solution.trim(), `${lesson.id} no tiene solución`);
    const result = await runDomNode(lesson.solution, lesson);
    const validation = validator.validate(lesson, result);
    if (!validation.ok) failures.push(`${lesson.id}: ${validation.detail}${result.error ? " | error: " + result.error : ""}`);
  }
  assert.deepEqual(failures, [], `Soluciones DOM que no aprueban:\n${failures.join("\n")}`);
});

test("los quizzes tienen respuesta válida, opciones y explicación", () => {
  const quizzes = COURSE_DATA.allLessons.filter((l) => l.type === "quiz");
  for (const quiz of quizzes) {
    assert.ok(Array.isArray(quiz.options) && quiz.options.length >= 2, `${quiz.id} debe ofrecer al menos 2 opciones`);
    assert.ok(Number.isInteger(quiz.answer) && quiz.answer >= 0 && quiz.answer < quiz.options.length, `${quiz.id} tiene un índice de respuesta inválido`);
    assert.ok(typeof quiz.explanation === "string" && quiz.explanation.trim().length > 0, `${quiz.id} necesita explicación`);
    assert.ok(typeof quiz.question === "string" && quiz.question.trim().length > 0, `${quiz.id} necesita pregunta`);
  }
});
