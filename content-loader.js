// The Dysmusia Project — content loader
// Populates any element with a data-key / data-key-text / data-key-href
// attribute from content.json, so wording can be edited from admin.html
// without touching the HTML.

(function () {
  var scriptEl = document.currentScript;
  var contentUrl = new URL('content.json', scriptEl.src);

  function getPath(obj, path) {
    return path.split('.').reduce(function (o, k) {
      return o && o[k] !== undefined ? o[k] : undefined;
    }, obj);
  }

  function applyContent(content) {
    document.querySelectorAll('[data-key]').forEach(function (el) {
      var val = getPath(content, el.getAttribute('data-key'));
      if (val !== undefined) el.textContent = val;
    });
    document.querySelectorAll('[data-key-text]').forEach(function (el) {
      var val = getPath(content, el.getAttribute('data-key-text'));
      if (val !== undefined) el.textContent = val;
    });
    document.querySelectorAll('[data-key-href]').forEach(function (el) {
      var val = getPath(content, el.getAttribute('data-key-href'));
      if (val !== undefined) el.setAttribute('href', val);
    });
    document.querySelectorAll('[data-key-placeholder]').forEach(function (el) {
      var val = getPath(content, el.getAttribute('data-key-placeholder'));
      if (val !== undefined) el.setAttribute('placeholder', val);
    });
  }

  var isPreview = new URLSearchParams(window.location.search).get('preview') === '1';

  if (isPreview) {
    // Admin page writes unsaved edits here so you can check them before exporting.
    var draft = localStorage.getItem('dysmusia_preview_content');
    if (draft) {
      try {
        applyContent(JSON.parse(draft));
        return;
      } catch (e) {
        console.error('Could not parse preview content, falling back to content.json', e);
      }
    }
  }

  fetch(contentUrl)
    .then(function (res) { return res.json(); })
    .then(applyContent)
    .catch(function (err) { console.error('Could not load content.json', err); });
})();
