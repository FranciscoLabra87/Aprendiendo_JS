const test = require("node:test");
const assert = require("node:assert/strict");
const Editor = require("../js/editor.js");

test("highlight escapa HTML peligroso", () => {
  const html = Editor.highlight('const x = "<img src=x>";');
  assert.ok(!html.includes("<img"), "no debe emitir etiquetas crudas");
  assert.ok(html.includes("&lt;img"), "debe escapar <");
});

test("highlight marca palabras clave, números y cadenas", () => {
  const html = Editor.highlight('const total = 42 + "ok";');
  assert.match(html, /<span class="tk-kw">const<\/span>/);
  assert.match(html, /<span class="tk-num">42<\/span>/);
  assert.match(html, /<span class="tk-str">&quot;ok&quot;|<span class="tk-str">"ok"/);
});

test("highlight resalta llamadas a función", () => {
  const html = Editor.highlight("console.log(sumar(2));");
  assert.match(html, /<span class="tk-fn">log<\/span>/);
  assert.match(html, /<span class="tk-fn">sumar<\/span>/);
});

test("highlight comenta líneas con //", () => {
  const html = Editor.highlight("// nota\nlet a = 1;");
  assert.match(html, /<span class="tk-com">\/\/ nota<\/span>/);
});
