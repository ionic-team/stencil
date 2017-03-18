
(function(window: any, document: HTMLDocument) {
  'use strict';

  var staticDir = getStaticComponentDir();

  if (!window.customElements || window.customElements.forcePolyfill) {
    var polyfillScript = document.createElement('script');
    polyfillScript.src = staticDir + 'webcomponents-ce.js';
    document.head.appendChild(polyfillScript);

  } else {
    requestAnimationFrame(() => {
      window.dispatchEvent(new CustomEvent('WebComponentsReady'));
    });
  }

  function getStaticComponentDir(): string {
    var val: any = document.querySelector('script[data-static-dir]');
    if (val) {
      return val.dataset['staticDir'];
    }

    val = document.getElementsByTagName('script');
    val = val[val.length - 1];

    var paths = val.src.split('/');
    paths.pop();

    return val.dataset['staticDir'] = paths.join('/') + '/';
  }

})(window, document);
