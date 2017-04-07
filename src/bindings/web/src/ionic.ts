import { Ionic } from '../../../util/interfaces';


(function(window: any, document: HTMLDocument) {
  'use strict';

  // create window.Ionic if it doesn't already exist
  var ionic: Ionic = window.Ionic = window.Ionic || {};

  // find the static directory, which should be the same as this JS file
  var scriptElm: any = document.getElementsByTagName('script');
  scriptElm = scriptElm[scriptElm.length - 1];

  var stcDir = <HTMLElement>document.querySelector('script[data-static-dir]');
  if (stcDir) {
    ionic.staticDir = stcDir.dataset['staticDir'];

  } else {
    var paths = scriptElm.src.split('/');
    paths.pop();
    ionic.staticDir = scriptElm.dataset['staticDir'] = paths.join('/') + '/';
  }

  // build up a path for the exact ionic core javascript file this browser needs
  var pathItems: string[] = ['core'];

  if (!('attachShadow' in Element.prototype)) {
    // browser requires the shadow dom polyfill
    pathItems.push('sd');
  }

  if (!window.customElements) {
    // browser requires the custom elements polyfill
    pathItems.push('ce');
  }

  if ($IONIC_DEV_MODE) {
    // hardcoded at build time
    pathItems.push('dev');
    ionic.devMode = true;
  }

  // request the ionic core file this browser needs
  var s = document.createElement('script');
  s.src = ionic.staticDir + 'ionic.' + pathItems.join('.') + '.js';
  document.head.appendChild(s);

})(window, document);


// hardcoded at build time
declare const $IONIC_DEV_MODE: boolean;
