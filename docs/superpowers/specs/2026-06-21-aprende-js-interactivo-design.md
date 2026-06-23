# Aprende JavaScript Interactivo — Diseño

Fecha: 2026-06-21
Estado: sustituido por la versión 2 implementada
Autor/usuario: uso personal (una sola persona, aprendizaje)

> Nota de evolución: esta especificación conserva el diseño inicial de una entrega
> limitada a dos objetivos. La implementación actual amplía el producto a 14
> módulos, 106 etapas y 6 proyectos guiados/semiguiados. El estado vigente y las instrucciones
> de ejecución están en `README.md`.

## 1. Resumen

Aplicación web para aprender JavaScript de forma práctica, siguiendo el temario
del libro *"Aprende JavaScript en un fin de semana"*. El alumno lee teoría breve,
rellena huecos y escribe código real; la app ejecuta su código en el navegador,
compara la salida con la esperada y desbloquea el siguiente objetivo.

Uso 100% personal y offline. Sin distribución, sin cuentas, sin servidor.

## 2. Objetivos y no-objetivos

### Objetivos
- Recorrer los 14 objetivos del libro + 2 proyectos intermedios + 1 proyecto final.
- Tres modos de práctica por fase: `teoria`, `huecos`, `libre` (la "mezcla").
- Ejecutar el código del alumno en el navegador y validar la salida automáticamente.
- Guardar el progreso localmente y desbloquear objetivos de forma progresiva.
- Funcionar abriendo `index.html` con doble clic, sin instalar nada, sin conexión.

### No-objetivos (YAGNI)
- Sin backend, base de datos ni cuentas de usuario.
- Sin multiusuario ni sincronización en la nube.
- Sin framework ni paso de build (no React, no Vite, no npm para la app).
- Sin resaltado de sintaxis avanzado en la entrega 1 (textarea mejorado; CodeMirror
  queda como mejora futura).

## 3. Decisiones de diseño

### 3.1 Stack
HTML + CSS + JavaScript "vanilla". Sin dependencias en tiempo de ejecución.

### 3.2 Restricción `file://` (doble clic)
Al abrir `index.html` desde el sistema de archivos, el navegador bloquea `fetch()`
y los módulos ES (`import`/`export`) por seguridad de origen `null`. Consecuencias
de diseño:
- El contenido NO se carga con `fetch` de JSON. Cada objetivo es un archivo `.js`
  clásico (`<script src>`) que se auto-registra llamando a `Curso.registrar({...})`.
- No se usan módulos ES; todo el JS de la app son scripts clásicos que exponen
  objetos globales (`App`, `Curso`, `Motor`, `Runner`, `Validador`, `Almacen`).

### 3.3 Ejecución segura del código del alumno
Se ejecuta dentro de un `<iframe>` oculto (aísla el ámbito global entre intentos y
permite capturar `console.log`). Protección contra bucles infinitos mediante una
"guarda" inyectada en el código antes de ejecutarlo (ver §6). Motivación: el
Objetivo 9 son bucles; un principiante escribe `while (true)` sin querer y, sin
guarda, congela la pestaña.

### 3.4 Entrada de datos
El libro lee del teclado con un paquete de Node (readline). En el navegador se
sustituye por una función global `leer(mensaje)` inyectada en el iframe, que
devuelve, en orden, los valores predefinidos de la fase (`entradas`). Para juego
libre sin entradas predefinidas, `leer()` cae a `window.prompt()`. Esta desviación
respecto al libro se explica al alumno en la primera fase que use entrada.

### 3.5 Alcance de la primera entrega
- Entrega 1 (este plan): motor completo + Objetivo 1 (Variables) + Objetivo 2
  (Mostrar información), de extremo a extremo.
- Entregas siguientes: archivos de contenido para los objetivos 3–14 y los 3
  proyectos, usando el mismo esquema. No requieren cambios de motor salvo que un
  objetivo nuevo pida un tipo de validación no contemplado.

## 4. Arquitectura

Componentes (cada uno = un global, un archivo, una responsabilidad):

| Componente | Archivo | Responsabilidad | Depende de |
|---|---|---|---|
| `App` | `js/app.js` | Arranque, navegación, orquestación de la vista | `Curso`, `Almacen`, `Motor` |
| `Curso` | `js/curso.js` | Registro y consulta del contenido (objetivos/fases) | — |
| `Motor` | `js/engine.js` | Pinta la fase actual según su `tipo`; conecta botones | `Runner`, `Validador` |
| `Runner` | `js/runner.js` | Ejecuta código en iframe, captura salida, guarda anti-bucle | — |
| `Validador` | `js/validator.js` | Compara salida / evalúa condiciones de éxito | — |
| `Almacen` | `js/storage.js` | Lee/escribe progreso en `localStorage` | — |
| Contenido | `content/*.js` | Datos de cada objetivo (se auto-registran en `Curso`) | `Curso` |

