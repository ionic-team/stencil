(function(d: HTMLDocument) {
  'use strict';

  var dir: string;

  var scp: any = d.getElementsByTagName('script');
  scp = scp[scp.length - 1];
  var isMin = scp.src.indexOf('.min.js') > -1;

  var stcDir = <HTMLElement>d.querySelector('script[data-static-dir]');
  if (stcDir) {
    dir = stcDir.dataset['staticDir'];

  } else {
    var paths = scp.src.split('/');
    paths.pop();
    dir = scp.dataset['staticDir'] = paths.join('/') + '/';
  }

  function es5() {
    try {
      eval('(class C{})');
    } catch (e) {
      return true;
    }
  }

  const i: string[] = [
    'core'
  ];

  if (!window.customElements || es5()) {
    i.push('es5');
  }

  if (isMin) {
    i.push('min');
  }

  const s = d.createElement('script');
  s.src = `${dir}ionic.${i.join('.')}.js`;
  d.head.appendChild(s);

})(document);
