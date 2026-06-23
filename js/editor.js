(function (global) {
  "use strict";

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  const TOKENS = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|(`(?:\\.|[^`\\])*`|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(\b\d[\d_]*(?:\.\d+)?\b)|(\b(?:const|let|var|function|return|if|else|for|while|do|switch|case|default|break|continue|new|class|extends|super|this|try|catch|finally|throw|typeof|instanceof|in|of|await|async|yield|delete|void|null|undefined|true|false)\b)|([A-Za-z_$][\w$]*)(?=\s*\()/g;

  // Convierte código en HTML resaltado. Escapa todo: seguro frente a inyección.
  function highlight(code) {
    let out = "";
    let last = 0;
    let match;
    TOKENS.lastIndex = 0;
    while ((match = TOKENS.exec(code))) {
      out += escapeHtml(code.slice(last, match.index));
      const [whole, comment, str, num, keyword, fn] = match;
      if (comment) out += `<span class="tk-com">${escapeHtml(comment)}</span>`;
      else if (str) out += `<span class="tk-str">${escapeHtml(str)}</span>`;
      else if (num) out += `<span class="tk-num">${escapeHtml(num)}</span>`;
      else if (keyword) out += `<span class="tk-kw">${escapeHtml(keyword)}</span>`;
      else if (fn) out += `<span class="tk-fn">${escapeHtml(fn)}</span>`;
      last = match.index + whole.length;
    }
    out += escapeHtml(code.slice(last));
    return out;
  }

  // Estructura recomendada dentro de .editor-wrap:
  //   <div class="editor-gutter"><div class="editor-gutter-inner"></div></div>
  //   <div class="editor-code">
  //     <pre class="editor-highlight" aria-hidden="true"><code></code></pre>
  //     <textarea class="code-editor"></textarea>
  //   </div>
  function enhance(textarea) {
    if (!textarea || typeof document === "undefined") return () => {};
    const wrap = textarea.closest(".editor-wrap");
    if (!wrap) return () => {};
    const gutter = wrap.querySelector(".editor-gutter-inner");
    const pre = wrap.querySelector(".editor-highlight");
    const codeNode = pre ? pre.querySelector("code") : null;
    if (!gutter || !codeNode || !pre) return () => {};
    wrap.classList.add("editor-enhanced");

    const render = () => {
      const code = textarea.value;
      codeNode.innerHTML = highlight(code.endsWith("\n") ? code + " " : code);
      const lines = code.split("\n").length;
      let numbers = "";
      for (let i = 1; i <= lines; i += 1) numbers += `<span>${i}</span>`;
      gutter.innerHTML = numbers;
    };
    const sync = () => {
      pre.scrollTop = textarea.scrollTop;
      pre.scrollLeft = textarea.scrollLeft;
      gutter.style.transform = `translateY(${-textarea.scrollTop}px)`;
    };
    textarea.addEventListener("input", () => { render(); sync(); });
    textarea.addEventListener("scroll", sync);
    render();
    sync();
    return render;
  }

  const api = { highlight, enhance };
  global.Editor = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
