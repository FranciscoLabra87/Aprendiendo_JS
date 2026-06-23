const test = require("node:test");
const assert = require("node:assert/strict");

global.window = global;
require("../js/content.js");
require("../js/expansion-content.js");
require("../js/academic-content.js");
require("../js/runner.js");
const validator = require("../js/validator.js");

test("el curso ofrece la ruta completa y proyectos", () => {
  assert.equal(COURSE_DATA.modules.length, 14);
  assert.equal(COURSE_DATA.projects.length, 6);
  assert.ok(COURSE_DATA.lessonCount >= 105);
});

test("cada unidad tiene ids únicos y contenido didáctico suficiente", () => {
  const ids = COURSE_DATA.allLessons.map((lesson) => lesson.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const unit of COURSE_DATA.allUnits) {
    assert.ok(unit.title);
    assert.ok(unit.description.length > 20);
    assert.ok(unit.lessons.length >= 3);
    for (const lesson of unit.lessons) {
      assert.ok(["quiz", "code", "debug", "dom"].includes(lesson.type));
      assert.ok(lesson.goal);
      assert.ok(lesson.theory);
    }
  }
});

test("la comparación exacta normaliza espacios externos", () => {
  assert.deepEqual(validator.validateOutput(["Ada", "15"], [" Ada ", "15"]), {
    ok: true,
    detail: "La salida coincide exactamente."
  });
});

test("la validación explica la salida diferente", () => {
  const result = validator.validateOutput(["10"], ["82"]);
  assert.equal(result.ok, false);
  assert.match(result.detail, /Esperado: 10/);
  assert.match(result.detail, /Recibido: 82/);
});

test("la guarda se inyecta en bucles con llaves", () => {
  const instrumented = CodeRunner.instrumentLoops("for (let i = 0; i < 3; i++) { console.log(i); }");
  assert.match(instrumented, /__loopGuard/);
  assert.match(instrumented, /excedió el límite/);
});

test("la mayoría de retos de código usa pruebas ocultas", () => {
  const executable = COURSE_DATA.allLessons.filter((lesson) => ["code", "debug"].includes(lesson.type));
  const tested = executable.filter((lesson) => lesson.tests?.length);
  assert.ok(tested.length / executable.length >= 0.8);
});

test("el validador exige que todas las pruebas ocultas pasen", () => {
  const lesson = { type: "code", expected: ["4"], tests: [{ name: "otro caso", expression: "doble(3) === 6" }] };
  const failed = validator.validate(lesson, { output: ["4"], hiddenTests: [{ name: "otro caso", ok: false }] });
  assert.equal(failed.ok, false);
  assert.match(failed.detail, /Prueba oculta pendiente/);
  const passed = validator.validate(lesson, { output: ["4"], hiddenTests: [{ name: "otro caso", ok: true }] });
  assert.equal(passed.ok, true);
});

test("cada módulo termina con evaluación académica y competencias", () => {
  for (const unit of COURSE_DATA.modules) {
    assert.ok(unit.essentialQuestion);
    assert.ok(unit.competencies.length >= 3);
    const finalLesson = unit.lessons[unit.lessons.length - 1];
    assert.equal(finalLesson.isAssessment, true);
    assert.ok(finalLesson.reflectionPrompt.length > 20);
    assert.ok(finalLesson.rubric.length >= 3);
    assert.ok(finalLesson.tests?.length || finalLesson.checks?.length);
  }
});
