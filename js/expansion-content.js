(function (global) {
  "use strict";

  const course = global.COURSE_DATA;
  if (!course) throw new Error("COURSE_DATA debe cargarse antes de la expansión.");

  const code = (id, title, goal, theory, starter, expected, solution, hints, keyPoints = [], tests = []) => ({
    id, type: "code", title, goal, theory, starter, expected, solution, hints, keyPoints, validation: "exact", tests
  });
  const debug = (id, title, goal, theory, starter, expected, solution, hints, keyPoints = [], tests = []) => ({
    ...code(id, title, goal, theory, starter, expected, solution, hints, keyPoints, tests), type: "debug"
  });
  const dom = (id, title, goal, theory, html, starter, solution, checks, hints, keyPoints = []) => ({
    id, type: "dom", title, goal, theory, html, starter, solution, checks, hints, keyPoints
  });
  const quiz = (id, title, goal, theory, question, options, answer, explanation, keyPoints = []) => ({
    id, type: "quiz", title, goal, theory, question, options, answer, explanation, keyPoints
  });

  const additions = {
    m01: [
      code("m01-l04", "Construye un recibo", "Combinar variables en un resultado útil.", "Transforma datos separados en un resumen legible. El cálculo debe vivir en una variable para poder comprobarlo y reutilizarlo.", `const producto = "cuadernos";
const cantidad = 3;
const precioUnitario = 1500;

// Calcula el total y muestra: 3 cuadernos: $4500
const total = 0;
console.log();`, ["3 cuadernos: $4500"], `const producto = "cuadernos";
const cantidad = 3;
const precioUnitario = 1500;
const total = cantidad * precioUnitario;
console.log(cantidad + " " + producto + ": $" + total);`, ["Multiplica cantidad por precioUnitario.", "Une los valores respetando espacios, dos puntos y símbolo de moneda."], ["Separa cálculo y presentación.", "Las pruebas ocultas revisan el valor, no solo el texto."], [{ name: "el total conserva el cálculo", expression: "total === cantidad * precioUnitario && total === 4500" }]),
      debug("m01-l05", "Repara el contador", "Distinguir const de let mediante un error real.", "El programa intenta reasignar una constante. Lee el mensaje, identifica qué valor cambia y elige la declaración adecuada.", `const contador = 1;
contador = contador + 1;
console.log(contador);`, ["2"], `let contador = 1;
contador = contador + 1;
console.log(contador);`, ["¿La variable debe cambiar después de declararse?", "Cambia solamente la palabra de declaración."], ["Corrige la causa del error, no elimines la operación."], [{ name: "el contador puede seguir aumentando", expression: "contador === 2" }])
    ],
    m02: [
      code("m02-l04", "Detecta números pares", "Crear una función booleana reutilizable.", "El resto de dividir un número par por 2 es cero. Encapsula esa regla para probar muchos valores.", `function esPar(numero) {
  // Devuelve true o false
}

console.log(esPar(12));
console.log(esPar(7));`, ["true", "false"], `function esPar(numero) {
  return numero % 2 === 0;
}
console.log(esPar(12));
console.log(esPar(7));`, ["Usa el operador de resto <code>%</code>.", "Compara el resto con cero usando igualdad estricta."], ["Una función booleana responde una pregunta.", "No escribas casos particulares para 12 y 7."], [{ name: "funciona con cero y negativos", expression: "esPar(0) === true && esPar(-4) === true && esPar(-3) === false" }]),
      debug("m02-l05", "El misterio de NaN", "Corregir una conversión inválida.", "<code>Number</code> necesita un texto numérico limpio. El error está en convertir el valor equivocado.", `const entrada = "25";
const impuesto = 5;
const precio = Number("entrada") + impuesto;
console.log(precio);`, ["30"], `const entrada = "25";
const impuesto = 5;
const precio = Number(entrada) + impuesto;
console.log(precio);`, ["Compara <code>Number('entrada')</code> con <code>Number(entrada)</code>.", "Las comillas convierten el nombre de la variable en texto literal."], ["Cuando aparezca NaN, inspecciona el dato antes de la operación."], [{ name: "precio es un número válido", expression: "precio === 30 && Number.isNaN(precio) === false" }])
    ],
    m03: [
      code("m03-l04", "Crea un slug", "Normalizar texto para una URL.", "Un slug suele estar en minúsculas, sin espacios externos y con guiones entre palabras.", `function crearSlug(titulo) {
  // Ejemplo: "  Curso JavaScript  " -> "curso-javascript"
}

console.log(crearSlug("  Curso JavaScript  "));`, ["curso-javascript"], `function crearSlug(titulo) {
  return titulo.trim().toLowerCase().split(" ").filter(Boolean).join("-");
}
console.log(crearSlug("  Curso JavaScript  "));`, ["Encadena <code>trim()</code> y <code>toLowerCase()</code>.", "Convierte palabras en un array y vuelve a unirlas con guiones."], ["Normalizar entradas reduce casos especiales posteriores."], [{ name: "tolera espacios repetidos", expression: "crearSlug('Hola   Mundo') === 'hola-mundo' && crearSlug(' JS ') === 'js'" }]),
      debug("m03-l05", "Búsqueda sin mayúsculas", "Reparar una comparación de texto.", "Las personas pueden escribir un término con distintas mayúsculas. Normaliza ambos lados antes de buscar.", `function contiene(texto, busqueda) {
  return texto.includes(busqueda);
}

console.log(contiene("Aprende JavaScript", "javascript"));`, ["true"], `function contiene(texto, busqueda) {
  return texto.toLowerCase().includes(busqueda.toLowerCase());
}
console.log(contiene("Aprende JavaScript", "javascript"));`, ["<code>includes</code> distingue mayúsculas.", "Convierte texto y búsqueda al mismo formato."], ["Decide explícitamente si una búsqueda debe distinguir mayúsculas."], [{ name: "busca con cualquier combinación de mayúsculas", expression: "contiene('HOLA Mundo', 'hola') && contiene('HOLA Mundo', 'MUNDO') && !contiene('HOLA', 'adiós')" }])
    ],
    m04: [
      code("m04-l04", "Calcula una tarifa", "Combinar condiciones en una función.", "Modela las reglas en orden: menores de 12 pagan 5, estudiantes pagan 8 y el resto paga 12.", `function calcularTarifa(edad, esEstudiante) {
  // Devuelve 5, 8 o 12
}

console.log(calcularTarifa(10, false));
console.log(calcularTarifa(20, true));`, ["5", "8"], `function calcularTarifa(edad, esEstudiante) {
  if (edad < 12) return 5;
  if (esEstudiante) return 8;
  return 12;
}
console.log(calcularTarifa(10, false));
console.log(calcularTarifa(20, true));`, ["Comprueba primero la regla de edad.", "Si ninguna condición aplica, devuelve la tarifa general."], ["El orden representa la prioridad del negocio."], [{ name: "cubre la tarifa general y prioridades", expression: "calcularTarifa(30, false) === 12 && calcularTarifa(10, true) === 5" }]),
      debug("m04-l05", "Condiciones fuera de orden", "Detectar una rama inalcanzable.", "Una condición general colocada antes que una específica puede capturar valores demasiado pronto.", `function clasificar(puntos) {
  if (puntos >= 50) return "aprobado";
  if (puntos >= 90) return "excelente";
  return "repasar";
}

console.log(clasificar(95));`, ["excelente"], `function clasificar(puntos) {
  if (puntos >= 90) return "excelente";
  if (puntos >= 50) return "aprobado";
  return "repasar";
}
console.log(clasificar(95));`, ["¿Qué condición también es verdadera para 95?", "Coloca primero la condición más específica."], ["Traza el recorrido con valores límite."], [{ name: "clasifica límites y valores intermedios", expression: "clasificar(90) === 'excelente' && clasificar(70) === 'aprobado' && clasificar(40) === 'repasar'" }])
    ],
    m05: [
      code("m05-l04", "Cuenta vocales", "Recorrer texto y acumular coincidencias.", "Los strings son iterables. Recorre cada carácter y aumenta un contador cuando pertenezca al conjunto de vocales.", `function contarVocales(texto) {
  let total = 0;
  // Recorre el texto
  return total;
}

console.log(contarVocales("JavaScript"));`, ["3"], `function contarVocales(texto) {
  let total = 0;
  for (const letra of texto.toLowerCase()) {
    if ("aeiou".includes(letra)) total++;
  }
  return total;
}
console.log(contarVocales("JavaScript"));`, ["Recorre <code>texto.toLowerCase()</code> con for...of.", "Comprueba si <code>'aeiou'</code> incluye cada letra."], ["Este patrón combina recorrido, decisión y acumulación."], [{ name: "funciona con mayúsculas y texto vacío", expression: "contarVocales('AEIOU') === 5 && contarVocales('xyz') === 0 && contarVocales('') === 0" }]),
      debug("m05-l05", "Un elemento de más", "Corregir un límite de iteración.", "El último índice de un array es <code>length - 1</code>. Usar <code><= length</code> intenta leer una posición inexistente.", `const numeros = [4, 5, 6];
let suma = 0;
for (let i = 0; i <= numeros.length; i++) {
  suma += numeros[i];
}
console.log(suma);`, ["15"], `const numeros = [4, 5, 6];
let suma = 0;
for (let i = 0; i < numeros.length; i++) {
  suma += numeros[i];
}
console.log(suma);`, ["Observa el operador de la condición.", "El bucle debe detenerse antes de <code>numeros.length</code>."], ["Los errores ±1 son comunes: prueba primer y último índice."], [{ name: "la suma no es NaN y usa todos los elementos", expression: "suma === 15 && Number.isNaN(suma) === false" }])
    ],
    m06: [
      code("m06-l04", "Crea un contador privado", "Comprender closures mediante estado encapsulado.", "Una función interna recuerda las variables del ámbito donde fue creada. Ese cierre permite conservar estado sin una variable global.", `function crearContador() {
  let valor = 0;
  // Devuelve una función que aumente y devuelva valor
}

const contar = crearContador();
console.log(contar());
console.log(contar());`, ["1", "2"], `function crearContador() {
  let valor = 0;
  return function () {
    valor++;
    return valor;
  };
}
const contar = crearContador();
console.log(contar());
console.log(contar());`, ["La función externa debe devolver otra función.", "La función interna modifica <code>valor</code>."], ["Un closure conserva acceso a su ámbito léxico.", "Cada contador mantiene su propio estado."], [{ name: "cada instancia mantiene estado independiente", expression: "(() => { const a = crearContador(); const b = crearContador(); return a() === 1 && a() === 2 && b() === 1; })()" }]),
      debug("m06-l05", "El retorno perdido", "Distinguir calcular de devolver.", "La función realiza el cálculo, pero el resultado se pierde si no se devuelve explícitamente.", `function aplicarDescuento(precio, porcentaje) {
  precio - precio * porcentaje / 100;
}

console.log(aplicarDescuento(200, 10));`, ["180"], `function aplicarDescuento(precio, porcentaje) {
  return precio - precio * porcentaje / 100;
}
console.log(aplicarDescuento(200, 10));`, ["Una expresión por sí sola no sale de la función.", "Agrega <code>return</code> delante del cálculo."], ["La salida de una función forma parte de su contrato."], [{ name: "funciona con distintos descuentos", expression: "aplicarDescuento(100, 0) === 100 && aplicarDescuento(100, 50) === 50" }])
    ],
    m07: [
      code("m07-l04", "Elimina duplicados", "Usar Set para obtener valores únicos.", "Un <code>Set</code> conserva valores únicos. Puedes convertirlo nuevamente en array con spread.", `function unicos(valores) {
  // Devuelve un array sin duplicados
}

console.log(unicos([2, 2, 3, 4, 4]).join(", "));`, ["2, 3, 4"], `function unicos(valores) {
  return [...new Set(valores)];
}
console.log(unicos([2, 2, 3, 4, 4]).join(", "));`, ["Crea <code>new Set(valores)</code>.", "Usa spread para convertir el Set en array."], ["Set expresa mejor la intención de unicidad que un bucle manual."], [{ name: "conserva orden y acepta texto", expression: "JSON.stringify(unicos(['a','b','a'])) === JSON.stringify(['a','b']) && unicos([]).length === 0" }]),
      debug("m07-l05", "Map devuelve undefined", "Recordar el return en callbacks con llaves.", "Una arrow function con llaves necesita <code>return</code>. Sin él, <code>map</code> crea una lista de undefined.", `const numeros = [1, 2, 3];
const dobles = numeros.map((numero) => {
  numero * 2;
});
console.log(dobles.join(", "));`, ["2, 4, 6"], `const numeros = [1, 2, 3];
const dobles = numeros.map((numero) => {
  return numero * 2;
});
console.log(dobles.join(", "));`, ["El callback abre llaves: debe devolver algo.", "Agrega <code>return</code> al cálculo."], ["Map conserva la cantidad de elementos y transforma cada uno."], [{ name: "no modifica el array original", expression: "JSON.stringify(dobles) === '[2,4,6]' && JSON.stringify(numeros) === '[1,2,3]'" }])
    ],
    m08: [
      code("m08-l04", "Agrupa ventas", "Construir un objeto acumulador.", "Reduce puede acumular un objeto. Cada categoría se convierte en una clave cuyo valor aumenta con cada venta.", `function agruparVentas(ventas) {
  return ventas.reduce((totales, venta) => {
    // Suma venta.monto en totales[venta.categoria]
    return totales;
  }, {});
}

const resumen = agruparVentas([
  { categoria: "libros", monto: 10 },
  { categoria: "libros", monto: 15 },
  { categoria: "cursos", monto: 30 }
]);
console.log(resumen.libros);
console.log(resumen.cursos);`, ["25", "30"], `function agruparVentas(ventas) {
  return ventas.reduce((totales, venta) => {
    totales[venta.categoria] = (totales[venta.categoria] || 0) + venta.monto;
    return totales;
  }, {});
}
const resumen = agruparVentas([{ categoria: "libros", monto: 10 }, { categoria: "libros", monto: 15 }, { categoria: "cursos", monto: 30 }]);
console.log(resumen.libros);
console.log(resumen.cursos);`, ["Inicializa una categoría ausente con cero.", "Devuelve el acumulador en cada vuelta."], ["Los corchetes permiten claves calculadas."], [{ name: "agrupa categorías nuevas y entrada vacía", expression: "agruparVentas([]) && Object.keys(agruparVentas([])).length === 0 && agruparVentas([{categoria:'x',monto:4}]).x === 4" }]),
      debug("m08-l05", "La propiedad equivocada", "Usar desestructuración para encontrar un typo.", "El objeto tiene <code>precio</code>, pero el cálculo intenta leer una propiedad que no existe.", `const libro = { titulo: "Eloquent JS", precio: 20 };
const total = libro.precioUnitario * 2;
console.log(total);`, ["40"], `const libro = { titulo: "Eloquent JS", precio: 20 };
const total = libro.precio * 2;
console.log(total);`, ["Inspecciona las claves reales del objeto.", "Usa <code>libro.precio</code>."], ["Undefined en una operación numérica suele producir NaN."], [{ name: "el total usa la propiedad existente", expression: "total === libro.precio * 2 && total === 40" }])
    ],
    m09: [
      dom("m09-l04", "Construye una tarjeta", "Crear una estructura DOM completa.", "Crea elementos semánticos, define su contenido y agrúpalos antes de insertarlos.", `<main><section id="catalogo"></section></main>`, `const producto = { nombre: "Mouse", precio: 25 };
const catalogo = document.querySelector("#catalogo");

// Crea un article.producto con h2 y p
// El p debe mostrar: Precio: $25
`, `const producto = { nombre: "Mouse", precio: 25 };
const catalogo = document.querySelector("#catalogo");
const tarjeta = document.createElement("article");
tarjeta.className = "producto";
const titulo = document.createElement("h2");
titulo.textContent = producto.nombre;
const precio = document.createElement("p");
precio.textContent = "Precio: $" + producto.precio;
tarjeta.append(titulo, precio);
catalogo.append(tarjeta);`, [{ selector: "#catalogo article.producto", count: 1 }, { selector: ".producto h2", text: "Mouse" }, { selector: ".producto p", text: "Precio: $25" }], ["Crea article, h2 y p por separado.", "Usa append para componer la tarjeta."], ["La estructura semántica facilita estilos y accesibilidad."]),
      dom("m09-l05", "Diseña un estado vacío", "Representar ausencia de datos.", "Una interfaz vacía debe explicar qué ocurre y ofrecer una acción, no mostrar un panel en blanco.", `<section id="resultados"><ul id="lista"></ul></section>`, `const datos = [];
const resultados = document.querySelector("#resultados");

// Si datos está vacío, agrega un p con clase "vacio"
// Texto: "No hay resultados. Prueba otra búsqueda."
`, `const datos = [];
const resultados = document.querySelector("#resultados");
if (datos.length === 0) {
  const mensaje = document.createElement("p");
  mensaje.className = "vacio";
  mensaje.textContent = "No hay resultados. Prueba otra búsqueda.";
  resultados.append(mensaje);
}`, [{ selector: "#resultados .vacio", count: 1 }, { selector: ".vacio", text: "No hay resultados. Prueba otra búsqueda." }], ["Comprueba <code>datos.length === 0</code>.", "Crea un párrafo con clase y texto claros."], ["Los estados vacíos también forman parte del producto."])
    ],
    m10: [
      dom("m10-l04", "Delegación de eventos", "Gestionar una lista con un solo listener.", "La delegación escucha en un ancestro y usa <code>event.target</code> para identificar el elemento activado.", `<ul id="acciones"><li><button data-id="a">Ada</button></li><li><button data-id="b">Lin</button></li></ul><p id="seleccion"></p>`, `const lista = document.querySelector("#acciones");
const seleccion = document.querySelector("#seleccion");

lista.addEventListener("click", (event) => {
  // Si el target es button, muestra su data-id
});

document.querySelector('[data-id="b"]').click();`, `const lista = document.querySelector("#acciones");
const seleccion = document.querySelector("#seleccion");
lista.addEventListener("click", (event) => {
  if (event.target.matches("button")) {
    seleccion.textContent = event.target.dataset.id;
  }
});
document.querySelector('[data-id="b"]').click();`, [{ selector: "#seleccion", text: "b" }], ["Comprueba <code>event.target.matches('button')</code>.", "Lee el dato con <code>event.target.dataset.id</code>."], ["Un listener puede manejar elementos presentes y futuros."]),
      dom("m10-l05", "Error de formulario accesible", "Validar y enfocar el campo problemático.", "Un buen error explica cómo corregir y mueve el foco al campo inválido cuando corresponde.", `<form id="perfil"><label>Email <input id="email" value="correo-invalido"></label><button>Guardar</button><p id="error" role="alert"></p></form>`, `const formulario = document.querySelector("#perfil");
const email = document.querySelector("#email");
const error = document.querySelector("#error");

formulario.addEventListener("submit", (event) => {
  event.preventDefault();
  // Si email no incluye @, muestra "Incluye un @ en el correo"
});
formulario.requestSubmit();`, `const formulario = document.querySelector("#perfil");
const email = document.querySelector("#email");
const error = document.querySelector("#error");
formulario.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!email.value.includes("@")) {
    error.textContent = "Incluye un @ en el correo";
    email.focus();
  }
});
formulario.requestSubmit();`, [{ selector: "#error", text: "Incluye un @ en el correo" }], ["Niega la comprobación <code>email.value.includes('@')</code>.", "Actualiza error y llama <code>email.focus()</code>."], ["El mensaje incluye causa y recuperación."])
    ],
    m11: [
      code("m11-l04", "Resultados parciales", "Usar Promise.allSettled.", "Cuando necesitas conocer éxitos y fallos sin cancelar todo el conjunto, <code>Promise.allSettled</code> devuelve el estado de cada promesa.", `async function resumirTareas(tareas) {
  // Devuelve cuántas promesas se cumplieron
}

const tareas = [Promise.resolve("A"), Promise.reject(new Error("fallo")), Promise.resolve("B")];
console.log(await resumirTareas(tareas));`, ["2"], `async function resumirTareas(tareas) {
  const resultados = await Promise.allSettled(tareas);
  return resultados.filter((resultado) => resultado.status === "fulfilled").length;
}
const tareas = [Promise.resolve("A"), Promise.reject(new Error("fallo")), Promise.resolve("B")];
console.log(await resumirTareas(tareas));`, ["Espera <code>Promise.allSettled(tareas)</code>.", "Filtra los resultados con status fulfilled."], ["AllSettled sirve cuando un fallo no debe ocultar los demás resultados."], [{ name: "cuenta cero, uno y varios éxitos", expression: "(await resumirTareas([])) === 0 && (await resumirTareas([Promise.resolve(1)])) === 1 && (await resumirTareas([Promise.reject('x')])) === 0" }]),
      debug("m11-l05", "La promesa sin esperar", "Corregir un valor Promise inesperado.", "Una función async devuelve una promesa. Para trabajar con su valor necesitas <code>await</code>.", `async function obtenerNumero() {
  return 21;
}

const numero = obtenerNumero();
console.log(numero * 2);`, ["42"], `async function obtenerNumero() {
  return 21;
}
const numero = await obtenerNumero();
console.log(numero * 2);`, ["Inspecciona qué devuelve una función async.", "Agrega <code>await</code> antes de la llamada."], ["Un Promise no es todavía su valor resuelto."], [{ name: "numero contiene el valor resuelto", expression: "numero === 21" }])
    ],
    m12: [
      code("m12-l04", "Procesa datos externos", "Validar y transformar una respuesta.", "Los datos externos deben pasar por una función que seleccione campos y descarte registros inválidos.", `function nombresActivos(usuarios) {
  // Conserva activos y devuelve sus nombres
}

const usuarios = [
  { nombre: "Ada", activo: true },
  { nombre: "Lin", activo: false },
  { nombre: "Grace", activo: true }
];
console.log(nombresActivos(usuarios).join(", "));`, ["Ada, Grace"], `function nombresActivos(usuarios) {
  return usuarios.filter((usuario) => usuario.activo).map((usuario) => usuario.nombre);
}
const usuarios = [{ nombre: "Ada", activo: true }, { nombre: "Lin", activo: false }, { nombre: "Grace", activo: true }];
console.log(nombresActivos(usuarios).join(", "));`, ["Filtra primero por <code>usuario.activo</code>.", "Después transforma cada objeto en su nombre."], ["No expongas objetos externos completos si solo necesitas un campo."], [{ name: "maneja listas vacías y todos inactivos", expression: "nombresActivos([]).length === 0 && nombresActivos([{nombre:'X',activo:false}]).length === 0" }]),
      debug("m12-l05", "Comprueba response.ok", "Convertir un estado HTTP fallido en error.", "Fetch solo rechaza por errores de red. Un estado HTTP 404 o 500 debe comprobarse con <code>response.ok</code>.", `async function leerRespuesta(response) {
  return response.json();
}

const response = { ok: false, status: 404, json: async () => ({ mensaje: "no encontrado" }) };
try {
  await leerRespuesta(response);
} catch (error) {
  console.log(error.message);
}`, ["HTTP 404"], `async function leerRespuesta(response) {
  if (!response.ok) throw new Error("HTTP " + response.status);
  return response.json();
}
const response = { ok: false, status: 404, json: async () => ({ mensaje: "no encontrado" }) };
try {
  await leerRespuesta(response);
} catch (error) {
  console.log(error.message);
}`, ["Antes de leer JSON, comprueba <code>!response.ok</code>.", "Lanza un Error que incluya response.status."], ["Los estados HTTP fallidos necesitan una ruta de recuperación."], [{ name: "devuelve JSON cuando la respuesta es válida", expression: "(await leerRespuesta({ok:true,status:200,json:async()=>({id:1})})).id === 1" }]),
      dom("m12-l07", "Tarjetas desde una API", "Renderizar datos remotos en el DOM.", "Consume la API simulada con <code>await apiSimulada(\"/usuarios\")</code>, lee el JSON y crea una tarjeta por registro. Construir nodos desde datos es el patrón central de las interfaces dinámicas.", `<main id="app"></main>`, `const app = document.querySelector("#app");

async function pintarUsuarios() {
  const response = await apiSimulada("/usuarios");
  const usuarios = await response.json();
  // Crea un <article class="card"> con el nombre de cada usuario y agrégalo a #app
}

pintarUsuarios();`, `const app = document.querySelector("#app");
async function pintarUsuarios() {
  const response = await apiSimulada("/usuarios");
  const usuarios = await response.json();
  for (const usuario of usuarios) {
    const card = document.createElement("article");
    card.className = "card";
    card.textContent = usuario.nombre;
    app.append(card);
  }
}
pintarUsuarios();`, [{ selector: "#app .card", count: 2 }, { selector: "#app .card", textIncludes: "Ada" }], ["Espera la API: <code>const response = await apiSimulada(\"/usuarios\")</code> y luego <code>await response.json()</code>.", "Recorre con for...of y crea un <code>article.card</code> por usuario."], ["Render desde datos remotos", "Una tarjeta por registro"])
    ],
    m13: [
      debug("m13-l04", "El último elemento desaparece", "Encontrar un error de límite.", "El bucle se detiene demasiado pronto y nunca procesa el último elemento.", `function sumar(numeros) {
  let total = 0;
  for (let i = 0; i < numeros.length - 1; i++) {
    total += numeros[i];
  }
  return total;
}
console.log(sumar([2, 3, 5]));`, ["10"], `function sumar(numeros) {
  let total = 0;
  for (let i = 0; i < numeros.length; i++) {
    total += numeros[i];
  }
  return total;
}
console.log(sumar([2, 3, 5]));`, ["Compara la condición con la forma habitual de recorrer un array.", "No restes 1 a length en la condición con <code><</code>."], ["Prueba arrays de uno y cero elementos."], [{ name: "maneja uno, varios y cero elementos", expression: "sumar([7]) === 7 && sumar([]) === 0 && sumar([1,2,3,4]) === 10" }]),
      code("m13-l05", "Valida un perfil", "Acumular errores de entrada.", "En formularios complejos conviene devolver todos los problemas encontrados, no detenerse en el primero.", `function validarPerfil(perfil) {
  const errores = [];
  // nombre debe tener 2+ caracteres
  // email debe incluir @
  return errores;
}

console.log(validarPerfil({ nombre: "A", email: "invalido" }).join(" | "));`, ["Nombre demasiado corto | Email inválido"], `function validarPerfil(perfil) {
  const errores = [];
  if (perfil.nombre.trim().length < 2) errores.push("Nombre demasiado corto");
  if (!perfil.email.includes("@")) errores.push("Email inválido");
  return errores;
}
console.log(validarPerfil({ nombre: "A", email: "invalido" }).join(" | "));`, ["Agrega cada error con <code>push</code>.", "No uses else: ambos campos pueden ser inválidos."], ["Un resultado estructurado permite mostrar errores cerca de cada campo."], [{ name: "acepta perfiles válidos y detecta un solo error", expression: "validarPerfil({nombre:'Ada',email:'a@b.com'}).length === 0 && validarPerfil({nombre:'Ada',email:'mal'}).length === 1" }])
    ],
    m14: [
      code("m14-l04", "Módulo mediante closure", "Exponer una API pequeña y proteger estado.", "Antes de usar clases o módulos ES, puedes practicar encapsulación devolviendo únicamente las operaciones públicas.", `function crearCarrito() {
  const productos = [];
  // Devuelve { agregar, total }
}

const carrito = crearCarrito();
carrito.agregar(10);
carrito.agregar(25);
console.log(carrito.total());`, ["35"], `function crearCarrito() {
  const productos = [];
  return {
    agregar(precio) { productos.push(precio); },
    total() { return productos.reduce((suma, precio) => suma + precio, 0); }
  };
}
const carrito = crearCarrito();
carrito.agregar(10);
carrito.agregar(25);
console.log(carrito.total());`, ["Devuelve un objeto con dos métodos.", "Los métodos conservan acceso al array productos."], ["Una API pública pequeña reduce acoplamiento."], [{ name: "cada carrito es independiente", expression: "(() => { const a=crearCarrito(); const b=crearCarrito(); a.agregar(5); return a.total()===5 && b.total()===0; })()" }]),
      debug("m14-l05", "Una prueba que no prueba", "Corregir una aserción débil.", "Una prueba que compara un valor consigo mismo siempre pasa y no verifica comportamiento útil.", `function sumar(a, b) {
  return a + b;
}

const resultado = sumar(2, 3);
asegurar(resultado === resultado, "sumar debe producir 5");
console.log("prueba útil");`, ["prueba útil"], `function sumar(a, b) {
  return a + b;
}
const resultado = sumar(2, 3);
asegurar(resultado === 5, "sumar debe producir 5");
console.log("prueba útil");`, ["La comparación debe incluir el resultado esperado.", "Compara <code>resultado === 5</code>."], ["Una prueba debe fallar si la implementación está rota."], [{ name: "la función funciona con otros casos", expression: "sumar(-1, 1) === 0 && sumar(10, 5) === 15" }]),
      code("m14-l07", "Herencia con extends y super", "Reutilizar y especializar una clase base.", "<code>extends</code> crea una subclase que hereda propiedades y métodos. En el constructor, <code>super(...)</code> invoca al de la clase base; <code>super.metodo()</code> reutiliza un método del padre para extenderlo.", `class Vehiculo {
  constructor(marca) { this.marca = marca; }
  describir() { return "Vehículo " + this.marca; }
}

class Auto extends Vehiculo {
  constructor(marca, puertas) {
    // Llama al constructor del padre y guarda puertas
  }
  describir() {
    // Reutiliza el método del padre y añade: " con N puertas"
  }
}

const auto = new Auto("Toyota", 4);
console.log(auto.describir());`, ["Vehículo Toyota con 4 puertas"], `class Vehiculo {
  constructor(marca) { this.marca = marca; }
  describir() { return "Vehículo " + this.marca; }
}
class Auto extends Vehiculo {
  constructor(marca, puertas) {
    super(marca);
    this.puertas = puertas;
  }
  describir() {
    return super.describir() + " con " + this.puertas + " puertas";
  }
}
const auto = new Auto("Toyota", 4);
console.log(auto.describir());`, ["En el constructor de Auto llama primero a <code>super(marca)</code>.", "En describir usa <code>super.describir()</code> y concatena las puertas."], ["extends hereda comportamiento", "super reutiliza al padre"], [{ name: "Auto es un Vehiculo", expression: "new Auto('X', 2) instanceof Vehiculo" }, { name: "reutiliza describir del padre", expression: "new Auto('Mazda', 2).describir() === 'Vehículo Mazda con 2 puertas'" }]),
      code("m14-l08", "Propiedades calculadas con get", "Exponer un valor derivado como atributo.", "Un <code>get</code> define una propiedad calculada: se accede como un atributo (<code>objeto.propiedad</code>, sin paréntesis) pero ejecuta una función. Sirve para derivar datos sin exponer la implementación interna.", `class Temperatura {
  constructor(celsius) { this.celsius = celsius; }
  // Define get fahrenheit: celsius * 9 / 5 + 32
}

const t = new Temperatura(25);
console.log(t.fahrenheit);`, ["77"], `class Temperatura {
  constructor(celsius) { this.celsius = celsius; }
  get fahrenheit() { return this.celsius * 9 / 5 + 32; }
}
const t = new Temperatura(25);
console.log(t.fahrenheit);`, ["Declara <code>get fahrenheit() { ... }</code> dentro de la clase.", "Devuelve <code>this.celsius * 9 / 5 + 32</code>."], ["get expone valores derivados", "Se accede sin paréntesis"], [{ name: "0°C son 32°F", expression: "new Temperatura(0).fahrenheit === 32" }, { name: "100°C son 212°F", expression: "new Temperatura(100).fahrenheit === 212" }])
    ]
  };

  for (const [unitId, lessons] of Object.entries(additions)) {
    const unit = course.modules.find((item) => item.id === unitId);
    if (unit) unit.lessons.push(...lessons);
  }

  const newProjects = [
    {
      id: "p05", number: "P5", title: "Explorador de países", subtitle: "Proyecto semiguiado", unlockAfter: "m12", duration: "2 h", level: "Proyecto avanzado",
      description: "Filtra, ordena y representa datos externos con estados de carga, vacío y error.",
      lessons: [
        code("p05-l01", "Motor de búsqueda", "Filtrar datos sin distinguir mayúsculas.", "Empieza por una función pura que puedas probar con muchos términos.", `function buscarPaises(paises, termino) {
  // Filtra por nombre sin distinguir mayúsculas
}

const paises = [{ nombre: "Chile" }, { nombre: "China" }, { nombre: "Perú" }];
console.log(buscarPaises(paises, "chi").map((pais) => pais.nombre).join(", "));`, ["Chile, China"], `function buscarPaises(paises, termino) {
  const consulta = termino.trim().toLowerCase();
  return paises.filter((pais) => pais.nombre.toLowerCase().includes(consulta));
}
const paises = [{ nombre: "Chile" }, { nombre: "China" }, { nombre: "Perú" }];
console.log(buscarPaises(paises, "chi").map((pais) => pais.nombre).join(", "));`, ["Normaliza el término una sola vez.", "Filtra comparando nombres en minúsculas."], ["La lógica pura se prueba sin DOM."], [{ name: "tolera espacios y términos ausentes", expression: "buscarPaises([{nombre:'Chile'}], ' chile ').length === 1 && buscarPaises([{nombre:'Perú'}], 'x').length === 0" }]),
        code("p05-l02", "Orden y límite", "Ordenar resultados sin mutar la fuente.", "Copia antes de ordenar y limita los resultados para evitar interfaces saturadas.", `function prepararResultados(paises, limite) {
  // Ordena por nombre y devuelve como máximo limite elementos
}

const datos = [{ nombre: "Perú" }, { nombre: "Chile" }, { nombre: "Argentina" }];
console.log(prepararResultados(datos, 2).map((pais) => pais.nombre).join(", "));`, ["Argentina, Chile"], `function prepararResultados(paises, limite) {
  return [...paises].sort((a, b) => a.nombre.localeCompare(b.nombre)).slice(0, limite);
}
const datos = [{ nombre: "Perú" }, { nombre: "Chile" }, { nombre: "Argentina" }];
console.log(prepararResultados(datos, 2).map((pais) => pais.nombre).join(", "));`, ["Copia con spread antes de sort.", "Usa localeCompare y después slice."], ["Ordenar el original sería una mutación inesperada."], [{ name: "no muta y respeta límites", expression: "(() => { const x=[{nombre:'B'},{nombre:'A'}]; const y=prepararResultados(x,1); return x[0].nombre==='B' && y.length===1 && y[0].nombre==='A'; })()" }]),
        dom("p05-l03", "Renderiza resultados", "Crear una lista accesible desde datos.", "Cada país será un artículo con nombre y región. La lista debe poder leerse sin depender de color.", `<main><section id="resultados" aria-live="polite"></section></main>`, `const paises = [
  { nombre: "Chile", region: "América" },
  { nombre: "Japón", region: "Asia" }
];
const resultados = document.querySelector("#resultados");

// Crea un article por país con h2 y p
`, `const paises = [{ nombre: "Chile", region: "América" }, { nombre: "Japón", region: "Asia" }];
const resultados = document.querySelector("#resultados");
for (const pais of paises) {
  const tarjeta = document.createElement("article");
  const titulo = document.createElement("h2");
  const region = document.createElement("p");
  titulo.textContent = pais.nombre;
  region.textContent = pais.region;
  tarjeta.append(titulo, region);
  resultados.append(tarjeta);
}`, [{ selector: "#resultados article", count: 2 }, { selector: "#resultados h2", textIncludes: "Chile" }, { selector: "#resultados", textIncludes: "Asia" }], ["Recorre países y crea tres nodos por vuelta.", "Agrega título y región a la tarjeta antes de insertarla."], ["aria-live anuncia cambios de resultados."]),
        quiz("p05-l04", "Decisión de producto", "Elegir una estrategia para errores de red.", "El buscador debe conservar una ruta de recuperación cuando la API falla.", "¿Qué interfaz ayuda más después de un error?", ["Un panel vacío", "Mensaje técnico sin acción", "Mensaje claro y botón Reintentar"], 2, "Un error útil explica el problema en lenguaje humano y ofrece una acción concreta.", ["Diseña carga, éxito, vacío y error antes de publicar."])
      ]
    },
    {
      id: "p06", number: "PF", title: "Kanban personal", subtitle: "Proyecto final", unlockAfter: "m14", duration: "4–6 h", level: "Proyecto final",
      description: "Construye una aplicación de tareas por columnas aplicando estado, eventos, persistencia, pruebas y accesibilidad.",
      lessons: [
        code("p06-l01", "Modelo de tarjetas", "Crear tareas con identidad y estado.", "El modelo debe generar una tarea nueva sin modificar la colección anterior.", `function crearTarea(tareas, titulo) {
  // Devuelve un nuevo array. Estado inicial: "pendiente"
}

const tareas = crearTarea([], "Diseñar interfaz");
console.log(tareas[0].titulo);
console.log(tareas[0].estado);`, ["Diseñar interfaz", "pendiente"], `function crearTarea(tareas, titulo) {
  const nueva = { id: tareas.length + 1, titulo, estado: "pendiente" };
  return [...tareas, nueva];
}
const tareas = crearTarea([], "Diseñar interfaz");
console.log(tareas[0].titulo);
console.log(tareas[0].estado);`, ["Crea un objeto con id, titulo y estado.", "Devuelve un array nuevo usando spread."], ["El estado del dominio no debe depender del DOM."], [{ name: "preserva tareas existentes", expression: "(() => { const base=[{id:1,titulo:'A',estado:'hecho'}]; const next=crearTarea(base,'B'); return base.length===1 && next.length===2 && next[1].estado==='pendiente'; })()" }]),
        code("p06-l02", "Mueve una tarjeta", "Actualizar por id de forma inmutable.", "Mover una tarea significa reemplazar solo el objeto cuyo id coincide.", `function moverTarea(tareas, id, estado) {
  // Devuelve una nueva colección
}

const tareas = [{ id: 1, titulo: "Aprender", estado: "pendiente" }];
console.log(moverTarea(tareas, 1, "hecho")[0].estado);`, ["hecho"], `function moverTarea(tareas, id, estado) {
  return tareas.map((tarea) => tarea.id === id ? { ...tarea, estado } : tarea);
}
const tareas = [{ id: 1, titulo: "Aprender", estado: "pendiente" }];
console.log(moverTarea(tareas, 1, "hecho")[0].estado);`, ["Usa map y compara cada id.", "Copia únicamente la tarea encontrada."], ["La actualización inmutable facilita guardar historial."], [{ name: "no altera otras tareas ni la colección original", expression: "(() => { const base=[{id:1,estado:'pendiente'},{id:2,estado:'pendiente'}]; const next=moverTarea(base,1,'hecho'); return base[0].estado==='pendiente' && next[0].estado==='hecho' && next[1]===base[1]; })()" }]),
        code("p06-l03", "Métricas del tablero", "Derivar estadísticas desde el estado.", "No guardes contadores duplicados: calcúlalos a partir de las tareas actuales.", `function resumen(tareas) {
  // Devuelve { pendientes, enCurso, hechas }
}

const tareas = [
  { estado: "pendiente" },
  { estado: "en-curso" },
  { estado: "hecho" },
  { estado: "hecho" }
];
const datos = resumen(tareas);
console.log(datos.pendientes + ", " + datos.enCurso + ", " + datos.hechas);`, ["1, 1, 2"], `function resumen(tareas) {
  return {
    pendientes: tareas.filter((tarea) => tarea.estado === "pendiente").length,
    enCurso: tareas.filter((tarea) => tarea.estado === "en-curso").length,
    hechas: tareas.filter((tarea) => tarea.estado === "hecho").length
  };
}
const tareas = [{ estado: "pendiente" }, { estado: "en-curso" }, { estado: "hecho" }, { estado: "hecho" }];
const datos = resumen(tareas);
console.log(datos.pendientes + ", " + datos.enCurso + ", " + datos.hechas);`, ["Filtra una vez por cada estado.", "Devuelve un objeto con las tres métricas."], ["Los datos derivados no necesitan sincronización manual."], [{ name: "maneja tablero vacío y distribuciones distintas", expression: "resumen([]).hechas===0 && resumen([{estado:'hecho'}]).hechas===1 && resumen([{estado:'pendiente'}]).pendientes===1" }]),
        dom("p06-l04", "Renderiza columnas", "Representar el tablero desde datos.", "Crea una tarjeta por tarea y colócala en la columna que corresponda a su estado.", `<main class="tablero"><section id="pendiente"><h2>Pendiente</h2></section><section id="en-curso"><h2>En curso</h2></section><section id="hecho"><h2>Hecho</h2></section></main>`, `const tareas = [
  { titulo: "Diseñar", estado: "pendiente" },
  { titulo: "Programar", estado: "en-curso" },
  { titulo: "Probar", estado: "hecho" }
];

// Crea article.tarea y agrégalo a la sección cuyo id coincide con estado
`, `const tareas = [{ titulo: "Diseñar", estado: "pendiente" }, { titulo: "Programar", estado: "en-curso" }, { titulo: "Probar", estado: "hecho" }];
for (const tarea of tareas) {
  const tarjeta = document.createElement("article");
  tarjeta.className = "tarea";
  tarjeta.textContent = tarea.titulo;
  document.querySelector("#" + tarea.estado).append(tarjeta);
}`, [{ selector: ".tablero article.tarea", count: 3 }, { selector: "#pendiente .tarea", text: "Diseñar" }, { selector: "#hecho .tarea", text: "Probar" }], ["Recorre las tareas y crea un article.", "Construye el selector con '#' + tarea.estado."], ["El estado decide dónde se representa cada tarjeta."]),
        quiz("p06-l05", "Defensa final", "Evaluar la definición de terminado.", "Antes de considerar terminado el Kanban, debes demostrar comportamiento, accesibilidad y capacidad de recuperación.", "¿Qué entrega demuestra mejor dominio?", ["Una captura bonita", "Código que funciona solo con los datos de ejemplo", "Aplicación usable con teclado, pruebas, persistencia y README"], 2, "Un proyecto profesional incluye evidencia reproducible, no solo una apariencia final.", ["Siguiente paso fuera del laboratorio: reconstruye este proyecto en archivos reales y publícalo con Git."])
      ]
    }
  ];

  const oldFinal = course.projects.find((project) => project.id === "p04");
  if (oldFinal) {
    oldFinal.number = "P4";
    oldFinal.subtitle = "Proyecto avanzado";
    oldFinal.level = "Proyecto avanzado";
  }
  course.projects.push(...newProjects);

  const existingTests = {
    "m01-l02": [{ name: "las variables conservan sus valores", expression: "nombre === 'Ada' && lenguaje === 'JavaScript'" }],
    "m01-l03": [{ name: "el marcador se actualiza desde su valor anterior", expression: "puntos === 15" }],
    "m02-l02": [{ name: "el total combina cantidad y envío", expression: "total === precio * cantidad + envio && total === 4100" }],
    "m02-l03": [{ name: "la suma produce un número", expression: "resultado === 10 && typeof resultado === 'number'" }],
    "m03-l03": [{ name: "la normalización elimina espacios y mayúsculas", expression: "usuario === 'ada.lovelace'" }],
    "m04-l03": [{ name: "el permiso depende de las tres reglas", expression: "puedeEntrar === true" }],
    "m05-l03": [{ name: "el acumulador contiene la suma completa", expression: "total === numeros.reduce((suma, numero) => suma + numero, 0)" }],
    "m06-l02": [{ name: "convierte otros límites", expression: "celsiusAFahrenheit(0) === 32 && celsiusAFahrenheit(100) === 212" }],
    "m06-l03": [{ name: "acepta saludo explícito y predeterminado", expression: "saludar('Ada') === 'Hola, Ada' && saludar('Ada','Bienvenida') === 'Bienvenida, Ada'" }],
    "m07-l02": [{ name: "filtra otras edades", expression: "JSON.stringify([17,18,19].filter((edad)=>edad>=18)) === '[18,19]' && adultos.every((edad)=>edad>=18)" }],
    "m07-l03": [{ name: "el total aplica descuento a todos", expression: "total === 54" }],
    "m08-l03": [{ name: "la copia no modifica el original", expression: "actualizado !== usuario && actualizado.plan === 'pro' && usuario.plan === 'gratis'" }],
    "m11-l02": [{ name: "la función devuelve una promesa resuelta", expression: "(await obtenerEstado()) === 'listo'" }],
    "m13-l02": [{ name: "divide normalmente y protege cero", expression: "dividir(8,2) === 4 && (()=>{try{dividir(1,0);return false}catch(e){return true}})()" }],
    "m13-l03": [{ name: "promedia listas distintas", expression: "promedio([2,4]) === 3 && promedio([5]) === 5" }],
    "m14-l02": [{ name: "cada cuenta mantiene su saldo", expression: "(() => { const a=new Cuenta('A'); const b=new Cuenta('B'); a.depositar(10); return a.saldo===10 && b.saldo===0; })()" }],
    "m14-l03": [{ name: "duplicar funciona con cero y negativos", expression: "duplicar(0) === 0 && duplicar(-3) === -6" }],
    "p01-l01": [{ name: "calcula distintos porcentajes", expression: "calcularCuenta(200,10).total === 220 && calcularCuenta(50,0).propina === 0" }],
    "p02-l01": [{ name: "evalúa aciertos y errores", expression: "evaluar('x','x') === 1 && evaluar('x','y') === 0" }],
    "p03-l01": [{ name: "agrega sin mutar", expression: "(() => { const base=[]; const next=agregarTarea(base,'X'); return base.length===0 && next.length===1 && next[0].completada===false; })()" }],
    "p03-l02": [{ name: "alterna solo la tarea indicada", expression: "(() => { const base=[{id:1,completada:false},{id:2,completada:false}]; const next=alternar(base,2); return next[0].completada===false && next[1].completada===true; })()" }],
    "p04-l01": [{ name: "calcula rachas vacías y cortadas", expression: "calcularRacha([]) === 0 && calcularRacha([true,true]) === 2 && calcularRacha([true,false]) === 0" }]
  };

  for (const unit of [...course.modules, ...course.projects]) {
    for (const lesson of unit.lessons) {
      if ((!lesson.tests || lesson.tests.length === 0) && existingTests[lesson.id]) lesson.tests = existingTests[lesson.id];
    }
  }

  course.refresh();
})(typeof window !== "undefined" ? window : globalThis);
