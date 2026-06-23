# JavaScript Lab

Plataforma didáctica e interactiva para aprender JavaScript escribiendo código y construyendo proyectos.

## Qué incluye

- 14 módulos progresivos y 109 etapas, con herencia (extends/super), getters y un laboratorio fetch→tarjetas.
- Retos conceptuales, ejercicios de consola y laboratorios DOM con vista previa.
- 6 proyectos guiados y semiguiados, incluido un explorador de países y un Kanban final.
- Pruebas ocultas con múltiples casos para validar comportamiento y evitar respuestas hardcodeadas.
- Ejercicios específicos de depuración, closures, Set, delegación de eventos y validación accesible.
- Ejecución aislada con límite de tiempo, feedback específico, pistas y soluciones.
- Progreso y borradores guardados en `localStorage` (por navegador y origen, sin servidor ni cuentas).
- Exportar e importar el progreso como archivo JSON: respaldo y traspaso entre navegadores o equipos.
- Editor con resaltado de sintaxis y números de línea, más un paso opcional de predicción de la salida.
- Modo Repaso: práctica de recuperación espaciada de retos de código ya completados.
- Registro de intentos, pistas, soluciones consultadas y nivel de autonomía por etapa.
- Preguntas esenciales, competencias observables, niveles cognitivos y criterios de logro.
- Una evaluación integradora por módulo con autoexplicación obligatoria y solución bloqueada durante los primeros intentos.
- Tema claro/oscuro, navegación por teclado y diseño adaptable.

## Ejecutar

La aplicación funciona abriendo `index.html` directamente. Para trabajar con un servidor local:

```powershell
npm start
```

Después abre `http://localhost:4173`.

## Verificar

```powershell
npm test
npm run check
```

## Desplegar en Cloudflare Pages

Sitio 100% estático: no necesita build ni servidor en producción.

1. Sube el repositorio a GitHub (o GitLab).
2. En Cloudflare: **Workers & Pages → Create → Pages → Connect to Git** y elige el repo.
3. Ajustes de build: framework preset **None**, build command **(vacío)**, output directory **`/`** (raíz).
4. Deploy → obtienes `https://<proyecto>.pages.dev`.

Alternativa por CLI: `npx wrangler login` y luego `npx wrangler pages deploy .` (apunta a una carpeta sin `node_modules`).

Notas:
- El progreso se guarda en `localStorage` por origen. Usa **Exportar/Importar progreso** para moverlo entre dominios o navegadores.
- No configures un CSP que bloquee `blob:` ni `'unsafe-eval'`: el ejecutor de código usa Web Worker (`new Worker(blob)`) y `new Function`.
