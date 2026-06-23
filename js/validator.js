(function (global) {
  "use strict";

  function normalize(lines) {
    return (lines || []).map((line) => String(line).trim());
  }

  function validateOutput(expected, actual, mode = "exact") {
    const wanted = normalize(expected);
    const received = normalize(actual);
    if (mode === "includes") {
      const missing = wanted.filter((line) => !received.includes(line));
      return missing.length
        ? { ok: false, detail: `Falta esta salida: ${missing.join(" | ")}` }
        : { ok: true, detail: "La salida contiene todos los resultados esperados." };
    }
    const same = wanted.length === received.length && wanted.every((line, index) => line === received[index]);
    return same
      ? { ok: true, detail: "La salida coincide exactamente." }
      : {
          ok: false,
          detail: `Esperado: ${wanted.length ? wanted.join(" | ") : "(sin salida)"}. Recibido: ${received.length ? received.join(" | ") : "(sin salida)"}.`
        };
  }

  function validate(lesson, result) {
    if (result.error) return { ok: false, detail: result.error };
    if (lesson.type === "dom") {
      const failed = (result.checks || []).filter((check) => !check.ok);
      return result.ok && failed.length === 0
        ? { ok: true, detail: "La interfaz cumple todas las comprobaciones." }
        : { ok: false, detail: failed[0]?.message || "La interfaz todavía no cumple el objetivo." };
    }
    const expectedHidden = lesson.tests || [];
    if (expectedHidden.length) {
      const receivedHidden = result.hiddenTests || [];
      if (receivedHidden.length !== expectedHidden.length) {
        return { ok: false, detail: "No se pudieron ejecutar todas las pruebas ocultas." };
      }
      const failed = receivedHidden.find((test) => !test.ok);
      if (failed) {
        return { ok: false, detail: `Prueba oculta pendiente: ${failed.name}. Prueba con otras entradas, no solo con el ejemplo visible.` };
      }
    }
    const output = validateOutput(lesson.expected, result.output, lesson.validation);
    if (!output.ok) return output;
    const hiddenLabel = expectedHidden.length === 1 ? "1 prueba oculta" : `${expectedHidden.length} pruebas ocultas`;
    return expectedHidden.length
      ? { ok: true, detail: `La salida coincide y superaste ${hiddenLabel}.` }
      : output;
  }

  const api = { normalize, validateOutput, validate };
  global.LearningValidator = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
