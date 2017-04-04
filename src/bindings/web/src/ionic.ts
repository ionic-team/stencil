import { ConfigController } from '../../../platform/config-controller';
import { DomController } from '../../../platform/dom-controller';
import { Ionic } from '../../../utils/interfaces';
import { NextTickController } from '../../../platform/next-tick-controller';


(function(window: any, document: HTMLDocument) {
  'use strict';

  // create window.Ionic if it doesn't already exist
  const ionic: Ionic = window.Ionic = window.Ionic || {};

  // find the static directory, which should be the same as this JS file
  let scriptElm: any = document.getElementsByTagName('script');
  scriptElm = scriptElm[scriptElm.length - 1];

  let stcDir = <HTMLElement>document.querySelector('script[data-static-dir]');
  if (stcDir) {
    ionic.staticDir = stcDir.dataset['staticDir'];

  } else {
    let paths = scriptElm.src.split('/');
    paths.pop();
    ionic.staticDir = scriptElm.dataset['staticDir'] = paths.join('/') + '/';
  }

  // create the controllers used by ionic-web
  ionic.configCtrl = ConfigController(ionic.config);
  ionic.domCtrl = DomController(window);
  ionic.nextTickCtrl = NextTickController(window);

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

  // request the ionic core file this browser needs
  var s = document.createElement('script');
  s.src = `${ionic.staticDir}ionic.${pathItems.join('.')}.js`;
  document.head.appendChild(s);

})(window, document);
