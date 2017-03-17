
(function(win: any, doc: any) {
  'use strict';

  var staticDir = getStaticComponentDir();

  if (!win.customElements || win.customElements.forcePolyfill) {
    var polyfillScript = doc.createElement('script');
    polyfillScript.src = staticDir + 'webcomponents-ce.js';
    doc.head.appendChild(polyfillScript);

  } else {
    requestAnimationFrame(function() {
      win.dispatchEvent(new CustomEvent('WebComponentsReady'));
    });
  }

  function getStaticComponentDir(): string {
    var val: any = doc.querySelector('script[data-static-dir]');
    if (val) {
      return val.dataset['staticDir'];
    }

    val = doc.getElementsByTagName('script');
    val = val[val.length - 1];

    var paths = val.src.split('/');
    paths.pop();

    return val.dataset['staticDir'] = paths.join('/') + '/';
  }

})(window, document);
