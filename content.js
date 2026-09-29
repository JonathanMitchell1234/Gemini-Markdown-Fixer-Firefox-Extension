(function () {
  'use strict';

  function looksCorrupted(text) {
    return /\\\(|\\\)/.test(text);
  }

function fixCorruptedDollarSigns(text) {
  let fixed = text.replace(/\\\(/g, '$').replace(/\\\)/g, '$');
  // insert space before a lone $ when glued to the previous token
  fixed = fixed.replace(/([a-zA-Z0-9\-=,\(\{])\$/g, (m, p1) => {
    // don't add a space if it's already $$ or part of $( ... ) subexpression syntax
    return p1 === '(' ? m : `${p1} $`;
  });
  return fixed;
}

  function fixCodeElement(codeEl) {
    if (codeEl.dataset.geminiFixed === 'true') return;
    const original = codeEl.textContent;
    if (!looksCorrupted(original)) return;
    codeEl.textContent = fixCorruptedDollarSigns(original);
    codeEl.dataset.geminiFixed = 'true';
  }

  function scan(root) {
    root.querySelectorAll('pre code, code').forEach(fixCodeElement);
  }

  scan(document.body);

  // Gemini streams tokens in, so keep watching.
  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      m.addedNodes.forEach((node) => {
        if (node.nodeType !== 1) return;
        if (node.matches?.('pre code, code')) fixCodeElement(node);
        scan(node);
      });
      if (m.type === 'characterData') {
        const codeEl = m.target.parentElement?.closest('code');
        if (codeEl) fixCodeElement(codeEl);
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true, characterData: true });

  // Inject a page-context script so we can also patch the
  // page's own navigator.clipboard.writeText calls (used by the "copy" button).
  const s = document.createElement('script');
  s.src = chrome.runtime.getURL('page-injector.js');
  s.onload = function () { this.remove(); };
  (document.head || document.documentElement).appendChild(s);
})();