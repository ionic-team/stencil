import { IonicGlobal } from '../../../util/interfaces';


(function(window: any, document: HTMLDocument) {
  'use strict';

  // create window.Ionic if it doesn't already exist
  var ionic: IonicGlobal = window.Ionic = window.Ionic || {};

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

  // auto hide components until they been fully hydrated
  var style = document.createElement('style');
  style.innerHTML = ionic.components.map(function(c) { return c[0]; }).join(',') + '{visibility:hidden}.hydrated{visibility:inherit}';
  document.head.appendChild(style);

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

  var requestIdleCallback = 'requestIdleCallback';
  if (!(requestIdleCallback in window)) {
    // darn, this browser doesn't support requestIdleCallback
    // let's shim it!
    window[requestIdleCallback] = function(cb) {
      var start = Date.now();
      return setTimeout(function() {
        cb({
          didTimeout: false,
          timeRemaining: function() {
            return Math.max(0, 50 - (Date.now() - start));
          }
        });
      }, 1);
    };
  }

  // request the ionic core file this browser needs
  var s = document.createElement('script');
  s.src = ionic.staticDir + 'ionic.' + pathItems.join('.') + '.js';
  document.head.appendChild(s);

  // using requestIdleCallback, async load the animation core
  window[requestIdleCallback](function() {
    var s = document.createElement('script');
    s.src = ionic.staticDir + 'ionic.animation.js';
    document.head.appendChild(s);
  });

})(window, document);
