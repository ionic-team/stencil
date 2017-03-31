
(function(window: any, document: HTMLDocument, requiresEs5: {(): boolean}) {
  'use strict';

  var ionic = window.Ionic = window.Ionic || {};

  var scriptElm: any = document.getElementsByTagName('script');
  scriptElm = scriptElm[scriptElm.length - 1];
  var isMin = scriptElm.src.indexOf('.min.js') > -1;

  var stcDir = <HTMLElement>document.querySelector('script[data-static-dir]');
  if (stcDir) {
    ionic.staticDir = stcDir.dataset['staticDir'];

  } else {
    var paths = scriptElm.src.split('/');
    paths.pop();
    ionic.staticDir = scriptElm.dataset['staticDir'] = paths.join('/') + '/';
  }

  var pathItems: string[] = [
    'core'
  ];

  if (!window.customElements || requiresEs5()) {
    pathItems.push('es5');
  }

  if (isMin) {
    pathItems.push('min');
  }

  var s = document.createElement('script');
  s.src = `${ionic.staticDir}ionic.${pathItems.join('.')}.js`;
  document.head.appendChild(s);

})(
  window,
  document,
  function es5() {
    try {
      eval('(class C{})');
    } catch (e) {
      return true;
    }
  }
);
