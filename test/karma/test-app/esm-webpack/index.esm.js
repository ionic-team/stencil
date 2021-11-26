import { defineCustomElements, applyPolyfills } from '../../test-output/test-dist/loader';

applyPolyfills()
  .then(function () {
    return defineCustomElements(window);
  })
  .then(function () {
    var elm = document.querySelector('esm-import');
    elm.componentOnReady().then(function (readyElm) {
      readyElm.classList.add('esm-import-componentOnReady');
    });
  });