Flujo de datos (un intento de fase):

```
Alumno escribe código en el textarea
        │
        ▼
App → Motor.ejecutar()  ─────────────►  Runner.correr(codigo, entradas)
                                              │  (iframe oculto + guarda anti-bucle)
                                              ▼
                                        { salida:[...], error:null|string }
        ┌─────────────────────────────────────┘
        ▼
Validador.validar(fase, resultado)  ──►  { ok:true|false, detalle:"..." }
        │
        ▼
Motor pinta feedback; si ok → Almacen.completar(faseId) → desbloquea siguiente
```

Orden de `<script>` en `index.html`:
`curso.js → storage.js → runner.js → validator.js → engine.js → content/*.js → app.js`.

## 5. Esquema de contenido (el corazón)

Cada archivo de `content/` registra un objetivo:

```js
Curso.registrar({
  id: "obj-02",
  numero: 2,
  titulo: "Mostrando información",
  introTeoria: "Texto breve con <code>console.log</code>...", // HTML simple
  fases: [
    {
      id: "obj-02-f1",
      tipo: "huecos",                  // "teoria" | "huecos" | "libre"
      titulo: "Fase 1 · Mostrar un valor",
      enunciado: "Imprime el valor de nombre.",
      inicial: 'let nombre = "Alfredo";\nconsole.log(______);',
      solucion: 'let nombre = "Alfredo";\nconsole.log(nombre);',
      entradas: [],                    // valores que devolverá leer(), en orden
      validacion: {
        modo: "salida",                // "salida" | "leido" | "assert"
        esperado: ["Alfredo"],         // líneas esperadas de console.log
        comparacion: "exacta"          // "exacta" | "contiene"
      },
      pista: "Pon el nombre de la variable dentro de console.log()."
    }
  ]
});
```

Notas del esquema:
- `tipo: "teoria"` → no hay editor; muestra `enunciado`/contenido y un botón
  "Entendido". Validación `modo:"leido"` (marcar como visto). Objetivo 1 es
  íntegramente de este tipo.
- `tipo: "huecos"` → editor precargado con `inicial` (contiene `______`); el alumno
  rellena. Se valida la salida.
- `tipo: "libre"` → editor con `inicial` mínimo (p. ej. comentario guía); el alumno
  escribe todo. Se valida por `salida` o por `assert`.
- `solucion` se usa para el botón "Ver solución" (opcional) y nunca para validar.
- El `id` de fase es la clave de progreso en `localStorage`.

## 6. Runner — ejecución del código

`Runner.correr(codigo, entradas)` → `Promise<{ salida: string[], error: string|null }>`.

Pasos:
1. **Instrumentar** el código con la guarda anti-bucle: tras cada `{` que abra el
   cuerpo de un `for`/`while`/`do`, insertar
   `if(++__guard>1e7){throw new Error("Bucle demasiado largo (¿infinito?)");}`,
   con `let __guard=0;` al inicio. Asunción: los bucles usan llaves `{ }`. El editor
   inserta llaves por defecto en las plantillas para reforzar esta convención.
2. Construir un `<iframe>` oculto (`sandbox` permitido para scripts) cuyo documento:
   - redefine `console.log` para acumular líneas y enviarlas al padre,
   - define `leer(msg)` que va consumiendo `entradas` (y cae a `prompt()` si se
     agotan),
   - ejecuta el código instrumentado dentro de un `try/catch`,
   - devuelve al padre `{ salida, error }` vía `postMessage`.
3. El padre resuelve la promesa con el resultado y destruye el iframe (ámbito limpio
   para el siguiente intento).

Errores capturados y mostrados al alumno tal cual (mensaje del `Error`): sintaxis,
referencia a variable inexistente, bucle demasiado largo, etc.

Limitación conocida: un bucle infinito **sin llaves** (cuerpo de una sola línea) no
queda guardado. Mitigación: las plantillas usan llaves siempre; riesgo aceptable en
uso personal. Mejora futura: servir por http local y usar Web Worker con
`terminate()` por timeout (protección total, fuera del alcance de la entrega 1).

## 7. Validador

`Validador.validar(fase, resultado)` → `{ ok: boolean, detalle: string }`.

Modos:
- `salida`: compara `resultado.salida` con `validacion.esperado`.
  - `comparacion:"exacta"`: mismas líneas, en el mismo orden (con `trim` por línea).
  - `comparacion:"contiene"`: cada línea esperada aparece en la salida.
- `leido`: siempre `ok:true` al pulsar "Entendido" (fases de teoría).
- `assert`: ejecuta una comprobación corta definida en la fase sobre el estado
  resultante (p. ej. el valor de una variable o el retorno de una función). Se
  especifica en detalle cuando aparezca el primer objetivo que lo necesite
  (Funciones / Arrays); no se usa en objetivos 1–2.

Si hay `resultado.error`, `ok:false` y `detalle` = el mensaje de error.

