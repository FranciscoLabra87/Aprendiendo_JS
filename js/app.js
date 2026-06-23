(function () {
  "use strict";

  const STORAGE_KEY = "javascript-lab.progress.v2";
  const main = document.querySelector("#main-content");
  const nav = document.querySelector("#course-navigation");
  const sidebar = document.querySelector("#sidebar");
  const scrim = document.querySelector("#sidebar-scrim");
  const toast = document.querySelector("#toast");

  const defaultState = {
    completed: {},
    completedAt: {},
    drafts: {},
    attempts: {},
    hintsUsed: {},
    solutionsViewed: {},
    mastery: {},
    reflections: {},
    predictions: {},
    reviews: {},
    currentUnit: "m01",
    currentLesson: "m01-l01",
    theme: "dark",
    sessions: []
  };

  let state = loadState();
  let hintIndex = 0;
  let toastTimer;

  function loadState() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return parsed && typeof parsed === "object" ? { ...defaultState, ...parsed } : { ...defaultState };
    } catch (_) {
      return { ...defaultState };
    }
  }

  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    catch (_) { showToast("El navegador no permitió guardar el progreso."); }
  }

  function registerSession() {
    const today = new Date().toISOString().slice(0, 10);
    state.sessions = [...new Set([...(state.sessions || []), today])].slice(-30);
    saveState();
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function icon(name) {
    return `<svg aria-hidden="true"><use href="#icon-${name}"></use></svg>`;
  }

  function completedCount() {
    return COURSE_DATA.allLessons.filter((lesson) => state.completed[lesson.id]).length;
  }

  function masteryAverage() {
    const scores = Object.values(state.mastery || {}).filter((score) => Number.isFinite(score));
    return scores.length ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : 0;
  }

  function calculateMastery(lessonId) {
    const attempts = state.attempts[lessonId] || 1;
    const hints = state.hintsUsed[lessonId] || 0;
    const solutionPenalty = state.solutionsViewed[lessonId] ? 25 : 0;
    return Math.max(35, 100 - Math.max(0, attempts - 1) * 8 - hints * 7 - solutionPenalty);
  }

  function unitCompleted(unit) {
    return unit.lessons.every((lesson) => state.completed[lesson.id]);
  }

  function unitProgress(unit) {
    const done = unit.lessons.filter((lesson) => state.completed[lesson.id]).length;
    return { done, total: unit.lessons.length, percent: Math.round((done / unit.lessons.length) * 100) };
  }

  function unitUnlocked(unit) {
    if (unit.id === "m01") return true;
    if (unit.id.startsWith("m")) {
      const index = COURSE_DATA.modules.findIndex((item) => item.id === unit.id);
      return index <= 0 || unitCompleted(COURSE_DATA.modules[index - 1]);
    }
    const prerequisite = COURSE_DATA.getUnit(unit.unlockAfter);
    return prerequisite ? unitCompleted(prerequisite) : false;
  }

  function firstLessonFor(unit) {
    return unit.lessons.find((lesson) => !state.completed[lesson.id]) || unit.lessons[0];
  }

  function getContinueTarget() {
    const candidates = COURSE_DATA.modules.flatMap((unit) => unitUnlocked(unit) ? unit.lessons.map((lesson) => ({ unit, lesson })) : []);
    return candidates.find(({ lesson }) => !state.completed[lesson.id]) || { unit: COURSE_DATA.modules[0], lesson: COURSE_DATA.modules[0].lessons[0] };
  }

  function showToast(message) {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("visible");
    toastTimer = setTimeout(() => toast.classList.remove("visible"), 3400);
  }

  function setTheme(theme) {
    state.theme = theme;
    document.documentElement.dataset.theme = theme;
    saveState();
  }

  function updateGlobalProgress() {
    const count = completedCount();
    const percent = Math.round((count / COURSE_DATA.lessonCount) * 100);
    document.querySelector("#header-progress-label").textContent = `${percent}% completado`;
    document.querySelector("#header-progress-bar").style.width = `${percent}%`;
  }

  function renderNavigation() {
    const renderItem = (unit) => {
      const progress = unitProgress(unit);
      const unlocked = unitUnlocked(unit);
      const completed = unitCompleted(unit);
      const active = state.currentUnit === unit.id && main.dataset.view === "lesson";
      const stateIcon = completed ? "check" : unlocked ? "play" : "lock";
      return `<button class="course-nav-item ${completed ? "completed" : ""} ${active ? "active" : ""}"
        data-unit-id="${unit.id}" ${unlocked ? "" : "disabled"} aria-current="${active ? "page" : "false"}">
        <span class="nav-number">${completed ? icon("check") : escapeHtml(unit.number)}</span>
        <span class="nav-copy"><strong>${escapeHtml(unit.title)}</strong><small>${progress.done}/${progress.total} etapas</small></span>
        <span class="nav-state">${icon(stateIcon)}</span>
      </button>`;
    };

    nav.innerHTML = `
      <p class="nav-section-title">Fundamentos y práctica</p>
      ${COURSE_DATA.modules.map(renderItem).join("")}
      <p class="nav-section-title">Proyectos</p>
      ${COURSE_DATA.projects.map(renderItem).join("")}`;

    nav.querySelectorAll("[data-unit-id]").forEach((button) => {
      button.addEventListener("click", () => openUnit(button.dataset.unitId));
    });
    updateGlobalProgress();
  }

  function renderDashboard() {
    main.dataset.view = "dashboard";
    state.currentUnit = "";
    history.replaceState(null, "", location.pathname + location.search);
    const completed = completedCount();
    const percent = Math.round((completed / COURSE_DATA.lessonCount) * 100);
    const target = getContinueTarget();
    const level = Math.max(1, Math.floor(completed / 6) + 1);

    main.innerHTML = `<div class="content-container">
      <section class="hero" aria-labelledby="hero-title">
        <div class="hero-copy">
          <span class="eyebrow">RUTA INTERACTIVA DE JAVASCRIPT</span>
          <h1 id="hero-title">Aprende código <span>escribiendo código.</span></h1>
          <p>Conceptos breves, práctica inmediata y ${COURSE_DATA.projects.length} proyectos que crecen contigo. Aquí no vienes a memorizar: vienes a construir.</p>
          <div class="hero-actions">
            <button class="button button-primary" id="continue-button">${icon("play")} Continuar: ${escapeHtml(target.lesson.title)}</button>
            <button class="button button-ghost" id="roadmap-button">${icon("map")} Ver la ruta</button>
            ${eligibleReviewLessons().length ? `<button class="button button-ghost" id="review-button">${icon("bolt")} Repaso (${eligibleReviewLessons().length})</button>` : ""}
          </div>
        </div>
        <aside class="hero-status" aria-label="Resumen del progreso">
          <span class="hero-status-label">Tu avance general</span>
          <div class="level-ring" style="--progress:${percent}%">
            <div class="level-ring-content"><strong>${percent}%</strong><small>Nivel ${level}</small></div>
          </div>
          <div class="streak-row">
            <div class="mini-stat"><strong>${completed}</strong><span>etapas listas</span></div>
            <div class="mini-stat"><strong>${state.sessions.length}</strong><span>días activos</span></div>
            <div class="mini-stat"><strong>${masteryAverage()}%</strong><span>autonomía</span></div>
          </div>
        </aside>
      </section>

      <div class="section-heading"><div><span class="eyebrow">EL MÉTODO</span><h2>Aprender haciendo, de verdad</h2></div><p>Cada concepto termina en una decisión, una línea de código o una pieza visible de interfaz.</p></div>
      <section class="principles-grid" aria-label="Método de aprendizaje">
        ${principle("book", "Entiende lo justo", "Explicaciones cortas centradas en el modelo mental necesario para resolver el siguiente reto.")}
        ${principle("code", "Practica de inmediato", "Ejecuta JavaScript real, recibe feedback específico y corrige sin abandonar la lección.")}
        ${principle("trophy", "Construye productos", `${COURSE_DATA.projects.length} proyectos progresivos: desde calculadoras guiadas hasta un Kanban final.`)}
      </section>

      <div class="section-heading" id="roadmap"><div><span class="eyebrow">${COURSE_DATA.modules.length} MÓDULOS · ${COURSE_DATA.lessonCount} ETAPAS · ${COURSE_DATA.projects.length} PROYECTOS</span><h2>Ruta de aprendizaje</h2></div><p>El siguiente módulo se desbloquea cuando completas el actual. Puedes volver a practicar cualquier etapa abierta.</p></div>
      <section class="module-grid" aria-label="Módulos del curso">${COURSE_DATA.modules.map(moduleCard).join("")}</section>

      <div class="section-heading"><div><span class="eyebrow">APRENDIZAJE POR PROYECTOS</span><h2>Construye mientras avanzas</h2></div><p>Cada proyecto integra varios conceptos y deja una pieza funcional que puedes extender.</p></div>
      <section class="projects-grid" aria-label="Proyectos del curso">${COURSE_DATA.projects.map(projectCard).join("")}</section>
    </div>`;

    document.querySelector("#continue-button").addEventListener("click", () => openLesson(target.unit.id, target.lesson.id));
    document.querySelector("#roadmap-button").addEventListener("click", () => document.querySelector("#roadmap").scrollIntoView({ behavior: "smooth" }));
    const reviewButton = document.querySelector("#review-button");
    if (reviewButton) reviewButton.addEventListener("click", () => renderReview());
    main.querySelectorAll("[data-open-unit]").forEach((button) => button.addEventListener("click", () => openUnit(button.dataset.openUnit)));
    renderNavigation();
  }

  function principle(iconName, title, text) {
    return `<article class="principle-card"><span class="icon-tile">${icon(iconName)}</span><h3>${title}</h3><p>${text}</p></article>`;
  }

  function moduleCard(unit) {
    const progress = unitProgress(unit);
    const unlocked = unitUnlocked(unit);
    const completed = unitCompleted(unit);
    return `<button class="module-card ${completed ? "completed" : ""}" data-open-unit="${unit.id}" ${unlocked ? "" : "disabled"}>
      <span class="module-number">${completed ? icon("check") : String(unit.number).padStart(2, "0")}</span>
      <span><h3>${escapeHtml(unit.title)}</h3><p>${escapeHtml(unit.description)}</p><span class="module-meta"><span>${escapeHtml(unit.duration)}</span><span>${progress.done}/${progress.total} etapas</span><span>${escapeHtml(unit.level)}</span></span></span>
      <span class="module-arrow">${icon(unlocked ? "arrow" : "lock")}</span>
    </button>`;
  }

  function projectCard(unit) {
    const unlocked = unitUnlocked(unit);
    const progress = unitProgress(unit);
    return `<article class="project-card">
      <div class="project-visual">${icon(unlocked ? "code" : "lock")}</div>
      <div class="project-content"><h3>${escapeHtml(unit.title)}</h3><p>${escapeHtml(unit.description)}</p>
        <button class="button ${unlocked ? "button-primary" : ""}" data-open-unit="${unit.id}" ${unlocked ? "" : "disabled"}>
          ${unlocked ? `${progress.done ? "Continuar" : "Comenzar"} ${icon("arrow")}` : `Completa ${escapeHtml(unit.unlockAfter.toUpperCase())}`}
        </button>
      </div>
    </article>`;
  }

  function openUnit(unitId) {
    const unit = COURSE_DATA.getUnit(unitId);
    if (!unit || !unitUnlocked(unit)) return;
    openLesson(unit.id, firstLessonFor(unit).id);
  }

  function openLesson(unitId, lessonId) {
    const unit = COURSE_DATA.getUnit(unitId);
    const lesson = unit?.lessons.find((item) => item.id === lessonId);
    if (!unit || !lesson || !unitUnlocked(unit)) return;
    state.currentUnit = unit.id;
    state.currentLesson = lesson.id;
    history.replaceState(null, "", `#${lesson.id}`);
    saveState();
    hintIndex = 0;
    renderLesson(unit, lesson);
    closeSidebar();
    main.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderLesson(unit, lesson) {
    main.dataset.view = "lesson";
    const progress = unitProgress(unit);
    const typeLabels = { quiz: "Comprueba tu modelo mental", code: "Reto de código", debug: "Clínica de depuración", dom: "Laboratorio de interfaz" };
    const typeIcons = { quiz: "book", code: "terminal", debug: "bolt", dom: "code" };
    const lessonTypeLabel = lesson.isAssessment ? "Evaluación integradora de dominio" : typeLabels[lesson.type];
    const lessonTypeIcon = lesson.isAssessment ? "trophy" : typeIcons[lesson.type];
    const currentIndex = unit.lessons.findIndex((item) => item.id === lesson.id);

    main.innerHTML = `<div class="content-container">
      <header class="lesson-header">
        <div class="breadcrumbs"><span>Ruta</span><span>/</span><span>${escapeHtml(unit.title)}</span><span>/</span><span>Etapa ${currentIndex + 1}</span></div>
        <div class="lesson-title-row"><div><span class="eyebrow">${escapeHtml(unit.subtitle)}</span><h1>${escapeHtml(unit.title)}</h1><p class="lesson-summary">${escapeHtml(unit.description)}</p></div></div>
        <div class="lesson-stepper" aria-label="Etapas del módulo">
          ${unit.lessons.map((item, index) => `<button class="step-button ${item.id === lesson.id ? "active" : ""} ${state.completed[item.id] ? "completed" : ""}" data-step="${item.id}"><span class="step-dot"></span>${index + 1}. ${escapeHtml(item.title)}</button>`).join("")}
        </div>
      </header>
      <div class="lesson-layout">
        <section class="lesson-main">
          <article class="lesson-card">
            <header class="lesson-card-header">
              <span class="lesson-type">${icon(lessonTypeIcon)} ${lessonTypeLabel}</span>
              <h2>${escapeHtml(lesson.title)}</h2>
              <p>${escapeHtml(lesson.goal)}</p>
              <div class="academic-meta" aria-label="Características académicas">
                <span>${escapeHtml(lesson.cognitiveLevel || "Aplicar")}</span>
                <span>${escapeHtml(String(lesson.estimatedMinutes || 15))} min</span>
                <span>${escapeHtml(lesson.evidence || "Evidencia verificable")}</span>
              </div>
            </header>
            <div class="concept-block">
              <p>${lesson.theory}</p>
              ${lesson.keyPoints?.length ? `<ul class="key-points">${lesson.keyPoints.map((point) => `<li>${icon("check")}<span>${point}</span></li>`).join("")}</ul>` : ""}
              ${lesson.misconception ? `<aside class="misconception-note"><strong>Error conceptual frecuente</strong><p>${escapeHtml(lesson.misconception)}</p></aside>` : ""}
            </div>
            ${lesson.type === "quiz" ? renderQuiz(lesson) : renderWorkspace(lesson)}
          </article>
        </section>
        <aside class="lesson-aside">
          <div class="aside-card"><span class="eyebrow">PROGRESO DEL MÓDULO</span><h3 id="aside-progress-title">${progress.done} de ${progress.total} etapas</h3><div class="progress-track aside-progress"><span id="aside-progress-bar" style="width:${progress.percent}%"></span></div><p id="aside-progress-copy">${state.completed[lesson.id] ? `Esta etapa está completada. Autonomía: ${state.mastery[lesson.id] || 100}%.` : "Completa la actividad para avanzar a la siguiente etapa."}</p></div>
          ${unit.essentialQuestion ? `<div class="aside-card academic-aside"><span class="eyebrow">PREGUNTA ESENCIAL</span><p>${escapeHtml(unit.essentialQuestion)}</p></div>` : ""}
          ${lesson.rubric?.length ? `<div class="aside-card"><h3>Criterios de logro</h3><ul class="rubric-list">${lesson.rubric.map((item) => `<li>${icon("check")}<span>${escapeHtml(item)}</span></li>`).join("")}</ul></div>` : ""}
          <div class="aside-card"><h3>Navegación</h3><div class="lesson-nav-buttons" id="lesson-nav-buttons">${lessonNavigation(unit, currentIndex)}</div></div>
          <div class="aside-card keyboard-tip"><kbd>Ctrl ↵</kbd><p>Ejecuta el código sin apartar las manos del teclado.</p></div>
        </aside>
      </div>
    </div>`;

    main.querySelectorAll("[data-step]").forEach((button) => button.addEventListener("click", () => openLesson(unit.id, button.dataset.step)));
    bindLessonNavigation();
    if (lesson.type === "quiz") bindQuiz(unit, lesson);
    else bindWorkspace(unit, lesson);
    renderNavigation();
  }

  function renderQuiz(lesson) {
    return `<div class="quiz-panel"><form id="quiz-form"><fieldset><legend>${lesson.question}</legend>
      ${lesson.options.map((option, index) => `<label class="quiz-option"><input type="radio" name="quiz-answer" value="${index}"><span>${option}</span></label>`).join("")}
      </fieldset><div class="quiz-actions"><button class="button button-primary" type="submit">${icon("check")} Comprobar respuesta</button></div></form>
      <div class="feedback" id="feedback" role="status" aria-live="polite"></div></div>`;
  }

  function editorMarkup(value) {
    return `<div class="editor-wrap">
      <div class="editor-gutter" aria-hidden="true"><div class="editor-gutter-inner"></div></div>
      <div class="editor-code">
        <pre class="editor-highlight" aria-hidden="true"><code></code></pre>
        <textarea class="code-editor" id="code-editor" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" wrap="off" aria-label="Editor de código JavaScript">${escapeHtml(value)}</textarea>
      </div>
    </div>`;
  }

  function renderWorkspace(lesson) {
    const draft = state.drafts[lesson.id] ?? lesson.starter;
    const isDom = lesson.type === "dom";
    const solutionLocked = lesson.isAssessment && (state.attempts[lesson.id] || 0) < 2;
    return `<div class="workspace">
      <div class="workspace-toolbar"><span class="workspace-toolbar-title">${icon("code")} main.js</span><div class="workspace-toolbar-actions"><button class="toolbar-button" id="reset-code">Restaurar</button></div></div>
      ${editorMarkup(draft)}
      ${isDom ? "" : `<div class="prediction-panel"><label for="prediction-input">Predice la salida (opcional)</label><p>Antes de ejecutar, anota qué crees que mostrará la consola. Predecir antes de ver el resultado fija mejor el aprendizaje.</p><textarea id="prediction-input" rows="2" spellcheck="false" placeholder="Creo que imprimirá…">${escapeHtml(state.predictions?.[lesson.id] || "")}</textarea><div class="prediction-result" id="prediction-result"></div></div>`}
      <div class="workspace-bottom ${isDom ? "" : "console-only"}">
        <div class="console-panel"><div class="panel-label">${icon("terminal")} Consola</div><pre class="console-output muted" id="console-output">Ejecuta tu código para ver el resultado.</pre></div>
        ${isDom ? `<div class="preview-panel"><div class="panel-label">Vista previa</div><div class="preview-host" id="preview-host"></div></div>` : ""}
      </div>
      ${lesson.reflectionPrompt ? `<div class="reflection-panel"><label for="reflection-input">Autoexplicación obligatoria</label><p>${escapeHtml(lesson.reflectionPrompt)}</p><textarea id="reflection-input" minlength="20" placeholder="Explica tu razonamiento en al menos 20 caracteres…">${escapeHtml(state.reflections[lesson.id] || "")}</textarea><small>La explicación se guarda localmente y forma parte de la evidencia de dominio.</small></div>` : ""}
      <div class="feedback" id="feedback" role="status" aria-live="polite"></div>
      <div class="hint-panel" id="hint-panel"></div>
      <div class="workspace-actions">
        <button class="button" id="run-code">${icon("play")} Ejecutar</button>
        <button class="button button-ghost" id="show-hint">${icon("hint")} Pista</button>
        <button class="button button-ghost" id="show-solution" ${solutionLocked ? "disabled" : ""}>${solutionLocked ? "Solución tras 2 intentos" : "Ver solución"}</button>
        <button class="button button-primary" id="validate-code">${icon("check")} Validar reto</button>
      </div>
    </div>`;
  }

  function lessonNavigation(unit, currentIndex) {
    const previous = currentIndex > 0 ? unit.lessons[currentIndex - 1] : null;
    const next = currentIndex < unit.lessons.length - 1 ? unit.lessons[currentIndex + 1] : null;
    const nextModule = COURSE_DATA.modules[COURSE_DATA.modules.findIndex((item) => item.id === unit.id) + 1];
    return `
      ${previous ? `<button class="button button-ghost" data-lesson-nav="${unit.id}:${previous.id}">Etapa anterior</button>` : ""}
      ${next ? `<button class="button" data-lesson-nav="${unit.id}:${next.id}">Etapa siguiente ${icon("arrow")}</button>` : ""}
      ${!next && nextModule && unitCompleted(unit) ? `<button class="button button-primary" data-lesson-nav="${nextModule.id}:${nextModule.lessons[0].id}">Siguiente módulo ${icon("arrow")}</button>` : ""}`;
  }

  function bindLessonNavigation() {
    main.querySelectorAll("[data-lesson-nav]").forEach((button) => {
      button.addEventListener("click", () => {
        const [nextUnit, nextLesson] = button.dataset.lessonNav.split(":");
        openLesson(nextUnit, nextLesson);
      });
    });
  }

  function bindQuiz(unit, lesson) {
    const form = document.querySelector("#quiz-form");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const selected = form.querySelector("input:checked");
      if (!selected) { setFeedback(false, "Selecciona una respuesta antes de comprobar."); return; }
      state.attempts[lesson.id] = (state.attempts[lesson.id] || 0) + 1;
      saveState();
      const correct = Number(selected.value) === lesson.answer;
      if (correct) {
        completeLesson(unit, lesson);
        setFeedback(true, lesson.explanation);
      } else {
        setFeedback(false, `Aún no. ${lesson.explanation}`);
      }
    });
  }

  function bindWorkspace(unit, lesson) {
    const editor = document.querySelector("#code-editor");
    const output = document.querySelector("#console-output");
    const runButton = document.querySelector("#run-code");
    const validateButton = document.querySelector("#validate-code");
    const previewHost = document.querySelector("#preview-host");
    const reflectionInput = document.querySelector("#reflection-input");
    const solutionButton = document.querySelector("#show-solution");
    const predictionInput = document.querySelector("#prediction-input");
    if (window.Editor) window.Editor.enhance(editor);

    predictionInput?.addEventListener("input", () => {
      state.predictions[lesson.id] = predictionInput.value;
      saveState();
    });

    editor.addEventListener("input", () => {
      state.drafts[lesson.id] = editor.value;
      saveState();
    });
    reflectionInput?.addEventListener("input", () => {
      state.reflections[lesson.id] = reflectionInput.value;
      saveState();
    });
    editor.addEventListener("keydown", (event) => {
      if (event.key === "Tab") {
        event.preventDefault();
        const start = editor.selectionStart;
        editor.setRangeText("  ", start, editor.selectionEnd, "end");
        editor.dispatchEvent(new Event("input"));
      }
      if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        runAttempt(false);
      }
    });

    async function runAttempt(shouldValidate) {
      if (shouldValidate && reflectionInput && reflectionInput.value.trim().length < 20) {
        setFeedback(false, "Antes de validar, explica tu razonamiento con al menos 20 caracteres.");
        reflectionInput.focus();
        return;
      }
      runButton.disabled = true;
      validateButton.disabled = true;
      output.className = "console-output muted";
      output.textContent = "Ejecutando…";
      if (shouldValidate) {
        state.attempts[lesson.id] = (state.attempts[lesson.id] || 0) + 1;
        saveState();
      }
      const result = lesson.type === "dom"
        ? await CodeRunner.runDom(editor.value, lesson, previewHost)
        : await CodeRunner.runConsole(editor.value, lesson.tests || []);
      const lines = result.output || [];
      output.className = `console-output ${result.error ? "error" : lines.length ? "" : "muted"}`;
      output.textContent = result.error ? `Error: ${result.error}` : lines.length ? lines.join("\n") : "El programa terminó sin mostrar datos.";
      const predictionResult = document.querySelector("#prediction-result");
      if (predictionResult && predictionInput && predictionInput.value.trim()) {
        predictionResult.innerHTML = `<strong>Tu predicción:</strong> ${escapeHtml(predictionInput.value.trim())}<br><span>Compárala con la salida de arriba: ¿coincidió?</span>`;
        predictionResult.classList.add("visible");
      }
      if (shouldValidate) {
        const validation = LearningValidator.validate(lesson, result);
        if (validation.ok) completeLesson(unit, lesson);
        setFeedback(validation.ok, validation.ok ? `Reto completado. ${validation.detail}` : validation.detail);
        if (!validation.ok && lesson.isAssessment && (state.attempts[lesson.id] || 0) >= 2 && solutionButton) {
          solutionButton.disabled = false;
          solutionButton.textContent = "Ver solución";
        }
      }
      runButton.disabled = false;
      validateButton.disabled = false;
    }

    runButton.addEventListener("click", () => runAttempt(false));
    validateButton.addEventListener("click", () => runAttempt(true));
    document.querySelector("#reset-code").addEventListener("click", () => {
      editor.value = lesson.starter;
      state.drafts[lesson.id] = lesson.starter;
      saveState();
      output.className = "console-output muted";
      output.textContent = "Código restaurado. Ejecuta de nuevo cuando estés listo.";
      document.querySelector("#feedback").className = "feedback";
    });
    document.querySelector("#show-hint").addEventListener("click", () => {
      const hints = lesson.hints || [];
      const panel = document.querySelector("#hint-panel");
      if (!hints.length) return;
      const current = Math.min(hintIndex, hints.length - 1);
      panel.innerHTML = `<strong>Pista ${current + 1} de ${hints.length}</strong><p>${hints[current]}</p>`;
      panel.classList.add("visible");
      state.hintsUsed[lesson.id] = Math.max(state.hintsUsed[lesson.id] || 0, current + 1);
      saveState();
      hintIndex = Math.min(hintIndex + 1, hints.length - 1);
    });
    solutionButton.addEventListener("click", () => {
      const panel = document.querySelector("#hint-panel");
      panel.innerHTML = `<strong>Una solución posible</strong><p>Compárala con tu enfoque. Lo importante es explicar por qué funciona.</p><pre class="solution-code">${escapeHtml(lesson.solution)}</pre>`;
      panel.classList.add("visible");
      state.solutionsViewed[lesson.id] = true;
      saveState();
    });
  }

  function setFeedback(success, detail) {
    const feedback = document.querySelector("#feedback");
    feedback.className = `feedback visible ${success ? "success" : "error"}`;
    feedback.innerHTML = `<strong>${success ? "Objetivo cumplido" : "Revisa este punto"}</strong><p>${detail}</p>`;
    feedback.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function completeLesson(unit, lesson) {
    const wasCompleted = Boolean(state.completed[lesson.id]);
    state.completed[lesson.id] = true;
    if (!wasCompleted) state.completedAt[lesson.id] = new Date().toISOString();
    state.mastery[lesson.id] = Math.max(state.mastery[lesson.id] || 0, calculateMastery(lesson.id));
    saveState();
    renderNavigation();
    updateGlobalProgress();
    const progress = unitProgress(unit);
    const title = document.querySelector("#aside-progress-title");
    const bar = document.querySelector("#aside-progress-bar");
    const copy = document.querySelector("#aside-progress-copy");
    const step = document.querySelector(`[data-step="${lesson.id}"]`);
    const lessonNav = document.querySelector("#lesson-nav-buttons");
    if (title) title.textContent = `${progress.done} de ${progress.total} etapas`;
    if (bar) bar.style.width = `${progress.percent}%`;
    if (copy) copy.textContent = `Esta etapa está completada. Autonomía: ${state.mastery[lesson.id]}%.`;
    if (step) step.classList.add("completed");
    if (lessonNav) {
      const currentIndex = unit.lessons.findIndex((item) => item.id === lesson.id);
      lessonNav.innerHTML = lessonNavigation(unit, currentIndex);
      bindLessonNavigation();
    }
    if (!wasCompleted) {
      showToast(progress.done === progress.total ? `Módulo completado: ${unit.title}` : "Etapa completada. Tu progreso quedó guardado.");
    }
  }

  function eligibleReviewLessons() {
    return COURSE_DATA.allLessons.filter((lesson) =>
      (lesson.type === "code" || lesson.type === "debug") &&
      state.completed[lesson.id] &&
      typeof lesson.solution === "string");
  }

  function pickReviewLesson(excludeId) {
    let pool = eligibleReviewLessons().filter((lesson) => lesson.id !== excludeId);
    if (!pool.length) pool = eligibleReviewLessons();
    if (!pool.length) return null;
    const lastReview = (lesson) => {
      const entry = state.reviews[lesson.id];
      return entry && entry.last ? new Date(entry.last).getTime() : 0;
    };
    pool.sort((a, b) => lastReview(a) - lastReview(b));
    const stale = pool.slice(0, Math.min(5, pool.length));
    return stale[Math.floor(Math.random() * stale.length)];
  }

  function renderReview(lesson) {
    const target = lesson || pickReviewLesson();
    if (!target) { showToast("Completa algunas etapas de código para activar el repaso."); return; }
    main.dataset.view = "review";
    state.currentUnit = "";
    history.replaceState(null, "", location.pathname + location.search);
    const unit = COURSE_DATA.getUnit(target.unitId);
    const reviewed = state.reviews[target.id]?.count || 0;
    const totalEligible = eligibleReviewLessons().length;
    main.innerHTML = `<div class="content-container">
      <header class="lesson-header">
        <div class="breadcrumbs"><span>Repaso</span><span>/</span><span>Práctica de recuperación</span></div>
        <div class="lesson-title-row"><div><span class="eyebrow">RECUPERACIÓN ESPACIADA</span><h1>Repaso activo</h1><p class="lesson-summary">Recordar sin mirar fija la memoria más que releer. Tienes ${totalEligible} ${totalEligible === 1 ? "reto disponible" : "retos disponibles"}.</p></div></div>
      </header>
      <div class="lesson-layout">
        <section class="lesson-main">
          <article class="lesson-card">
            <header class="lesson-card-header">
              <span class="lesson-type">${icon("bolt")} Repaso · ${escapeHtml(unit ? unit.title : "")}</span>
              <h2>${escapeHtml(target.title)}</h2>
              <p>${escapeHtml(target.goal)}</p>
              <div class="academic-meta"><span>Repasado ${reviewed} ${reviewed === 1 ? "vez" : "veces"}</span><span>${escapeHtml(target.cognitiveLevel || "Aplicar")}</span></div>
            </header>
            <div class="workspace">
              <div class="workspace-toolbar"><span class="workspace-toolbar-title">${icon("code")} repaso.js</span></div>
              ${editorMarkup(target.starter)}
              <div class="workspace-bottom console-only">
                <div class="console-panel"><div class="panel-label">${icon("terminal")} Consola</div><pre class="console-output muted" id="console-output">Resuelve de memoria y ejecuta para comprobar.</pre></div>
              </div>
              <div class="feedback" id="feedback" role="status" aria-live="polite"></div>
              <div class="hint-panel" id="hint-panel"></div>
              <div class="workspace-actions">
                <button class="button" id="run-code">${icon("play")} Ejecutar</button>
                <button class="button button-ghost" id="show-hint">${icon("hint")} Pista</button>
                <button class="button button-ghost" id="show-solution">Ver solución</button>
                <button class="button button-primary" id="validate-code">${icon("check")} Comprobar</button>
              </div>
            </div>
          </article>
        </section>
        <aside class="lesson-aside">
          <div class="aside-card academic-aside"><span class="eyebrow">POR QUÉ FUNCIONA</span><p>El repaso prioriza lo que hace más tiempo que no practicas. Recuperar el conocimiento de memoria es de las técnicas más eficaces para retenerlo. No altera tu progreso del curso.</p></div>
          <div class="aside-card"><h3>Acciones</h3><div class="lesson-nav-buttons"><button class="button" id="review-next">Otro reto ${icon("arrow")}</button><button class="button button-ghost" id="review-exit">Salir del repaso</button></div></div>
        </aside>
      </div>
    </div>`;
    bindReview(unit, target);
    renderNavigation();
    main.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function bindReview(unit, lesson) {
    const editor = document.querySelector("#code-editor");
    const output = document.querySelector("#console-output");
    const runButton = document.querySelector("#run-code");
    const validateButton = document.querySelector("#validate-code");
    if (window.Editor) window.Editor.enhance(editor);
    let localHint = 0;

    editor.addEventListener("keydown", (event) => {
      if (event.key === "Tab") {
        event.preventDefault();
        const start = editor.selectionStart;
        editor.setRangeText("  ", start, editor.selectionEnd, "end");
        editor.dispatchEvent(new Event("input"));
      }
      if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        runReview(false);
      }
    });

    async function runReview(shouldValidate) {
      runButton.disabled = true;
      validateButton.disabled = true;
      output.className = "console-output muted";
      output.textContent = "Ejecutando…";
      const result = await CodeRunner.runConsole(editor.value, lesson.tests || []);
      const lines = result.output || [];
      output.className = `console-output ${result.error ? "error" : lines.length ? "" : "muted"}`;
      output.textContent = result.error ? `Error: ${result.error}` : lines.length ? lines.join("\n") : "El programa terminó sin mostrar datos.";
      if (shouldValidate) {
        const validation = LearningValidator.validate(lesson, result);
        if (validation.ok) {
          const entry = state.reviews[lesson.id] || { count: 0 };
          state.reviews[lesson.id] = { count: entry.count + 1, last: new Date().toISOString() };
          saveState();
          setFeedback(true, `¡Recordado! Llevas ${state.reviews[lesson.id].count} repaso(s) de esta etapa. Pulsa "Otro reto" para seguir.`);
        } else {
          setFeedback(false, validation.detail);
        }
      }
      runButton.disabled = false;
      validateButton.disabled = false;
    }

    runButton.addEventListener("click", () => runReview(false));
    validateButton.addEventListener("click", () => runReview(true));
    document.querySelector("#show-hint").addEventListener("click", () => {
      const hints = lesson.hints || [];
      if (!hints.length) return;
      const panel = document.querySelector("#hint-panel");
      const current = Math.min(localHint, hints.length - 1);
      panel.innerHTML = `<strong>Pista ${current + 1} de ${hints.length}</strong><p>${hints[current]}</p>`;
      panel.classList.add("visible");
      localHint = Math.min(localHint + 1, hints.length - 1);
    });
    document.querySelector("#show-solution").addEventListener("click", () => {
      const panel = document.querySelector("#hint-panel");
      panel.innerHTML = `<strong>Una solución posible</strong><pre class="solution-code">${escapeHtml(lesson.solution)}</pre>`;
      panel.classList.add("visible");
    });
    document.querySelector("#review-next").addEventListener("click", () => renderReview(pickReviewLesson(lesson.id)));
    document.querySelector("#review-exit").addEventListener("click", renderDashboard);
  }

  function exportProgress() {
    const payload = JSON.stringify({ app: "javascript-lab", version: 2, exportedAt: new Date().toISOString(), state }, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `javascript-lab-progreso-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showToast("Progreso exportado como archivo JSON.");
  }

  function importProgress(event) {
    const file = event.target.files && event.target.files[0];
    event.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        const incoming = parsed && parsed.state ? parsed.state : parsed;
        if (!incoming || typeof incoming !== "object" || typeof incoming.completed !== "object") {
          throw new Error("formato no válido");
        }
        state = { ...defaultState, ...incoming };
        saveState();
        setTheme(state.theme || "dark");
        renderDashboard();
        showToast("Progreso importado correctamente.");
      } catch (_) {
        showToast("No se pudo leer el archivo: ¿es un export válido?");
      }
    };
    reader.onerror = () => showToast("No se pudo leer el archivo seleccionado.");
    reader.readAsText(file);
  }

  function openSidebar() {
    sidebar.classList.add("open");
    scrim.classList.add("visible");
    document.querySelector("#menu-button").setAttribute("aria-expanded", "true");
  }

  function closeSidebar() {
    sidebar.classList.remove("open");
    scrim.classList.remove("visible");
    document.querySelector("#menu-button").setAttribute("aria-expanded", "false");
  }

  function openHashLesson() {
    const requestedLesson = COURSE_DATA.getLesson(location.hash.slice(1));
    const requestedUnit = requestedLesson ? COURSE_DATA.getUnit(requestedLesson.unitId) : null;
    if (!requestedLesson || !requestedUnit || !unitUnlocked(requestedUnit)) return false;
    if (state.currentLesson !== requestedLesson.id || main.dataset.view !== "lesson") {
      openLesson(requestedUnit.id, requestedLesson.id);
    }
    return true;
  }

  document.querySelector("#brand-button").addEventListener("click", renderDashboard);
  document.querySelector("#theme-button").addEventListener("click", () => setTheme(state.theme === "dark" ? "light" : "dark"));
  document.querySelector("#menu-button").addEventListener("click", openSidebar);
  document.querySelector("#close-menu-button").addEventListener("click", closeSidebar);
  scrim.addEventListener("click", closeSidebar);
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeSidebar(); });
  window.addEventListener("hashchange", () => {
    if (!location.hash) renderDashboard();
    else openHashLesson();
  });
  document.querySelector("#reset-progress-button").addEventListener("click", () => {
    if (!confirm("¿Reiniciar todo el progreso y los borradores? Esta acción no se puede deshacer.")) return;
    state = { ...defaultState, sessions: state.sessions, theme: state.theme };
    saveState();
    renderDashboard();
    showToast("El progreso fue reiniciado.");
  });

  document.querySelector("#export-progress-button").addEventListener("click", exportProgress);
  document.querySelector("#import-progress-button").addEventListener("click", () => document.querySelector("#import-file").click());
  document.querySelector("#import-file").addEventListener("change", importProgress);

  setTheme(state.theme);
  registerSession();
  if (!openHashLesson()) renderDashboard();
})();
