(function () {
  const looksCorrupted = (t) => /\\\(|\\\)/.test(t);
  const fix = (t) =>
    t.replace(/\\\(/g, '$')
     .replace(/\\\)/g, '$')
     .replace(/([a-zA-Z\-])\$/g, '$1 $');

  const original = navigator.clipboard.writeText.bind(navigator.clipboard);
  navigator.clipboard.writeText = function (text) {
    if (typeof text === 'string' && looksCorrupted(text)) {
      text = fix(text);
    }
    return original(text);
  };
})();