import { GlobalNamespace } from '../../../util/interfaces';


// keep this all ES5!
(function(window: any, document: HTMLDocument) {
  'use strict';

  // create window.Ionic if it doesn't already exist
  var ionic: GlobalNamespace = window.Ionic = window.Ionic || {};

  // find the static directory, which should be the same as this JS file
  // reusing the "x" and "y" variables for funzies
  var x: any = document.getElementsByTagName('script');
  x = x[x.length - 1];

  var y: any = <HTMLElement>document.querySelector('script[data-static-dir]');
  if (y) {
    ionic.staticDir = y.dataset['staticDir'];

  } else {
    y = x.src.split('/');
    y.pop();
    ionic.staticDir = x.dataset['staticDir'] = y.join('/') + '/';
  }

  // auto hide components until they been fully hydrated
  x = document.createElement('style');
  x.innerHTML = ionic.components.map(function(c) { return c[0]; }).join(',') + '{visibility:hidden}.hydrated{visibility:inherit}';
  x.innerHTML += 'ion-app:not(.hydrated){display:none}';
  document.head.appendChild(x);

  // build up a path for the exact ionic core javascript file this browser needs
  x = ['core'];

  if (!('attachShadow' in Element.prototype)) {
    // browser requires the shadow dom polyfill
    x.push('sd');
  }

  if (!window.customElements) {
    // browser requires the custom elements polyfill
    x.push('ce');
  }

  // request the ionic core file this browser needs
  y = document.createElement('script');
  y.src = ionic.staticDir + 'ionic.' + x.join('.') + '.js';
  document.head.appendChild(y);

  // performance.now() polyfill
  if ('performance' in window === false) {
    window.performance = {};
  }
  if ('now' in performance === false) {
    var navStart = Date.now();
    performance.now = function() {
      return Date.now() - navStart;
    };
  }
})(window, document);
