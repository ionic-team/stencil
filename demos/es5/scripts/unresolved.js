(function () {
  'use strict';

  // unresolved

  function resolve() {
    document.body.removeAttribute('unresolved');
  }

  if (window.WebComponents) {
    window.addEventListener('WebComponentsReady', resolve);
  } else {
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
      resolve();
    } else {
      window.addEventListener('DOMContentLoaded', resolve);
    }
  }
})();