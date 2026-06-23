(function (global) {
  "use strict";

  const quiz = (id, title, goal, theory, question, options, answer, explanation, keyPoints = []) => ({
    id, type: "quiz", title, goal, theory, question, options, answer, explanation, keyPoints
  });

  const code = (id, title, goal, theory, starter, expected, solution, hints, keyPoints = [], validation = "exact") => ({
    id, type: "code", title, goal, theory, starter, expected, solution, hints, keyPoints, validation
  });

  const dom = (id, title, goal, theory, html, starter, solution, checks, hints, keyPoints = []) => ({
    id, type: "dom", title, goal, theory, html, starter, solution, checks, hints, keyPoints
  });

  const modules = [
    {
      id: "m01", number: 1, title: "Primeros pasos", subtitle: "Valores, variables y consola", duration: "35 min", level: "Inicio",
      description: "Entiende cómo JavaScript guarda información y comunícate con la consola.",
      lessons: [
        quiz("m01-l01", "JavaScript piensa en valores", "Distinguir un valor de una variable.", "Un <code>valor</code> es un dato. Una <code>variable</code> es un nombre que apunta a ese dato. <code>let edad = 28</code> crea la variable <code>edad</code> y guarda el número <code>28</code>.", "¿Cuál línea crea una variable que luego puede cambiar?", ["const ciudad = 'Santiago'", "let puntos = 10", "console.log(10)"], 1, "<code>let</code> permite reasignar el valor. <code>const</code> protege la referencia y <code>console.log</code> solo muestra información.", ["Usa <code>const</code> por defecto.", "Usa <code>let</code> cuando el valor necesite cambiar."]),
        code("m01-l02", "Presenta a tu programa", "Crear variables y mostrarlas.", "La consola es el primer canal de conversación con tu programa. <code>console.log()</code> puede mostrar varios valores.", `const nombre = "Ada";
const lenguaje = "JavaScript";

// Muestra: Ada aprende JavaScript
console.log();`, ["Ada aprende JavaScript"], `const nombre = "Ada";
const lenguaje = "JavaScript";
console.log(nombre + " aprende " + lenguaje);`, ["Pasa valores dentro de <code>console.log(...)</code>.", "Puedes unir textos y variables con el operador <code>+</code>."], ["Los nombres de variables deben describir su intención.", "La salida esperada distingue mayúsculas y espacios."]),
        code("m01-l03", "Actualiza el marcador", "Reasignar una variable con let.", "La asignación <code>=</code> reemplaza el valor anterior. Para sumar sobre el mismo valor puedes usar <code>puntos = puntos + 5</code>.", `let puntos = 10;

// Suma 5 puntos y muestra el resultado

console.log(puntos);`, ["15"], `let puntos = 10;
puntos = puntos + 5;
console.log(puntos);`, ["La variable fue creada con <code>let</code>, por lo tanto puede cambiar.", "Usa el valor actual de <code>puntos</code> para calcular el siguiente."], ["Una constante no se puede reasignar.", "JavaScript ejecuta el archivo de arriba hacia abajo."])
      ]
    },
    {
      id: "m02", number: 2, title: "Tipos y operadores", subtitle: "Números, textos y conversiones", duration: "40 min", level: "Inicio",
      description: "Opera con datos sin caer en las conversiones silenciosas de JavaScript.",
      lessons: [
        quiz("m02-l01", "El tipo importa", "Reconocer tipos primitivos.", "JavaScript tiene valores <code>number</code>, <code>string</code>, <code>boolean</code>, <code>undefined</code>, <code>null</code>, <code>bigint</code> y <code>symbol</code>. <code>typeof</code> ayuda a inspeccionarlos.", "¿Qué devuelve <code>typeof '42'</code>?", ["number", "string", "text"], 1, "Las comillas convierten el contenido en una cadena, aunque visualmente parezca un número.", ["El tipo pertenece al valor, no al nombre de la variable.", "<code>typeof</code> es útil para diagnosticar entradas."]),
        code("m02-l02", "Calcula un total", "Combinar operadores aritméticos.", "Los operadores siguen precedencia matemática: multiplicación y división antes que suma y resta. Los paréntesis vuelven explícita la intención.", `const precio = 1200;
const cantidad = 3;
const envio = 500;

// Calcula precio * cantidad + envio
const total = 0;
console.log(total);`, ["4100"], `const precio = 1200;
const cantidad = 3;
const envio = 500;
const total = precio * cantidad + envio;
console.log(total);`, ["Multiplica primero el precio por la cantidad.", "Después suma el costo de envío."], ["<code>%</code> devuelve el resto de una división.", "Paréntesis claros evitan errores de precedencia."]),
        code("m02-l03", "Convierte antes de sumar", "Transformar texto numérico a número.", "Los datos de formularios suelen llegar como texto. <code>Number(valor)</code> intenta convertirlos. Sin conversión, <code>'8' + '2'</code> produce <code>'82'</code>.", `const primeraEntrada = "8";
const segundaEntrada = "2";

// Convierte ambas entradas y suma
const resultado = primeraEntrada + segundaEntrada;
console.log(resultado);`, ["10"], `const primeraEntrada = "8";
const segundaEntrada = "2";
const resultado = Number(primeraEntrada) + Number(segundaEntrada);
console.log(resultado);`, ["Envuelve cada entrada con <code>Number(...)</code>.", "La conversión debe ocurrir antes de usar <code>+</code>."], ["<code>Number('')</code> devuelve 0.", "<code>Number('hola')</code> devuelve <code>NaN</code>."])
      ]
    },
    {
      id: "m03", number: 3, title: "Texto con intención", subtitle: "Strings y plantillas", duration: "35 min", level: "Inicio",
      description: "Construye mensajes claros, transforma texto y valida cadenas.",
      lessons: [
        quiz("m03-l01", "Plantillas legibles", "Elegir template literals.", "Las plantillas usan acentos graves: <code>`Hola ${nombre}`</code>. Permiten insertar expresiones sin cadenas de signos <code>+</code>.", "¿Qué sintaxis inserta correctamente la variable <code>nombre</code>?", ["'Hola {nombre}'", "`Hola ${nombre}`", "\"Hola $nombre\""], 1, "La interpolación usa <code>${expresión}</code> dentro de acentos graves.", ["Las plantillas aceptan expresiones completas.", "También pueden ocupar varias líneas."]),
        code("m03-l02", "Genera una ficha", "Interpolar variables en una plantilla.", "Una plantilla puede combinar texto, variables y cálculos. El resultado sigue siendo un string.", `const producto = "Teclado";
const precio = 45;
const unidades = 2;

// Muestra: 2 x Teclado = $90
console.log();`, ["2 x Teclado = $90"], `const producto = "Teclado";
const precio = 45;
const unidades = 2;
console.log(unidades + " x " + producto + " = $" + (precio * unidades));`, ["Usa las variables dentro de <code>console.log</code>.", "Multiplica <code>precio * unidades</code> antes de unir el texto."], ["Interpolar suele ser más legible que concatenar.", "El símbolo $ puede ser parte del texto literal."]),
        code("m03-l03", "Normaliza un usuario", "Aplicar métodos de string.", "Los strings incluyen métodos como <code>trim()</code>, <code>toLowerCase()</code> y <code>includes()</code>. Cada método devuelve un nuevo string.", `const entrada = "  Ada.Lovelace  ";

// Quita espacios y convierte a minúsculas
const usuario = entrada;
console.log(usuario);`, ["ada.lovelace"], `const entrada = "  Ada.Lovelace  ";
const usuario = entrada.trim().toLowerCase();
console.log(usuario);`, ["Primero elimina los espacios externos con <code>trim()</code>.", "Puedes encadenar <code>.toLowerCase()</code> sobre el resultado."], ["Los strings son inmutables.", "Encadenar métodos expresa una secuencia de transformación."])
      ]
    },
    {
      id: "m04", number: 4, title: "Decisiones", subtitle: "Booleanos y condicionales", duration: "45 min", level: "Base",
      description: "Haz que el programa elija caminos de forma predecible.",
      lessons: [
        quiz("m04-l01", "Comparar sin sorpresas", "Usar igualdad estricta.", "<code>===</code> compara tipo y valor. <code>==</code> convierte tipos antes de comparar y puede esconder errores.", "¿Cuál expresión es verdadera?", ["5 === '5'", "5 === 5", "false === 0"], 1, "Solo <code>5 === 5</code> mantiene el mismo tipo y valor.", ["Prefiere siempre <code>===</code> y <code>!==</code>.", "Una comparación produce un booleano."]),
        code("m04-l02", "Clasifica una nota", "Construir if / else if / else.", "Ordena condiciones desde la más exigente a la más general. La primera condición verdadera detiene la cadena.", `const nota = 82;

// 90+: excelente, 70+: aprobado, resto: repasar
let resultado = "";

console.log(resultado);`, ["aprobado"], `const nota = 82;
let resultado = "";
if (nota >= 90) {
  resultado = "excelente";
} else if (nota >= 70) {
  resultado = "aprobado";
} else {
  resultado = "repasar";
}
console.log(resultado);`, ["Comienza comprobando <code>nota >= 90</code>.", "El segundo camino usa <code>else if</code>."], ["El orden de las condiciones cambia el resultado.", "Usa llaves incluso para una sola línea."]),
        code("m04-l03", "Permiso de acceso", "Combinar condiciones lógicas.", "<code>&&</code> exige que ambas condiciones sean verdaderas. <code>||</code> acepta al menos una. <code>!</code> invierte un booleano.", `const edad = 22;
const tieneEntrada = true;
const suspendido = false;

// Puede entrar si es adulto, tiene entrada y no está suspendido
const puedeEntrar = false;
console.log(puedeEntrar);`, ["true"], `const edad = 22;
const tieneEntrada = true;
const suspendido = false;
const puedeEntrar = edad >= 18 && tieneEntrada && !suspendido;
console.log(puedeEntrar);`, ["Necesitas tres condiciones unidas con <code>&&</code>.", "Invierte <code>suspendido</code> con <code>!</code>."], ["Nombra booleanos como preguntas: <code>esValido</code>, <code>puedeEntrar</code>.", "Los operadores lógicos cortocircuitan."])
      ]
    },
    {
      id: "m05", number: 5, title: "Repetición controlada", subtitle: "Bucles e iteración", duration: "45 min", level: "Base",
      description: "Automatiza tareas repetitivas sin perder el control del flujo.",
      lessons: [
        quiz("m05-l01", "El bucle adecuado", "Elegir entre for y while.", "Usa <code>for</code> cuando conoces la cantidad de repeticiones. <code>while</code> funciona mejor cuando repites hasta que cambie una condición.", "¿Qué bucle elegirías para recorrer 10 posiciones?", ["for", "while (true)", "if"], 0, "Un <code>for</code> reúne inicio, condición e incremento en una línea.", ["Todo bucle necesita una condición de salida.", "Evita modificar el contador en varios lugares."]),
        code("m05-l02", "Cuenta hacia adelante", "Escribir un bucle for.", "Un <code>for</code> típico tiene: inicialización, condición e incremento. Cada vuelta ejecuta el bloque entre llaves.", `// Muestra 1, 2, 3, 4 y 5 (una línea por número)
for (let i = 0; i < 0; i++) {
  console.log(i);
}`, ["1", "2", "3", "4", "5"], `for (let i = 1; i <= 5; i++) {
  console.log(i);
}`, ["El contador debe comenzar en 1.", "La condición debe incluir el 5: usa <code><=</code>."], ["<code>i++</code> suma uno después de cada vuelta.", "El contador suele llamarse <code>i</code> solo en bucles cortos."]),
        code("m05-l03", "Suma acumulada", "Usar un acumulador.", "Un acumulador vive fuera del bucle y se actualiza en cada vuelta. Es un patrón central para totales, conteos y combinaciones.", `const numeros = [3, 7, 2, 8];
let total = 0;

for (const numero of numeros) {
  // Acumula numero en total
}

console.log(total);`, ["20"], `const numeros = [3, 7, 2, 8];
let total = 0;
for (const numero of numeros) {
  total = total + numero;
}
console.log(total);`, ["Actualiza <code>total</code> dentro del bucle.", "Suma el valor actual de <code>numero</code>."], ["<code>for...of</code> recorre valores de un iterable.", "Inicializa el acumulador con el elemento neutro: 0 para sumas."])
      ]
    },
    {
      id: "m06", number: 6, title: "Funciones", subtitle: "Entradas, salidas y alcance", duration: "55 min", level: "Base",
      description: "Divide problemas en piezas pequeñas que puedas probar y reutilizar.",
      lessons: [
        quiz("m06-l01", "Una responsabilidad", "Identificar una función cohesionada.", "Una buena función recibe datos, realiza una tarea concreta y devuelve un resultado. Los nombres verbales hacen visible esa tarea.", "¿Cuál nombre comunica mejor su intención?", ["hacerCosa", "calcularTotal", "funcion1"], 1, "<code>calcularTotal</code> describe una acción y su resultado.", ["Funciones pequeñas son más fáciles de probar.", "Evita depender de variables globales."]),
        code("m06-l02", "Crea un conversor", "Definir parámetros y return.", "Los parámetros son entradas locales. <code>return</code> entrega el resultado y termina la función.", `function celsiusAFahrenheit(celsius) {
  // Fórmula: celsius * 9 / 5 + 32
}

console.log(celsiusAFahrenheit(20));`, ["68"], `function celsiusAFahrenheit(celsius) {
  return celsius * 9 / 5 + 32;
}
console.log(celsiusAFahrenheit(20));`, ["La función debe devolver el cálculo con <code>return</code>.", "No uses <code>console.log</code> dentro de la función; devuelve el dato."], ["Separar cálculo y presentación mejora la reutilización.", "Un parámetro solo existe dentro de su función."]),
        code("m06-l03", "Valor por defecto", "Usar parámetros predeterminados.", "Un parámetro puede tener un valor predeterminado. Se usa cuando el argumento correspondiente es <code>undefined</code> o no fue enviado.", `function saludar(nombre, saludo) {
  return saludo + ", " + nombre;
}

console.log(saludar("Lin"));`, ["Hola, Lin"], `function saludar(nombre, saludo = "Hola") {
  return saludo + ", " + nombre;
}
console.log(saludar("Lin"));`, ["Asigna el valor por defecto en la lista de parámetros.", "La forma es <code>saludo = 'Hola'</code>."], ["Los parámetros opcionales suelen ir al final.", "Un valor predeterminado documenta el comportamiento normal."])
      ]
    },
    {
      id: "m07", number: 7, title: "Colecciones", subtitle: "Arrays y transformaciones", duration: "60 min", level: "Intermedio",
      description: "Modela listas y transforma datos con métodos declarativos.",
      lessons: [
        quiz("m07-l01", "Índices desde cero", "Comprender posiciones en arrays.", "El primer elemento de un array vive en el índice <code>0</code>. La cantidad de elementos está en <code>length</code>.", "En <code>['a','b','c']</code>, ¿qué devuelve la posición 1?", ["a", "b", "c"], 1, "El índice 1 corresponde al segundo elemento.", ["Último índice: <code>array.length - 1</code>.", "<code>push</code> añade al final."]),
        code("m07-l02", "Filtra resultados", "Usar filter con una función.", "<code>filter</code> crea un nuevo array con los elementos cuya prueba devuelve <code>true</code>.", `const edades = [12, 21, 17, 30, 16, 25];

const adultos = edades.filter((edad) => {
  // Devuelve true para 18 o más
});

console.log(adultos.join(", "));`, ["21, 30, 25"], `const edades = [12, 21, 17, 30, 16, 25];
const adultos = edades.filter((edad) => {
  return edad >= 18;
});
console.log(adultos.join(", "));`, ["La función de filtro debe devolver una comparación.", "Comprueba <code>edad >= 18</code>."], ["<code>filter</code> no modifica el array original.", "<code>join</code> convierte una lista en texto."]),
        code("m07-l03", "Transforma precios", "Encadenar map y reduce.", "<code>map</code> transforma cada elemento. <code>reduce</code> combina todos los elementos en un resultado único.", `const precios = [10, 20, 30];

// Aplica 10% de descuento y suma los nuevos precios
const total = precios
  .map((precio) => precio)
  .reduce((suma, precio) => suma, 0);

console.log(total);`, ["54"], `const precios = [10, 20, 30];
const total = precios
  .map((precio) => precio * 0.9)
  .reduce((suma, precio) => suma + precio, 0);
console.log(total);`, ["En <code>map</code>, multiplica cada precio por <code>0.9</code>.", "En <code>reduce</code>, suma <code>precio</code> al acumulador."], ["Cada paso del encadenamiento debe tener una intención clara.", "No encadenes métodos si una sola pasada es más legible."])
      ]
    },
    {
      id: "m08", number: 8, title: "Objetos", subtitle: "Datos con estructura", duration: "55 min", level: "Intermedio",
      description: "Agrupa propiedades relacionadas y modela entidades del mundo real.",
      lessons: [
        quiz("m08-l01", "Propiedades con nombre", "Acceder a un objeto.", "La notación de punto es directa: <code>usuario.nombre</code>. Los corchetes son útiles cuando la clave es dinámica: <code>usuario[clave]</code>.", "¿Cuándo necesitas corchetes?", ["Cuando la clave viene en una variable", "Siempre", "Solo para números"], 0, "La notación <code>objeto[clave]</code> evalúa el contenido de la variable <code>clave</code>.", ["Los objetos agrupan datos por significado.", "Una propiedad puede contener cualquier tipo de valor."]),
        code("m08-l02", "Resume un producto", "Leer propiedades y calcular.", "Un objeto mantiene juntas las características de una entidad. Puedes extraer datos con desestructuración.", `const producto = {
  nombre: "Monitor",
  precio: 250,
  stock: 4
};

// Muestra: Monitor | inventario: $1000
console.log();`, ["Monitor | inventario: $1000"], `const producto = { nombre: "Monitor", precio: 250, stock: 4 };
const { nombre, precio, stock } = producto;
console.log(nombre + " | inventario: $" + (precio * stock));`, ["Lee <code>nombre</code>, <code>precio</code> y <code>stock</code>.", "El valor de inventario es <code>precio * stock</code>."], ["Desestructurar reduce repetición.", "No desestructures si vuelve ambiguo el origen del dato."]),
        code("m08-l03", "Copia sin mutar", "Usar spread en objetos.", "El operador spread <code>...</code> crea una copia superficial. Las propiedades escritas después reemplazan las anteriores.", `const usuario = { nombre: "Sam", plan: "gratis", activo: true };

// Crea otro objeto cambiando solo el plan a "pro"
const actualizado = usuario;

console.log(actualizado.plan);
console.log(usuario.plan);`, ["pro", "gratis"], `const usuario = { nombre: "Sam", plan: "gratis", activo: true };
const actualizado = { ...usuario, plan: "pro" };
console.log(actualizado.plan);
console.log(usuario.plan);`, ["Crea un objeto nuevo con <code>{ ...usuario }</code>.", "Agrega <code>plan: 'pro'</code> después del spread."], ["Copiar evita efectos laterales inesperados.", "Spread solo copia un nivel de profundidad."])
      ]
    },
    {
      id: "m09", number: 9, title: "El navegador", subtitle: "DOM y contenido dinámico", duration: "65 min", level: "Intermedio",
      description: "Convierte datos en interfaces y modifica la página con JavaScript.",
      lessons: [
        quiz("m09-l01", "Encuentra un elemento", "Elegir selectores DOM.", "<code>document.querySelector()</code> devuelve el primer elemento que coincide con un selector CSS. <code>querySelectorAll()</code> devuelve una colección.", "¿Qué selector encuentra un elemento con id <code>saludo</code>?", ["document.querySelector('.saludo')", "document.querySelector('#saludo')", "document.querySelector('saludo')"], 1, "En CSS y querySelector, el prefijo <code>#</code> identifica un id.", ["Usa selectores específicos pero no frágiles.", "Comprueba que un elemento exista antes de usarlo."]),
        dom("m09-l02", "Cambia el mensaje", "Modificar texto y clases.", "<code>textContent</code> cambia texto sin interpretar HTML. <code>classList.add()</code> aplica una clase sin reemplazar las existentes.", `<main class="demo-card"><h2 id="mensaje">Pendiente</h2></main>`, `const mensaje = document.querySelector("#mensaje");

// Cambia el texto a "¡Completado!"
// Agrega la clase "listo"
`, `const mensaje = document.querySelector("#mensaje");
mensaje.textContent = "¡Completado!";
mensaje.classList.add("listo");`, [{ selector: "#mensaje", text: "¡Completado!" }, { selector: "#mensaje.listo", count: 1 }], ["Asigna el nuevo texto a <code>mensaje.textContent</code>.", "Usa <code>mensaje.classList.add('listo')</code>."], ["Prefiere <code>textContent</code> para texto del usuario.", "Las clases mantienen los estilos separados de la lógica."]),
        dom("m09-l03", "Crea una lista", "Generar elementos desde datos.", "<code>createElement</code> crea un nodo. <code>append</code> lo agrega al documento. Repite el patrón para cada dato.", `<section><h2>Lenguajes</h2><ul id="lista"></ul></section>`, `const lenguajes = ["JavaScript", "HTML", "CSS"];
const lista = document.querySelector("#lista");

// Crea un <li> por cada lenguaje y agrégalo a la lista
`, `const lenguajes = ["JavaScript", "HTML", "CSS"];
const lista = document.querySelector("#lista");
for (const lenguaje of lenguajes) {
  const item = document.createElement("li");
  item.textContent = lenguaje;
  lista.append(item);
}`, [{ selector: "#lista li", count: 3 }, { selector: "#lista li", textIncludes: "JavaScript" }], ["Dentro del bucle crea un elemento con <code>document.createElement('li')</code>.", "Define su <code>textContent</code> y luego usa <code>lista.append(item)</code>."], ["Construir nodos evita inyectar HTML no confiable.", "Para muchas filas, considera <code>DocumentFragment</code>."])
      ]
    },
    {
      id: "m10", number: 10, title: "Interacción", subtitle: "Eventos y formularios", duration: "65 min", level: "Intermedio",
      description: "Responde a acciones del usuario y transforma entradas en comportamiento.",
      lessons: [
        quiz("m10-l01", "Escucha, no adivines", "Comprender addEventListener.", "Los eventos describen acciones: <code>click</code>, <code>input</code>, <code>submit</code>. <code>addEventListener</code> conecta un evento con una función.", "¿Qué evento usarías para reaccionar al envío de un formulario?", ["click", "submit", "load"], 1, "El evento <code>submit</code> cubre botón, teclado y otras formas de envío.", ["Escucha el evento semántico, no solo el clic.", "El objeto evento contiene contexto de la acción."]),
        dom("m10-l02", "Botón contador", "Actualizar la interfaz al hacer clic.", "El callback de un evento se ejecuta cada vez que ocurre la acción. El estado puede vivir en una variable cerrada por la función.", `<section><button id="sumar">Sumar</button><strong id="contador">0</strong></section>`, `let total = 0;
const boton = document.querySelector("#sumar");
const contador = document.querySelector("#contador");

boton.addEventListener("click", () => {
  // Suma uno y actualiza el texto
});

// Simulamos dos clics para validar
boton.click();
boton.click();`, `let total = 0;
const boton = document.querySelector("#sumar");
const contador = document.querySelector("#contador");
boton.addEventListener("click", () => {
  total += 1;
  contador.textContent = total;
});
boton.click();
boton.click();`, [{ selector: "#contador", text: "2" }], ["Dentro del evento usa <code>total += 1</code>.", "Después asigna <code>total</code> a <code>contador.textContent</code>."], ["Mantén una sola fuente de verdad para el estado.", "Actualiza la interfaz después de cambiar el estado."]),
        dom("m10-l03", "Valida un formulario", "Interceptar submit y mostrar feedback.", "<code>event.preventDefault()</code> evita la recarga tradicional. La interfaz debe explicar qué falta y cómo corregirlo.", `<form id="registro"><label>Nombre <input id="nombre" value="Ada"></label><button>Guardar</button></form><p id="estado"></p>`, `const formulario = document.querySelector("#registro");
const nombre = document.querySelector("#nombre");
const estado = document.querySelector("#estado");

formulario.addEventListener("submit", (event) => {
  // Evita la recarga y muestra "Guardado: Ada"
});

formulario.requestSubmit();`, `const formulario = document.querySelector("#registro");
const nombre = document.querySelector("#nombre");
const estado = document.querySelector("#estado");
formulario.addEventListener("submit", (event) => {
  event.preventDefault();
  estado.textContent = "Guardado: " + nombre.value;
});
formulario.requestSubmit();`, [{ selector: "#estado", text: "Guardado: Ada" }], ["El primer paso es <code>event.preventDefault()</code>.", "Lee el campo con <code>nombre.value</code>."], ["Usa etiquetas visibles para los inputs.", "Los mensajes de error deben estar cerca del campo."])
      ]
    },
    {
      id: "m11", number: 11, title: "Asincronía", subtitle: "Promesas y async/await", duration: "60 min", level: "Avanzando",
      description: "Coordina operaciones que terminan más tarde sin bloquear la interfaz.",
      lessons: [
        quiz("m11-l01", "Esperar sin bloquear", "Entender una promesa.", "Una promesa representa un resultado futuro. Puede estar pendiente, cumplida o rechazada. <code>await</code> pausa solo la función async que la contiene.", "¿Dónde puedes usar <code>await</code> de forma normal?", ["Dentro de una función async", "En cualquier función", "Solo dentro de setTimeout"], 0, "Una función marcada con <code>async</code> permite usar <code>await</code> y siempre devuelve una promesa.", ["La interfaz sigue respondiendo mientras espera.", "Un rechazo debe manejarse."]),
        code("m11-l02", "Espera un resultado", "Consumir una promesa con await.", "La función <code>esperar</code> incluida en el laboratorio resuelve un valor tras un breve retraso.", `async function obtenerEstado() {
  const estado = await esperar("listo", 50);
  return estado;
}

// Espera la función y muestra el resultado
`, ["listo"], `async function obtenerEstado() {
  const estado = await esperar("listo", 50);
  return estado;
}
const resultado = await obtenerEstado();
console.log(resultado);`, ["Llama <code>await obtenerEstado()</code>.", "Guarda el resultado y luego muéstralo."], ["<code>await</code> hace legible una secuencia asíncrona.", "No olvides manejar fallos con try/catch."]),
        code("m11-l03", "Tareas en paralelo", "Combinar promesas con Promise.all.", "Si dos tareas no dependen entre sí, iniciarlas juntas reduce el tiempo total. <code>Promise.all</code> espera todos sus resultados.", `const tareaA = esperar("A", 80);
const tareaB = esperar("B", 40);

// Espera ambas en paralelo y muestra: A+B
`, ["A+B"], `const tareaA = esperar("A", 80);
const tareaB = esperar("B", 40);
const [a, b] = await Promise.all([tareaA, tareaB]);
console.log(a + "+" + b);`, ["Pasa ambas promesas dentro de un array a <code>Promise.all</code>.", "Desestructura los resultados como <code>[a, b]</code>."], ["Paralelo no significa multihilo.", "Si una promesa falla, <code>Promise.all</code> rechaza el conjunto."])
      ]
    },
    {
      id: "m12", number: 12, title: "Datos remotos", subtitle: "Fetch, JSON y estados", duration: "65 min", level: "Avanzando",
      description: "Consume datos externos y representa carga, éxito y error.",
      lessons: [
        quiz("m12-l01", "Una respuesta no es el dato", "Comprender el flujo de fetch.", "<code>fetch</code> devuelve una respuesta HTTP. Después debes leer su cuerpo, normalmente con <code>response.json()</code>.", "¿Qué comprueba que una respuesta HTTP fue exitosa?", ["response.ok", "response.json", "response.data"], 0, "<code>response.ok</code> cubre estados entre 200 y 299.", ["Comprueba el estado antes de leer los datos.", "Modela explícitamente carga, éxito, vacío y error."]),
        code("m12-l02", "Consume una API simulada", "Leer JSON de forma segura.", "El laboratorio incluye <code>apiSimulada('/usuarios')</code> para practicar offline. Su interfaz imita una respuesta de fetch.", `const respuesta = await apiSimulada("/usuarios");

// Obtén el JSON y muestra el primer nombre
`, ["Ada"], `const respuesta = await apiSimulada("/usuarios");
const usuarios = await respuesta.json();
console.log(usuarios[0].nombre);`, ["Llama <code>await respuesta.json()</code>.", "El resultado es un array; accede a la posición 0 y su propiedad <code>nombre</code>."], ["JSON convierte datos, no comportamiento.", "Valida la forma del dato cuando viene de fuera."]),
        code("m12-l03", "Maneja un fallo", "Usar try/catch con async.", "Una operación de red puede fallar. <code>try/catch</code> permite transformar el error técnico en una respuesta controlada.", `try {
  await apiSimulada("/fallo");
} catch (error) {
  // Muestra: No se pudo cargar
}`, ["No se pudo cargar"], `try {
  await apiSimulada("/fallo");
} catch (error) {
  console.log("No se pudo cargar");
}`, ["Escribe <code>console.log</code> dentro del bloque <code>catch</code>.", "Muestra exactamente el mensaje solicitado."], ["No ocultes el error sin ofrecer recuperación.", "Registra detalles técnicos aparte del mensaje al usuario."])
      ]
    },
    {
      id: "m13", number: 13, title: "Código resistente", subtitle: "Errores, depuración y validación", duration: "55 min", level: "Avanzando",
      description: "Detecta supuestos rotos y convierte fallos en información útil.",
      lessons: [
        quiz("m13-l01", "Falla con contexto", "Distinguir error de validación.", "Lanzar un error es apropiado cuando una función no puede cumplir su contrato. El mensaje debe explicar qué condición falló.", "¿Qué mensaje ayuda más a corregir el problema?", ["Error", "Algo salió mal", "La cantidad debe ser mayor que cero"], 2, "Un mensaje específico comunica causa y camino de corrección.", ["Valida en los límites del sistema.", "No uses excepciones para flujo normal."]),
        code("m13-l02", "Protege una división", "Lanzar y capturar errores.", "<code>throw new Error(mensaje)</code> detiene el flujo actual. El consumidor decide si puede recuperarse.", `function dividir(a, b) {
  // Lanza "No se puede dividir por cero" si b es 0
  return a / b;
}

try {
  dividir(10, 0);
} catch (error) {
  console.log(error.message);
}`, ["No se puede dividir por cero"], `function dividir(a, b) {
  if (b === 0) {
    throw new Error("No se puede dividir por cero");
  }
  return a / b;
}
try {
  dividir(10, 0);
} catch (error) {
  console.log(error.message);
}`, ["Compara <code>b === 0</code> antes de dividir.", "Dentro del <code>if</code>, usa <code>throw new Error(...)</code>."], ["Haz explícitas las precondiciones.", "Prueba también el camino exitoso."]),
        code("m13-l03", "Elimina un bug", "Leer un síntoma y aislar la causa.", "Depurar no es cambiar líneas al azar: reproduce, reduce, formula una hipótesis, comprueba y recién entonces corrige.", `function promedio(numeros) {
  let total = 0;
  for (const numero of numeros) {
    total = numero; // Hay un bug aquí
  }
  return total / numeros.length;
}

console.log(promedio([10, 20, 30]));`, ["20"], `function promedio(numeros) {
  let total = 0;
  for (const numero of numeros) {
    total += numero;
  }
  return total / numeros.length;
}
console.log(promedio([10, 20, 30]));`, ["Observa qué ocurre con <code>total</code> en cada vuelta.", "Debe acumular, no reemplazar: usa <code>+=</code>."], ["Un caso pequeño facilita seguir el estado.", "Corrige la causa, no el síntoma."])
      ]
    },
    {
      id: "m14", number: 14, title: "Diseño de software", subtitle: "Clases, módulos y pruebas", duration: "70 min", level: "Construcción",
      description: "Organiza código creciente y verifica comportamiento con pruebas pequeñas.",
      lessons: [
        quiz("m14-l01", "Composición primero", "Elegir una estructura mantenible.", "Las clases son útiles cuando existen instancias con estado y comportamiento. Para transformar datos, una función simple suele ser suficiente.", "¿Qué usarías para sumar dos precios sin estado?", ["Una clase con constructor", "Una función", "Una variable global"], 1, "Una función expresa el cálculo sin introducir estructura innecesaria.", ["Usa la herramienta más simple que mantenga claridad.", "Separa datos, lógica e interfaz."]),
        code("m14-l02", "Modela una cuenta", "Crear una clase con estado.", "Una clase define la forma de sus instancias. El constructor establece el estado inicial y los métodos expresan operaciones válidas.", `class Cuenta {
  constructor(titular) {
    this.titular = titular;
    this.saldo = 0;
  }

  depositar(cantidad) {
    // Actualiza el saldo
  }
}

const cuenta = new Cuenta("Ada");
cuenta.depositar(50);
console.log(cuenta.saldo);`, ["50"], `class Cuenta {
  constructor(titular) {
    this.titular = titular;
    this.saldo = 0;
  }
  depositar(cantidad) {
    this.saldo += cantidad;
  }
}
const cuenta = new Cuenta("Ada");
cuenta.depositar(50);
console.log(cuenta.saldo);`, ["Dentro del método, accede al estado con <code>this.saldo</code>.", "Suma <code>cantidad</code> al saldo actual."], ["Protege invariantes dentro de los métodos.", "No conviertas cada objeto de datos en una clase."]),
        code("m14-l03", "Escribe una prueba", "Comprobar resultados automáticamente.", "Una prueba tiene tres partes: preparar datos, ejecutar y afirmar el resultado. La función <code>asegurar</code> del laboratorio lanza un error si la condición es falsa.", `function duplicar(numero) {
  return numero * 2;
}

// Comprueba que duplicar(4) sea 8
// Si pasa, muestra: prueba superada
`, ["prueba superada"], `function duplicar(numero) {
  return numero * 2;
}
asegurar(duplicar(4) === 8, "duplicar debe devolver el doble");
console.log("prueba superada");`, ["Llama <code>asegurar(condición, mensaje)</code>.", "La condición compara <code>duplicar(4) === 8</code>."], ["Una prueba debe fallar por una razón clara.", "Prueba casos límite, no solo el camino feliz."])
      ]
    }
  ];

  const projects = [
    {
      id: "p01", number: "P1", title: "Calculadora de propinas", subtitle: "Proyecto guiado", unlockAfter: "m03", duration: "45 min", level: "Proyecto",
      description: "Construye una calculadora visual usando valores, funciones y DOM.",
      lessons: [
        code("p01-l01", "La regla de negocio", "Calcular propina y total.", "Antes de crear una interfaz, convierte la regla en una función fácil de probar.", `function calcularCuenta(consumo, porcentaje) {
  // Devuelve un objeto con propina y total
}

const cuenta = calcularCuenta(100, 15);
console.log(cuenta.propina);
console.log(cuenta.total);`, ["15", "115"], `function calcularCuenta(consumo, porcentaje) {
  const propina = consumo * porcentaje / 100;
  return { propina, total: consumo + propina };
}
const cuenta = calcularCuenta(100, 15);
console.log(cuenta.propina);
console.log(cuenta.total);`, ["Calcula <code>consumo * porcentaje / 100</code>.", "Devuelve un objeto con <code>propina</code> y <code>total</code>."], ["Empieza por la lógica independiente de la interfaz."]),
        dom("p01-l02", "Muestra el resultado", "Conectar cálculo e interfaz.", "Ahora aplica el cálculo a una pequeña interfaz. Mantén el formato de salida solicitado.", `<section><input id="consumo" value="80"><input id="porcentaje" value="10"><button id="calcular">Calcular</button><p id="resultado"></p></section>`, `const boton = document.querySelector("#calcular");
const resultado = document.querySelector("#resultado");

boton.addEventListener("click", () => {
  const consumo = Number(document.querySelector("#consumo").value);
  const porcentaje = Number(document.querySelector("#porcentaje").value);
  // Muestra: Total: $88
});

boton.click();`, `const boton = document.querySelector("#calcular");
const resultado = document.querySelector("#resultado");
boton.addEventListener("click", () => {
  const consumo = Number(document.querySelector("#consumo").value);
  const porcentaje = Number(document.querySelector("#porcentaje").value);
  const total = consumo + consumo * porcentaje / 100;
  resultado.textContent = "Total: $" + total;
});
boton.click();`, [{ selector: "#resultado", text: "Total: $88" }], ["Calcula el total dentro del evento.", "Actualiza <code>resultado.textContent</code>."], ["La interfaz traduce estado a una representación visible."]),
        quiz("p01-l03", "Revisión del proyecto", "Explicar una decisión técnica.", "Un proyecto se consolida cuando puedes explicar por qué funciona. Separar cálculo y DOM permite probar la regla sin abrir el navegador.", "¿Qué parte debería probarse con casos como consumo cero o porcentaje negativo?", ["Solo el CSS", "La función de cálculo", "El texto del botón"], 1, "La función contiene las reglas y debe proteger sus casos límite.", ["Añade validación antes de considerar terminado el proyecto."])
      ]
    },
    {
      id: "p02", number: "P2", title: "Quiz interactivo", subtitle: "Proyecto guiado", unlockAfter: "m06", duration: "60 min", level: "Proyecto",
      description: "Modela preguntas, calcula puntaje y entrega feedback inmediato.",
      lessons: [
        code("p02-l01", "Evalúa una respuesta", "Crear una función pura de evaluación.", "Una función pura facilita probar la lógica del juego.", `function evaluar(respuesta, correcta) {
  // Devuelve 1 si son iguales; 0 si no
}

console.log(evaluar("b", "b"));
console.log(evaluar("a", "b"));`, ["1", "0"], `function evaluar(respuesta, correcta) {
  return respuesta === correcta ? 1 : 0;
}
console.log(evaluar("b", "b"));
console.log(evaluar("a", "b"));`, ["Compara con <code>===</code>.", "Puedes usar un operador ternario."], ["El puntaje es un dato derivado de respuestas."]),
        code("p02-l02", "Calcula el puntaje", "Combinar map y reduce.", "Representa cada respuesta como dato y deja que la colección produzca el total.", `const respuestas = ["b", "a", "c"];
const correctas = ["b", "b", "c"];

// Calcula cuántas respuestas coinciden
let puntaje = 0;

console.log(puntaje);`, ["2"], `const respuestas = ["b", "a", "c"];
const correctas = ["b", "b", "c"];
const puntaje = respuestas.reduce((total, respuesta, indice) => {
  return total + (respuesta === correctas[indice] ? 1 : 0);
}, 0);
console.log(puntaje);`, ["<code>reduce</code> también entrega el índice actual.", "Suma 1 cuando <code>respuesta === correctas[indice]</code>."], ["Mantén preguntas y respuestas alineadas mediante ids en una app real."]),
        dom("p02-l03", "Entrega feedback", "Representar un resultado visual.", "Convierte el puntaje en un mensaje que ayude al estudiante a decidir qué hacer después.", `<section><h2>Resultado</h2><p id="puntaje"></p><p id="mensaje"></p></section>`, `const aciertos = 4;
const total = 5;
const puntaje = document.querySelector("#puntaje");
const mensaje = document.querySelector("#mensaje");

// Muestra "4 de 5" y "¡Muy bien!"
`, `const aciertos = 4;
const total = 5;
const puntaje = document.querySelector("#puntaje");
const mensaje = document.querySelector("#mensaje");
puntaje.textContent = aciertos + " de " + total;
mensaje.textContent = "¡Muy bien!";`, [{ selector: "#puntaje", text: "4 de 5" }, { selector: "#mensaje", text: "¡Muy bien!" }], ["Usa una plantilla para combinar los números.", "Define ambos <code>textContent</code>."], ["El feedback debe ser específico y accionable."])
      ]
    },
    {
      id: "p03", number: "P3", title: "Gestor de tareas", subtitle: "Proyecto guiado", unlockAfter: "m10", duration: "90 min", level: "Proyecto",
      description: "Construye el núcleo de una aplicación CRUD con estado y renderizado.",
      lessons: [
        code("p03-l01", "Modela el estado", "Añadir tareas sin mutar.", "Cada tarea necesita identidad y estado. Devuelve una nueva colección para evitar cambios difíciles de rastrear.", `function agregarTarea(tareas, texto) {
  // Devuelve un nuevo array con { id, texto, completada: false }
}

const tareas = agregarTarea([], "Aprender arrays");
console.log(tareas[0].texto);
console.log(tareas[0].completada);`, ["Aprender arrays", "false"], `function agregarTarea(tareas, texto) {
  const nueva = { id: tareas.length + 1, texto, completada: false };
  return [...tareas, nueva];
}
const tareas = agregarTarea([], "Aprender arrays");
console.log(tareas[0].texto);
console.log(tareas[0].completada);`, ["Crea un objeto para la nueva tarea.", "Devuelve <code>[...tareas, nueva]</code>."], ["El estado es la fuente de verdad de la interfaz."]),
        code("p03-l02", "Alterna una tarea", "Actualizar una entidad por id.", "<code>map</code> permite reemplazar solo el elemento que coincide y conservar los demás.", `function alternar(tareas, id) {
  return tareas.map((tarea) => {
    // Cambia completada solo si el id coincide
    return tarea;
  });
}

const resultado = alternar([{ id: 1, completada: false }], 1);
console.log(resultado[0].completada);`, ["true"], `function alternar(tareas, id) {
  return tareas.map((tarea) => {
    return tarea.id === id ? { ...tarea, completada: !tarea.completada } : tarea;
  });
}
const resultado = alternar([{ id: 1, completada: false }], 1);
console.log(resultado[0].completada);`, ["Compara <code>tarea.id === id</code>.", "Copia la tarea y cambia <code>completada</code> por su inverso."], ["Actualizaciones inmutables hacen visibles los cambios."]),
        dom("p03-l03", "Renderiza las tareas", "Convertir estado en DOM.", "Renderizar significa producir la interfaz a partir del estado actual. Primero limpia, luego crea cada fila.", `<section><h2>Tareas</h2><ul id="tareas"></ul></section>`, `const tareas = [
  { texto: "Practicar funciones", completada: true },
  { texto: "Construir un proyecto", completada: false }
];
const lista = document.querySelector("#tareas");

for (const tarea of tareas) {
  // Crea un li, define el texto y agrega clase "completada" cuando corresponda
}`, `const tareas = [
  { texto: "Practicar funciones", completada: true },
  { texto: "Construir un proyecto", completada: false }
];
const lista = document.querySelector("#tareas");
for (const tarea of tareas) {
  const item = document.createElement("li");
  item.textContent = tarea.texto;
  if (tarea.completada) item.classList.add("completada");
  lista.append(item);
}`, [{ selector: "#tareas li", count: 2 }, { selector: "#tareas li.completada", count: 1 }], ["Crea un <code>li</code> dentro del bucle.", "Usa un <code>if</code> para agregar la clase."], ["Una función render puede ejecutarse tras cada cambio de estado. "])
      ]
    },
    {
      id: "p04", number: "PF", title: "Dashboard de hábitos", subtitle: "Proyecto final", unlockAfter: "m14", duration: "2–3 h", level: "Proyecto final",
      description: "Integra datos, asincronía, interfaz, errores y pruebas en una experiencia completa.",
      lessons: [
        code("p04-l01", "Calcula una racha", "Resolver una regla de producto.", "El dashboard necesita métricas derivadas. Empieza con una función que cuente días consecutivos cumplidos desde el final.", `function calcularRacha(dias) {
  let racha = 0;
  // Recorre desde el final y detente al encontrar false
  return racha;
}

console.log(calcularRacha([true, false, true, true, true]));`, ["3"], `function calcularRacha(dias) {
  let racha = 0;
  for (let i = dias.length - 1; i >= 0; i--) {
    if (!dias[i]) break;
    racha++;
  }
  return racha;
}
console.log(calcularRacha([true, false, true, true, true]));`, ["Comienza en <code>dias.length - 1</code>.", "Usa <code>break</code> cuando encuentres <code>false</code>."], ["Las métricas deben derivarse, no duplicarse en el estado."]),
        code("p04-l02", "Carga el perfil", "Combinar datos remotos y fallback.", "Un producto resistente define qué mostrar si un servicio falla.", `async function cargarNombre() {
  try {
    const respuesta = await apiSimulada("/perfil");
    const perfil = await respuesta.json();
    return perfil.nombre;
  } catch (error) {
    // Devuelve "Visitante" como fallback
  }
}

console.log(await cargarNombre());`, ["Ada"], `async function cargarNombre() {
  try {
    const respuesta = await apiSimulada("/perfil");
    const perfil = await respuesta.json();
    return perfil.nombre;
  } catch (error) {
    return "Visitante";
  }
}
console.log(await cargarNombre());`, ["El camino exitoso ya está completo.", "Dentro de <code>catch</code>, devuelve el texto de respaldo."], ["Un fallback mantiene utilizable el producto."]),
        dom("p04-l03", "Construye el resumen", "Renderizar métricas accesibles.", "La interfaz final debe comunicar las métricas con texto, no solo con color.", `<main><h1 id="saludo"></h1><section id="metricas"></section></main>`, `const usuario = { nombre: "Ada", racha: 7, completados: 12 };
const saludo = document.querySelector("#saludo");
const metricas = document.querySelector("#metricas");

// Saludo: "Hola, Ada"
// Crea dos elementos <p> dentro de métricas con "Racha: 7 días" y "Completados: 12"
`, `const usuario = { nombre: "Ada", racha: 7, completados: 12 };
const saludo = document.querySelector("#saludo");
const metricas = document.querySelector("#metricas");
saludo.textContent = "Hola, " + usuario.nombre;
const racha = document.createElement("p");
racha.textContent = "Racha: " + usuario.racha + " días";
const completados = document.createElement("p");
completados.textContent = "Completados: " + usuario.completados;
metricas.append(racha, completados);`, [{ selector: "#saludo", text: "Hola, Ada" }, { selector: "#metricas p", count: 2 }, { selector: "#metricas", textIncludes: "Racha: 7 días" }], ["Empieza actualizando el saludo.", "Crea dos párrafos y agrégalos con <code>append</code>."], ["Texto y estructura semántica mejoran accesibilidad."]),
        quiz("p04-l04", "Entrega con criterio", "Aplicar una definición de terminado.", "Un proyecto no termina cuando solo funciona en tu caso. Debe manejar errores, ser operable con teclado, adaptarse a móvil y tener pruebas de sus reglas críticas.", "¿Cuál evidencia es más sólida antes de publicar?", ["Se ve bien en mi pantalla", "Funciona después de recargar una vez", "Pruebas, revisión móvil, teclado y estados de error"], 2, "La calidad se demuestra cubriendo flujos, tamaños y fallos previsibles.", ["Documenta decisiones y mejoras pendientes.", "Celebra el resultado, pero conserva una lista concreta de deuda técnica."])
      ]
    }
  ];

  const allUnits = [...modules, ...projects];
  const allLessons = allUnits.flatMap((unit) => unit.lessons.map((lesson, index) => ({ ...lesson, unitId: unit.id, index })));

  global.COURSE_DATA = {
    title: "JavaScript Lab",
    version: 3,
    modules,
    projects,
    allUnits,
    allLessons,
    lessonCount: allLessons.length,
    getUnit(id) { return this.allUnits.find((unit) => unit.id === id); },
    getLesson(id) { return this.allLessons.find((lesson) => lesson.id === id); },
    refresh() {
      this.allUnits = [...this.modules, ...this.projects];
      this.allLessons = this.allUnits.flatMap((unit) => unit.lessons.map((lesson, index) => ({ ...lesson, unitId: unit.id, index })));
      this.lessonCount = this.allLessons.length;
      return this;
    }
  };
})(typeof window !== "undefined" ? window : globalThis);