## 8. Almacenamiento (progreso)

Clave `localStorage`: `aprendejs.progreso`. Forma:

```js
{
  version: 1,
  completadas: { "obj-01-f1": true, "obj-02-f1": true },
  objetivoActual: "obj-03",
  faseActual: "obj-03-f1"
}
```

Reglas de desbloqueo:
- Un objetivo está desbloqueado si es el primero o si todas las fases del objetivo
  anterior están en `completadas`.
- Al completar la última fase de un objetivo, se desbloquea y selecciona el
  siguiente.
- Botón "Reiniciar progreso" borra la clave y vuelve al Objetivo 1.

`Almacen` aísla todo el acceso a `localStorage` (lectura/escritura/migración por
`version`).

## 9. Interfaz y navegación

Una sola pantalla, dos columnas:
- **Barra lateral**: lista de los 14 objetivos + proyectos. Iconos de estado:
  completado (check), actual (play), bloqueado (candado). Click navega solo a
  objetivos desbloqueados.
- **Panel principal**:
  - Cabecera: título del objetivo + barra de progreso global ("Objetivo N de 14").
  - Chips del tipo de fase activa (teoría / huecos / código libre).
  - Tarjeta de teoría/enunciado (HTML simple del contenido).
  - Editor: `<textarea>` monoespaciado; Tab inserta 2 espacios; precargado con
    `inicial`.
  - Botones: "Ejecutar" (corre y muestra salida), "Validar" (corre + valida +
    progreso), "Pista", "Ver solución".
  - Consola de salida: muestra líneas de `console.log` o el error.
  - Banda de feedback: éxito (desbloqueo) o fallo (qué se esperaba vs. qué salió).

Accesibilidad básica: foco visible, contraste suficiente, navegable por teclado.

## 10. Mapa de objetivos → archivos de contenido

`content/index.js` define el orden y metadatos. Un archivo por objetivo:

```
obj-01-variables.js          obj-08-control-flujo.js
obj-02-mostrar-info.js       obj-09-bucles.js
obj-03-entrada.js            proy-01-intermedio.js
obj-04-numeros.js            obj-10-funciones.js
obj-05-cadenas.js            proy-02-intermedio.js
obj-06-fechas.js             obj-11-arrays.js
obj-07-booleanos.js          obj-12-poo.js
                             obj-13-excepciones.js
                             obj-14-ficheros.js (*)
                             proy-final-agenda.js
```

(*) Objetivo 14 (manipulación de ficheros) usa la API de ficheros de Node, que no
existe en el navegador. Se adapta a un "sistema de ficheros" simulado en memoria
(un objeto que imita lectura/escritura de texto). Se diseña en detalle al llegar a
ese objetivo; fuera del alcance de la entrega 1.

## 11. Manejo de errores

- Error de sintaxis/ejecución del alumno → se muestra el mensaje en la consola de
  salida; `Validador` devuelve `ok:false`.
- Bucle demasiado largo → error controlado por la guarda; mismo tratamiento.
- `localStorage` no disponible (modo privado) → `Almacen` cae a un almacén en
  memoria y avisa de que el progreso no se guardará entre sesiones.
- Contenido mal formado al registrarse → `Curso.registrar` valida campos mínimos y
  registra un aviso en consola del desarrollador.

## 12. Pruebas

Como no hay framework, se incluye una página `tests/tests.html` con un mini-runner
propio (función `test(nombre, fn)` + `asegurar(cond, msg)`) que verifica las piezas
sin DOM pesado:
- `Runner`: salida de `console.log`, captura de error, disparo de la guarda
  anti-bucle, consumo de `entradas` por `leer()`.
- `Validador`: comparación exacta y "contiene", modo `leido`, propagación de error.
- `Almacen`: completar fase, reglas de desbloqueo, reinicio, fallback en memoria.
- `Curso`: registro y consulta por id, orden de objetivos.

Verificación manual de extremo a extremo: completar las fases de los objetivos 1 y 2
y comprobar el desbloqueo y la persistencia tras recargar.

## 13. Riesgos y decisiones abiertas

- **Guarda anti-bucle frágil con código sin llaves**: aceptado para uso personal;
  mitigado con plantillas que usan llaves. Mejora futura: Web Worker por http local.
- **Objetivo 14 (ficheros)** y **modo `assert`**: se concretan al llegar a esos
  objetivos; no bloquean la entrega 1.
- **Editor básico**: textarea ahora; CodeMirror por CDN cuando/si se sirve por http.

## 14. Alcance de la entrega 1 (resumen para el plan)

Construir: `index.html`, `css/styles.css`, los 6 globales de `js/`, el contenido de
`content/index.js`, `content/obj-01-variables.js`, `content/obj-02-mostrar-info.js`,
y `tests/tests.html`. Resultado: app abrible por doble clic donde se pueden completar
los objetivos 1 y 2 con validación, progreso persistente y desbloqueo.
