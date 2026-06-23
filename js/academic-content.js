(function (global) {
  "use strict";

  const course = global.COURSE_DATA;
  if (!course) throw new Error("COURSE_DATA debe cargarse antes del contenido académico.");

  const moduleAcademics = {
    m01: { essentialQuestion: "¿Cómo representa un programa información cambiante sin perder claridad?", prerequisites: ["Ninguno"], competencies: ["Declara datos con intención", "Distingue valores constantes y variables", "Separa cálculo y presentación"] },
    m02: { essentialQuestion: "¿Cómo afectan los tipos y las conversiones a la corrección de un cálculo?", prerequisites: ["Variables", "Consola"], competencies: ["Reconoce tipos primitivos", "Convierte entradas explícitamente", "Comprueba resultados numéricos"] },
    m03: { essentialQuestion: "¿Cómo transformar texto sin introducir inconsistencias?", prerequisites: ["Variables", "Tipos"], competencies: ["Normaliza strings", "Compone mensajes legibles", "Encadena transformaciones"] },
    m04: { essentialQuestion: "¿Cómo traducir reglas del mundo real en decisiones inequívocas?", prerequisites: ["Comparaciones", "Booleanos"], competencies: ["Ordena condiciones", "Combina reglas lógicas", "Prueba valores límite"] },
    m05: { essentialQuestion: "¿Cómo repetir una operación garantizando que termine y produzca el resultado correcto?", prerequisites: ["Condicionales", "Arrays básicos"], competencies: ["Selecciona un bucle", "Controla límites", "Usa acumuladores"] },
    m06: { essentialQuestion: "¿Cómo diseñar funciones predecibles, reutilizables y fáciles de probar?", prerequisites: ["Variables", "Condicionales", "Bucles"], competencies: ["Define contratos", "Usa parámetros y return", "Comprende alcance y closures"] },
    m07: { essentialQuestion: "¿Cómo transformar colecciones preservando significado y evitando mutaciones accidentales?", prerequisites: ["Funciones", "Callbacks"], competencies: ["Selecciona map/filter/reduce", "Usa Set", "Mantiene inmutabilidad"] },
    m08: { essentialQuestion: "¿Cómo modelar entidades y relaciones con estructuras de datos coherentes?", prerequisites: ["Arrays", "Funciones"], competencies: ["Modela objetos", "Actualiza por identidad", "Agrupa y deriva datos"] },
    m09: { essentialQuestion: "¿Cómo convertir datos en una interfaz semántica y verificable?", prerequisites: ["Objetos", "Arrays", "Funciones"], competencies: ["Selecciona nodos", "Crea estructura semántica", "Representa estados vacíos"] },
    m10: { essentialQuestion: "¿Cómo coordinar estado, eventos y feedback accesible?", prerequisites: ["DOM", "Funciones"], competencies: ["Escucha eventos semánticos", "Valida formularios", "Sincroniza estado e interfaz"] },
    m11: { essentialQuestion: "¿Cómo razonar sobre operaciones que terminan en momentos distintos?", prerequisites: ["Funciones", "Errores"], competencies: ["Espera promesas", "Coordina concurrencia", "Gestiona rechazos"] },
    m12: { essentialQuestion: "¿Cómo transformar datos externos no confiables en estados seguros de producto?", prerequisites: ["Promesas", "Arrays", "Objetos"], competencies: ["Comprueba respuestas", "Valida datos", "Modela carga, éxito y error"] },
    m13: { essentialQuestion: "¿Cómo convertir fallos en evidencia para diagnosticar y mejorar el programa?", prerequisites: ["Funciones", "Control de flujo"], competencies: ["Reproduce errores", "Valida contratos", "Escribe mensajes recuperables"] },
    m14: { essentialQuestion: "¿Cómo organizar software creciente sin perder capacidad de cambio?", prerequisites: ["Todo el trayecto anterior"], competencies: ["Encapsula estado", "Diseña APIs pequeñas", "Escribe pruebas significativas"] }
  };

  const assessment = (config) => ({
    type: "code",
    isAssessment: true,
    cognitiveLevel: "Analizar y crear",
    estimatedMinutes: 30,
    evidence: "Solución general, casos ocultos y justificación técnica",
    validation: "exact",
    ...config
  });

  const domAssessment = (config) => ({
    type: "dom",
    isAssessment: true,
    cognitiveLevel: "Crear y evaluar",
    estimatedMinutes: 35,
    evidence: "Interfaz verificable, semántica y explicación de decisiones",
    ...config
  });

  const assessments = {
    m01: assessment({
      id: "m01-l06", title: "Evaluación: presupuesto de estudio", goal: "Modelar y presentar un cálculo sin depender de valores impresos directamente.",
      theory: "Integra declaraciones, reasignación controlada y separación entre datos, cálculo y presentación.",
      starter: `const material = "libros";
const cantidad = 4;
const precio = 18;
const descuento = 6;

// Calcula subtotal y total. Muestra: 4 libros | total: $66
`, expected: ["4 libros | total: $66"],
      solution: `const material = "libros";
const cantidad = 4;
const precio = 18;
const descuento = 6;
const subtotal = cantidad * precio;
const total = subtotal - descuento;
console.log(cantidad + " " + material + " | total: $" + total);`,
      hints: ["Calcula primero cantidad * precio.", "El descuento se resta al subtotal, no al precio unitario."],
      keyPoints: ["No imprimas 66 directamente.", "Nombra cada resultado intermedio."],
      misconception: "Una salida correcta no demuestra comprensión si el resultado fue escrito manualmente.",
      reflectionPrompt: "Explica por qué subtotal y total deben ser variables diferentes y qué cambiaría si aumenta la cantidad.",
      rubric: ["Cálculo derivado de los datos", "Nombres con intención", "Formato exacto sin valores hardcodeados"],
      tests: [{ name: "subtotal y total conservan la relación matemática", expression: "subtotal === cantidad * precio && total === subtotal - descuento" }]
    }),
    m02: assessment({
      id: "m02-l06", title: "Evaluación: entrada numérica confiable", goal: "Convertir, calcular y verificar datos recibidos como texto.",
      theory: "Una entrada externa debe convertirse explícitamente antes de participar en operaciones aritméticas.",
      starter: `const horasTexto = "48";
const horasExtraTexto = "8";

// Convierte y suma. Muestra: 56 horas
`, expected: ["56 horas"],
      solution: `const horasTexto = "48";
const horasExtraTexto = "8";
const horas = Number(horasTexto);
const horasExtra = Number(horasExtraTexto);
const totalHoras = horas + horasExtra;
console.log(totalHoras + " horas");`,
      hints: ["Convierte cada entrada por separado.", "Comprueba que totalHoras sea number."],
      keyPoints: ["Conversión antes de suma", "Resultado numérico verificable"],
      misconception: "El operador + siempre suma. Con strings, concatena.",
      reflectionPrompt: "Explica por qué convertir después de usar + produciría un resultado incorrecto.",
      rubric: ["Conversión explícita", "Tipo final number", "Presentación separada del cálculo"],
      tests: [{ name: "el total es numérico y no concatenado", expression: "totalHoras === 56 && typeof totalHoras === 'number'" }]
    }),
    m03: assessment({
      id: "m03-l06", title: "Evaluación: identificador normalizado", goal: "Diseñar una transformación de texto estable ante entradas variables.",
      theory: "La normalización crea una representación canónica que facilita comparar, buscar y almacenar texto.",
      starter: `const nombre = "  Curso JS ";
const categoria = "Web";

// Construye "web-curso-js" usando métodos de string
const nombreLimpio = "";
const categoriaLimpia = "";
const identificador = "";
console.log(identificador);`, expected: ["web-curso-js"],
      solution: `const nombre = "  Curso JS ";
const categoria = "Web";
const nombreLimpio = nombre.trim().toLowerCase().split(" ").filter(Boolean).join("-");
const categoriaLimpia = categoria.trim().toLowerCase();
const identificador = categoriaLimpia + "-" + nombreLimpio;
console.log(identificador);`,
      hints: ["Normaliza ambos argumentos.", "Para espacios repetidos, filtra partes vacías antes de join."],
      keyPoints: ["Pipeline de transformación", "Representación canónica"],
      misconception: "Aplicar trim es suficiente para normalizar todos los espacios.",
      reflectionPrompt: "Explica el orden de las transformaciones y por qué cada paso debe ocurrir antes de unir el identificador.",
      rubric: ["Elimina espacios externos y repetidos", "Conserva entradas originales", "Devuelve minúsculas con guiones"],
      tests: [{ name: "el resultado deriva de ambas entradas normalizadas", expression: "nombreLimpio === 'curso-js' && categoriaLimpia === 'web' && identificador === categoriaLimpia + '-' + nombreLimpio" }]
    }),
    m04: assessment({
      id: "m04-l06", title: "Evaluación: política de préstamo", goal: "Traducir reglas con prioridades y límites explícitos.",
      theory: "Las reglas se evalúan desde las excepciones más restrictivas hasta el caso general.",
      starter: `const edad = 14;
const tieneDeuda = false;
const librosActuales = 2;

// Reglas: 14+ años, sin deuda y menos de 3 libros
const puedePrestar = false;
console.log(puedePrestar);`, expected: ["true"],
      solution: `const edad = 14;
const tieneDeuda = false;
const librosActuales = 2;
const puedePrestar = edad >= 14 && !tieneDeuda && librosActuales < 3;
console.log(puedePrestar);`,
      hints: ["Las tres reglas deben cumplirse simultáneamente.", "El límite de libros no incluye 3."],
      keyPoints: ["Condición compuesta", "Pruebas de frontera"],
      misconception: "Menos de 3 significa <= 3. El valor límite cambia la regla.",
      reflectionPrompt: "Justifica cada operador lógico y describe los tres valores límite que probarías.",
      rubric: ["Todas las reglas presentes", "Límites correctos", "Resultado booleano"],
      tests: [{ name: "la decisión depende de las tres reglas", expression: "puedePrestar === (edad >= 14 && !tieneDeuda && librosActuales < 3)" }]
    }),
    m05: assessment({
      id: "m05-l06", title: "Evaluación: mayor valor sin atajos", goal: "Recorrer una colección manteniendo una invariante de máximo.",
      theory: "Durante el recorrido, <code>mayor</code> representa el máximo de todos los elementos procesados hasta ese momento.",
      starter: `const numeros = [-8, -2, -10, -5];
let mayor = numeros[0];

// Recorre numeros sin usar Math.max

console.log(mayor);`, expected: ["-2"],
      solution: `const numeros = [-8, -2, -10, -5];
let mayor = numeros[0];
for (const numero of numeros) {
  if (numero > mayor) mayor = numero;
}
console.log(mayor);`,
      hints: ["La inicialización ya evita el error con negativos.", "Actualiza mayor solamente cuando encuentres uno superior."],
      keyPoints: ["Invariante de acumulación", "Inicialización desde datos"],
      misconception: "Inicializar mayor en 0 funciona siempre. Falla si todos los números son negativos.",
      reflectionPrompt: "Explica la invariante del bucle y por qué inicializar con cero sería incorrecto.",
      rubric: ["Sin Math.max", "Soporta negativos", "Recorre toda la colección"],
      tests: [{ name: "mayor representa el máximo real", expression: "mayor === -2 && numeros.every((numero) => numero <= mayor)" }]
    }),
    m06: assessment({
      id: "m06-l06", title: "Evaluación: contrato de límites", goal: "Diseñar una función total con parámetros y retorno predecibles.",
      theory: "Una función total devuelve un resultado válido para toda entrada dentro de su contrato.",
      starter: `function limitar(valor, minimo, maximo) {
  // Si valor está fuera, devuelve el límite correspondiente
}

console.log(limitar(15, 0, 10));
console.log(limitar(-2, 0, 10));`, expected: ["10", "0"],
      solution: `function limitar(valor, minimo, maximo) {
  if (valor < minimo) return minimo;
  if (valor > maximo) return maximo;
  return valor;
}
console.log(limitar(15, 0, 10));
console.log(limitar(-2, 0, 10));`,
      hints: ["Hay tres caminos posibles.", "Los valores exactamente iguales a los límites son válidos."],
      keyPoints: ["Contrato explícito", "Un retorno por camino"],
      misconception: "Una función solo necesita funcionar con los ejemplos mostrados.",
      reflectionPrompt: "Describe el contrato de limitar y explica por qué cubre todos los caminos posibles.",
      rubric: ["Tres caminos cubiertos", "Sin efectos laterales", "Valores frontera correctos"],
      tests: [
        { name: "conserva valores dentro del rango", expression: "limitar(5,0,10) === 5" },
        { name: "acepta los límites exactos", expression: "limitar(0,0,10) === 0 && limitar(10,0,10) === 10" }
      ]
    }),
    m07: assessment({
      id: "m07-l06", title: "Evaluación: informe de calificaciones", goal: "Combinar filter, map y reduce con una intención verificable.",
      theory: "Divide la transformación en etapas: seleccionar datos válidos, transformar y resumir.",
      starter: `function informe(notas) {
  // Ignora notas fuera de 0..100
  // Devuelve { aprobadas, promedio }
}

const resultado = informe([80, 40, 100, 120]);
console.log(resultado.aprobadas);
console.log(resultado.promedio);`, expected: ["2", "73.33333333333333"],
      solution: `function informe(notas) {
  const validas = notas.filter((nota) => nota >= 0 && nota <= 100);
  const aprobadas = validas.filter((nota) => nota >= 60).length;
  const promedio = validas.length ? validas.reduce((suma, nota) => suma + nota, 0) / validas.length : 0;
  return { aprobadas, promedio };
}
const resultado = informe([80, 40, 100, 120]);
console.log(resultado.aprobadas);
console.log(resultado.promedio);`,
      hints: ["Primero crea el array de notas válidas.", "Protege la división cuando no hay notas."],
      keyPoints: ["Pipeline de colección", "Caso vacío", "Datos derivados"],
      misconception: "Promediar antes de eliminar datos inválidos produce el mismo resultado.",
      reflectionPrompt: "Explica el orden de las transformaciones y qué ocurriría si cambias filter y reduce.",
      rubric: ["Descarta inválidas", "Calcula aprobadas", "Promedio seguro con lista vacía"],
      tests: [
        { name: "maneja lista vacía", expression: "informe([]).promedio === 0 && informe([]).aprobadas === 0" },
        { name: "respeta fronteras", expression: "informe([0,60,100]).aprobadas === 2" }
      ]
    }),
    m08: assessment({
      id: "m08-l06", title: "Evaluación: actualización de inventario", goal: "Actualizar una entidad por identidad sin mutar la colección original.",
      theory: "La identidad determina qué objeto reemplazar; la copia preserva el historial y evita efectos laterales.",
      starter: `function actualizarStock(productos, id, cambio) {
  // Devuelve un array nuevo y evita stock negativo
}

const productos = [{ id: 1, stock: 3 }, { id: 2, stock: 5 }];
console.log(actualizarStock(productos, 1, -2)[0].stock);`, expected: ["1"],
      solution: `function actualizarStock(productos, id, cambio) {
  return productos.map((producto) => {
    if (producto.id !== id) return producto;
    return { ...producto, stock: Math.max(0, producto.stock + cambio) };
  });
}
const productos = [{ id: 1, stock: 3 }, { id: 2, stock: 5 }];
console.log(actualizarStock(productos, 1, -2)[0].stock);`,
      hints: ["Usa map y conserva referencias no modificadas.", "Limita el nuevo stock con Math.max(0, ...)."],
      keyPoints: ["Actualización inmutable", "Identidad estable", "Invariante no negativa"],
      misconception: "Copiar el array es suficiente; los objetos internos también pueden mutarse.",
      reflectionPrompt: "Explica qué referencias cambian y cuáles se conservan después de actualizar un producto.",
      rubric: ["No muta el original", "Actualiza solo el id", "Stock nunca negativo"],
      tests: [
        { name: "no muta la colección original", expression: "(() => { const x=[{id:1,stock:2},{id:2,stock:4}]; const y=actualizarStock(x,1,-5); return x[0].stock===2 && y[0].stock===0 && y[1]===x[1]; })()" },
        { name: "ignora ids ausentes", expression: "actualizarStock([{id:1,stock:2}],9,3)[0].stock === 2" }
      ]
    }),
    m09: domAssessment({
      id: "m09-l06", title: "Evaluación: catálogo semántico", goal: "Representar datos y estado vacío mediante una estructura DOM accesible.",
      theory: "La interfaz debe conservar jerarquía semántica y comunicar tanto presencia como ausencia de resultados.",
      html: `<main><h1>Catálogo</h1><section id="catalogo" aria-live="polite"></section></main>`,
      starter: `const productos = [
  { nombre: "Libro", precio: 20 },
  { nombre: "Curso", precio: 35 }
];
const catalogo = document.querySelector("#catalogo");

// Crea article con h2 y p para cada producto
`,
      solution: `const productos = [{ nombre: "Libro", precio: 20 }, { nombre: "Curso", precio: 35 }];
const catalogo = document.querySelector("#catalogo");
if (productos.length === 0) {
  const vacio = document.createElement("p");
  vacio.className = "vacio";
  vacio.textContent = "No hay productos";
  catalogo.append(vacio);
} else {
  for (const producto of productos) {
    const tarjeta = document.createElement("article");
    const titulo = document.createElement("h2");
    const precio = document.createElement("p");
    titulo.textContent = producto.nombre;
    precio.textContent = "Precio: $" + producto.precio;
    tarjeta.append(titulo, precio);
    catalogo.append(tarjeta);
  }
}`,
      checks: [{ selector: "#catalogo article", count: 2 }, { selector: "#catalogo h2", textIncludes: "Libro" }, { selector: "#catalogo", textIncludes: "Precio: $35" }],
      hints: ["Crea nodos, no concatenes HTML.", "Cada article necesita heading y texto de precio."],
      keyPoints: ["Estructura semántica", "Renderizado desde datos", "Región aria-live"],
      misconception: "Si visualmente parece una tarjeta, cualquier elemento HTML es equivalente.",
      reflectionPrompt: "Justifica el uso de article, h2 y aria-live en esta interfaz.",
      rubric: ["Dos artículos semánticos", "Jerarquía de encabezados", "Contenido completo y legible"]
    }),
    m10: domAssessment({
      id: "m10-l06", title: "Evaluación: lista interactiva", goal: "Coordinar formulario, estado y renderizado sin duplicar listeners.",
      theory: "El flujo correcto es evento → validación → cambio de estado → renderizado.",
      html: `<main><form id="tarea-form"><label>Nueva tarea <input id="tarea" value="Estudiar eventos"></label><button>Agregar</button></form><p id="error" role="alert"></p><ul id="lista"></ul></main>`,
      starter: `const tareas = [];
const formulario = document.querySelector("#tarea-form");
const entrada = document.querySelector("#tarea");
const lista = document.querySelector("#lista");
const error = document.querySelector("#error");

// Al enviar: valida, agrega al estado y crea un li
formulario.requestSubmit();`,
      solution: `const tareas = [];
const formulario = document.querySelector("#tarea-form");
const entrada = document.querySelector("#tarea");
const lista = document.querySelector("#lista");
const error = document.querySelector("#error");
formulario.addEventListener("submit", (event) => {
  event.preventDefault();
  const texto = entrada.value.trim();
  if (!texto) {
    error.textContent = "Escribe una tarea";
    entrada.focus();
    return;
  }
  error.textContent = "";
  tareas.push(texto);
  const item = document.createElement("li");
  item.textContent = texto;
  lista.append(item);
});
formulario.requestSubmit();`,
      checks: [{ selector: "#lista li", count: 1 }, { selector: "#lista li", text: "Estudiar eventos" }, { selector: "#error", text: "" }],
      hints: ["Evita la recarga con preventDefault.", "Actualiza el array antes de crear el li."],
      keyPoints: ["Evento submit", "Estado como fuente de verdad", "Error accesible"],
      misconception: "Escuchar click en el botón equivale siempre a manejar submit.",
      reflectionPrompt: "Describe el flujo completo desde submit hasta la actualización visible.",
      rubric: ["Submit semántico", "Validación antes de mutar", "Estado e interfaz sincronizados"]
    }),
    m11: assessment({
      id: "m11-l06", title: "Evaluación: coordinación concurrente", goal: "Resolver operaciones independientes en paralelo y devolver un modelo único.",
      theory: "Las tareas independientes deben iniciarse antes de esperar sus resultados para evitar una cascada innecesaria.",
      starter: `async function cargarPanel() {
  const perfil = esperar({ nombre: "Ada" }, 60);
  const progreso = esperar({ completadas: 12 }, 40);
  // Espera ambas y devuelve { saludo, completadas }
}

const panel = await cargarPanel();
console.log(panel.saludo);
console.log(panel.completadas);`, expected: ["Hola, Ada", "12"],
      solution: `async function cargarPanel() {
  const perfil = esperar({ nombre: "Ada" }, 60);
  const progreso = esperar({ completadas: 12 }, 40);
  const [datosPerfil, datosProgreso] = await Promise.all([perfil, progreso]);
  return { saludo: "Hola, " + datosPerfil.nombre, completadas: datosProgreso.completadas };
}
const panel = await cargarPanel();
console.log(panel.saludo);
console.log(panel.completadas);`,
      hints: ["Las promesas ya están iniciadas.", "Desestructura el resultado de Promise.all."],
      keyPoints: ["Concurrencia", "Modelo combinado", "Una sola espera"],
      misconception: "Usar dos await consecutivos siempre ejecuta las tareas en paralelo.",
      reflectionPrompt: "Explica por qué Promise.all reduce el tiempo total y cuándo no deberías usarlo.",
      rubric: ["Ambas tareas iniciadas antes de esperar", "Promise.all", "Retorno con forma estable"],
      tests: [{ name: "devuelve el modelo combinado", expression: "(await cargarPanel()).saludo === 'Hola, Ada' && (await cargarPanel()).completadas === 12" }]
    }),
    m12: assessment({
      id: "m12-l06", title: "Evaluación: frontera de datos", goal: "Consumir una respuesta, comprobarla y devolver solo datos válidos.",
      theory: "La frontera de red debe validar transporte y contenido antes de entregar datos al resto de la aplicación.",
      starter: `async function cargarNombresActivos() {
  const respuesta = await apiSimulada("/usuarios");
  // Comprueba response.ok, lee JSON y devuelve nombres
}

console.log((await cargarNombresActivos()).join(", "));`, expected: ["Ada, Lin"],
      solution: `async function cargarNombresActivos() {
  const respuesta = await apiSimulada("/usuarios");
  if (!respuesta.ok) throw new Error("No se pudieron cargar usuarios");
  const usuarios = await respuesta.json();
  return usuarios.filter((usuario) => usuario && typeof usuario.nombre === "string").map((usuario) => usuario.nombre);
}
console.log((await cargarNombresActivos()).join(", "));`,
      hints: ["Comprueba ok antes de json.", "Filtra registros sin nombre válido."],
      keyPoints: ["Validación en la frontera", "Transformación mínima", "Error significativo"],
      misconception: "Si JSON se pudo leer, su contenido necesariamente tiene la forma esperada.",
      reflectionPrompt: "Explica por qué validar datos externos en una sola frontera reduce errores en el resto del sistema.",
      rubric: ["Comprueba respuesta", "Valida forma del dato", "Devuelve solo nombres"],
      tests: [{ name: "devuelve un array de strings", expression: "(await cargarNombresActivos()).every((nombre) => typeof nombre === 'string')" }]
    }),
    m13: assessment({
      id: "m13-l06", title: "Evaluación: contrato defensivo", goal: "Validar entrada y lanzar errores específicos sin romper el camino válido.",
      theory: "Una frontera defensiva distingue ausencia, tipo incorrecto y rango inválido para facilitar recuperación.",
      starter: `function parsearEdad(valor) {
  // Convierte a número entero entre 0 y 120
  // Lanza "Edad inválida" si no cumple
}

console.log(parsearEdad("42"));
try { parsearEdad("hola"); } catch (error) { console.log(error.message); }`, expected: ["42", "Edad inválida"],
      solution: `function parsearEdad(valor) {
  if (String(valor).trim() === "") throw new Error("Edad inválida");
  const edad = Number(valor);
  if (!Number.isInteger(edad) || edad < 0 || edad > 120) {
    throw new Error("Edad inválida");
  }
  return edad;
}
console.log(parsearEdad("42"));
try { parsearEdad("hola"); } catch (error) { console.log(error.message); }`,
      hints: ["Usa Number.isInteger después de convertir.", "Valida también ambos límites."],
      keyPoints: ["Conversión y validación", "Contrato de rango", "Error recuperable"],
      misconception: "Number('') y Number('  ') siempre producen NaN.",
      reflectionPrompt: "Define el contrato de parsearEdad y justifica el orden de conversión y validación.",
      rubric: ["Solo enteros", "Rango 0..120", "Mensaje específico"],
      tests: [
        { name: "acepta límites", expression: "parsearEdad('0') === 0 && parsearEdad(120) === 120" },
        { name: "rechaza decimales, vacíos y fuera de rango", expression: "(() => { try { parsearEdad(4.5); return false; } catch (_) {} try { parsearEdad(''); return false; } catch (_) {} try { parsearEdad(121); return false; } catch (_) { return true; } })()" }
      ]
    }),
    m14: assessment({
      id: "m14-l06", title: "Evaluación: repositorio en memoria", goal: "Diseñar una clase con invariantes, API mínima y comportamiento comprobable.",
      theory: "Una abstracción útil protege sus datos y expone operaciones coherentes en lugar de su estructura interna.",
      starter: `class Repositorio {
  constructor() {
    this.elementos = [];
  }
  agregar(elemento) {
    // Rechaza ids duplicados
  }
  buscar(id) {
    // Devuelve elemento o null
  }
}

const repo = new Repositorio();
repo.agregar({ id: 1, nombre: "Ada" });
console.log(repo.buscar(1).nombre);`, expected: ["Ada"],
      solution: `class Repositorio {
  constructor() { this.elementos = []; }
  agregar(elemento) {
    if (this.buscar(elemento.id)) throw new Error("ID duplicado");
    this.elementos.push({ ...elemento });
  }
  buscar(id) {
    return this.elementos.find((elemento) => elemento.id === id) || null;
  }
}
const repo = new Repositorio();
repo.agregar({ id: 1, nombre: "Ada" });
console.log(repo.buscar(1).nombre);`,
      hints: ["buscar puede reutilizarse dentro de agregar.", "Define explícitamente el caso no encontrado."],
      keyPoints: ["Invariante de identidad", "API pequeña", "Reutilización interna"],
      misconception: "Una clase es solo un objeto con sintaxis diferente; su valor está en proteger invariantes.",
      reflectionPrompt: "Explica qué invariante protege Repositorio y cómo probarías que no se rompe.",
      rubric: ["Impide ids duplicados", "Buscar devuelve null", "No expone decisiones innecesarias"],
      tests: [
        { name: "devuelve null si no existe", expression: "new Repositorio().buscar(99) === null" },
        { name: "rechaza ids duplicados", expression: "(() => { const r=new Repositorio(); r.agregar({id:1}); try { r.agregar({id:1}); return false; } catch(e) { return e.message === 'ID duplicado'; } })()" }
      ]
    })
  };

  const defaultEvidence = {
    quiz: "Decisión conceptual justificada",
    code: "Comportamiento correcto en ejemplos y casos ocultos",
    debug: "Causa identificada y corrección mínima",
    dom: "Estado visible verificable y estructura semántica"
  };
  const defaultLevel = { quiz: "Comprender", code: "Aplicar", debug: "Analizar", dom: "Crear" };
  const defaultMinutes = { quiz: 6, code: 15, debug: 18, dom: 22 };

  // Errores conceptuales frecuentes en los laboratorios de interfaz (DOM).
  const domMisconceptions = {
    "m09-l02": "Asignar innerHTML para texto plano interpreta etiquetas y abre la puerta a inyección; textContent no. Además, className = '...' borra las clases previas, mientras classList.add conserva las existentes.",
    "m09-l03": "Construir la lista con innerHTML += dentro del bucle reanaliza todo el DOM en cada vuelta y borra estados o listeners previos; crear nodos con createElement y append es más seguro y rápido.",
    "m09-l04": "Insertar cada nodo en el documento dentro del bucle provoca múltiples reflujos; arma la estructura completa y agrégala al DOM una sola vez.",
    "m09-l05": "Una lista vacía no es un error: si no muestras nada, la persona no sabe si cargó, falló o no hay datos. El estado vacío debe ser explícito.",
    "m10-l02": "Leer el número desde el DOM (textContent) como fuente de verdad acumula errores; el estado debe vivir en una variable y el DOM solo reflejarlo.",
    "m10-l03": "preventDefault no es opcional: sin él, el formulario recarga la página y tu lógica nunca corre. Y conviene escuchar submit, no el click del botón.",
    "m10-l04": "Poner un listener por cada elemento no escala y se rompe con elementos añadidos después; delega en un ancestro y usa event.target.",
    "m10-l05": "Señalar el error solo con color deja fuera a personas daltónicas y a lectores de pantalla; usa texto, role=alert y mueve el foco al campo inválido."
  };

  for (const unit of course.modules) {
    Object.assign(unit, moduleAcademics[unit.id] || {});
    const finalAssessment = assessments[unit.id];
    if (finalAssessment && !unit.lessons.some((lesson) => lesson.id === finalAssessment.id)) unit.lessons.push(finalAssessment);
  }

  for (const unit of [...course.modules, ...course.projects]) {
    for (const lesson of unit.lessons) {
      lesson.cognitiveLevel ||= defaultLevel[lesson.type] || "Aplicar";
      lesson.estimatedMinutes ||= defaultMinutes[lesson.type] || 15;
      lesson.evidence ||= defaultEvidence[lesson.type] || "Producto verificable";
      if (!lesson.misconception && domMisconceptions[lesson.id]) lesson.misconception = domMisconceptions[lesson.id];
      if (!lesson.misconception && lesson.type === "code") lesson.misconception = "Que un ejemplo visible pase no garantiza que la solución sea general.";
      if (!lesson.rubric && lesson.tests?.length) lesson.rubric = ["Salida esperada", "Casos ocultos", "Código comprensible"];
    }
  }

  course.version = 5;
  course.refresh();
})(typeof window !== "undefined" ? window : globalThis);
