

export function applyPolyfills(window) {
  if (_BUILD_.polyfills) {
    const promises = [];

    if (!window.customElements || (window.Element && (!window.Element.prototype.closest || !window.Element.prototype.matches || !window.Element.prototype.remove))) {
      promises.push(import('./polyfills/dom.js'));
    }

    if (!Object.entries || !Object.values) {
      promises.push(import('./polyfills/object.js'));
    }

    if (!Array.prototype.includes) {
      promises.push(import('./polyfills/array.js'));
    }

    if (!window.fetch) {
      promises.push(import('./polyfills/fetch.js'));
    }

    if (typeof WeakMap == 'undefined' || !(window.CSS && window.CSS.supports && window.CSS.supports('color', 'var(--c)'))) {
      promises.push(import('./polyfills/css-shim.js'));
    }

    function checkIfURLIsSupported() {
      try {
        var u = new URL('b', 'http://a');
        u.pathname = 'c%20d';
        return (u.href === 'http://a/c%20d') && u.searchParams;
      } catch(e) {
        return false;
      }
    }
    if (!checkIfURLIsSupported) {
      promises.push(import('./polyfills/url.js'));
    }

    return Promise.all(promises).then(function(results) {
      results.forEach(function(polyfillModule) {
        try {
          polyfillModule.applyPolyfill(window, window.document);
        } catch (e) {
          console.error(e);
        }
      });
    });
  } else {
    return Promise.resolve();
  }
}
