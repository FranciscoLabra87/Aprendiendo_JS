(function (global) {
  "use strict";

  const TIMEOUT_MS = 2500;

  function serialize(value) {
    if (typeof value === "string") return value;
    if (typeof value === "undefined") return "undefined";
    if (typeof value === "function") return `[Function ${value.name || "anonymous"}]`;
    try { return JSON.stringify(value); } catch (_) { return String(value); }
  }

  function instrumentLoops(code) {
    let counter = 0;
    const guard = () => `if (++__loopGuard > 100000) { throw new Error("El bucle excedió el límite permitido. Revisa su condición de salida."); }`;
    const instrumented = code
      .replace(/\bfor\s*\(([^)]*)\)\s*\{/g, (match) => `${match}${guard()}`)
      .replace(/\bwhile\s*\(([^)]*)\)\s*\{/g, (match) => `${match}${guard()}`)
      .replace(/\bdo\s*\{/g, (match) => `${match}${guard()}`);
    if (instrumented !== code) counter++;
    return counter ? `let __loopGuard = 0;\n${instrumented}` : code;
  }

  function hiddenTestSource(tests) {
    return (tests || []).map((test) => {
      const name = JSON.stringify(test.name || "Comportamiento esperado");
      return `await __runHiddenTest(${name}, async () => (${test.expression}));`;
    }).join("\n");
  }

  function workerSource(userCode, tests) {
    const code = instrumentLoops(userCode);
    const hiddenChecks = hiddenTestSource(tests);
    return `
      const output = [];
      const hiddenTests = [];
      const format = ${serialize.toString()};
      console.log = (...values) => output.push(values.map(format).join(" "));
      console.warn = (...values) => output.push("Aviso: " + values.map(format).join(" "));
      const esperar = (value, ms = 30) => new Promise((resolve) => setTimeout(() => resolve(value), ms));
      const asegurar = (condition, message = "La comprobación falló") => { if (!condition) throw new Error(message); };
      const __runHiddenTest = async (name, check) => {
        try {
          const value = await check();
          hiddenTests.push({ name, ok: Boolean(value) });
        } catch (error) {
          hiddenTests.push({ name, ok: false, error: error && error.message ? error.message : String(error) });
        }
      };
      const apiSimulada = async (path) => {
        await esperar(null, 35);
        if (path === "/fallo") throw new Error("Servicio no disponible");
        const data = path === "/usuarios"
          ? [{ id: 1, nombre: "Ada" }, { id: 2, nombre: "Lin" }]
          : path === "/perfil" ? { nombre: "Ada", nivel: 4 } : [];
        return { ok: true, status: 200, json: async () => data };
      };
      (async () => {
        ${code}
        ${hiddenChecks}
      })()
        .then(() => postMessage({ ok: true, output, hiddenTests }))
        .catch((error) => postMessage({ ok: false, output, hiddenTests, error: error && error.message ? error.message : String(error) }));
    `;
  }

  function runConsole(code, tests = []) {
    return new Promise((resolve) => {
      let worker;
      let url;
      let settled = false;

      const finish = (result) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        if (worker) worker.terminate();
        if (url) URL.revokeObjectURL(url);
        resolve(result);
      };

      try {
        const blob = new Blob([workerSource(code, tests)], { type: "text/javascript" });
        url = URL.createObjectURL(blob);
        worker = new Worker(url);
      } catch (error) {
        resolve({ ok: false, output: [], error: error.message });
        return;
      }

      const timer = setTimeout(() => finish({
        ok: false,
        output: [],
        error: "El código tardó demasiado y fue detenido. Revisa bucles o promesas pendientes."
      }), TIMEOUT_MS);

      worker.onmessage = (event) => finish(event.data);
      worker.onerror = (event) => finish({ ok: false, output: [], error: event.message || "Error de sintaxis" });
    });
  }

  function safeJson(value) {
    return JSON.stringify(value).replace(/</g, "\\u003c").replace(/>/g, "\\u003e");
  }

  function buildDomDocument(lesson, code, runId) {
    const instrumented = instrumentLoops(code);
    const checks = safeJson(lesson.checks || []);
    const codeLiteral = safeJson(instrumented);
    const runIdLiteral = safeJson(runId);
    return `<!doctype html>
      <html lang="es"><head><meta charset="UTF-8"><style>
        *{box-sizing:border-box}body{margin:0;padding:18px;background:#fff;color:#172033;font:15px/1.5 system-ui,sans-serif}
        section,.demo-card{padding:16px;border:1px solid #d9dfeb;border-radius:12px;background:#f7f9fc}
        button,input{min-height:40px;margin:4px;padding:8px 11px;border:1px solid #b9c2d2;border-radius:8px;font:inherit}
        button{background:#f7df1e;color:#191800;font-weight:800;cursor:pointer}ul{padding-left:22px}.listo,.completada{color:#087443;font-weight:800}
        .card{display:block;margin:8px 0;padding:12px 14px;border:1px solid #d9dfeb;border-radius:10px;background:#fff;font-weight:600}
      </style></head><body>${lesson.html || "<main id=app></main>"}<script>
        (() => {
          const runId = ${runIdLiteral};
          const output = [];
          const checks = ${checks};
          const format = ${serialize.toString()};
          console.log = (...values) => output.push(values.map(format).join(" "));
          const esperar = (value, ms = 30) => new Promise((resolve) => setTimeout(() => resolve(value), ms));
          const asegurar = (condition, message = "La comprobación falló") => { if (!condition) throw new Error(message); };
          const apiSimulada = async (path) => {
            await esperar(null, 35);
            if (path === "/fallo") throw new Error("Servicio no disponible");
            const data = path === "/usuarios"
              ? [{ id: 1, nombre: "Ada" }, { id: 2, nombre: "Lin" }]
              : path === "/perfil" ? { nombre: "Ada", nivel: 4 } : [];
            return { ok: true, status: 200, json: async () => data };
          };
          const code = ${codeLiteral};
          const evaluateChecks = () => checks.map((check) => {
            const nodes = [...document.querySelectorAll(check.selector)];
            if (Object.prototype.hasOwnProperty.call(check, "count") && nodes.length !== check.count) {
              return { ok: false, message: "Se esperaban " + check.count + " elementos para " + check.selector + "; hay " + nodes.length + "." };
            }
            if (Object.prototype.hasOwnProperty.call(check, "text") && (!nodes[0] || nodes[0].textContent.trim() !== check.text)) {
              return { ok: false, message: check.selector + ' debe mostrar "' + check.text + '".' };
            }
            if (Object.prototype.hasOwnProperty.call(check, "textIncludes") && !nodes.some((node) => node.textContent.includes(check.textIncludes))) {
              return { ok: false, message: 'No se encontró "' + check.textIncludes + '" en ' + check.selector + '.' };
            }
            return { ok: true };
          });
          (async () => {
            const execute = new Function("esperar", "asegurar", "apiSimulada", "return (async () => {\\n" + code + "\\n})()");
            await execute(esperar, asegurar, apiSimulada);
            await new Promise((resolve) => setTimeout(resolve, 25));
            const results = evaluateChecks();
            parent.postMessage({ source: "jslab-dom", runId, ok: results.every((item) => item.ok), output, checks: results }, "*");
          })().catch((error) => parent.postMessage({ source: "jslab-dom", runId, ok: false, output, error: error.message || String(error), checks: [] }, "*"));
        })();
      <\/script></body></html>`;
  }

  function runDom(code, lesson, previewHost) {
    return new Promise((resolve) => {
      const runId = `run-${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const iframe = document.createElement("iframe");
      iframe.setAttribute("sandbox", "allow-scripts");
      iframe.setAttribute("title", "Vista previa del ejercicio");
      previewHost.replaceChildren(iframe);
      let settled = false;

      const finish = (result, keepFrame = true) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        window.removeEventListener("message", onMessage);
        if (!keepFrame) iframe.remove();
        resolve(result);
      };

      const onMessage = (event) => {
        const data = event.data;
        if (!data || data.source !== "jslab-dom" || data.runId !== runId) return;
        finish(data);
      };

      window.addEventListener("message", onMessage);
      const timer = setTimeout(() => finish({
        ok: false,
        output: [],
        checks: [],
        error: "La vista previa tardó demasiado. Revisa la condición de salida de tus bucles."
      }, false), TIMEOUT_MS);
      iframe.srcdoc = buildDomDocument(lesson, code, runId);
    });
  }

  global.CodeRunner = { runConsole, runDom, instrumentLoops, buildDomDocument, TIMEOUT_MS };
})(typeof window !== "undefined" ? window : globalThis);
