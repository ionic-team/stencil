import { LoadComponentRegistry, ProjectNamespace } from '../../util/interfaces';


(function(window: any, document: HTMLDocument, projectNamespace: string, projectCore?: string, projectCoreEs5?: string, components?: LoadComponentRegistry[], x?: any) {
  'use strict';

  // create global namespace if it doesn't already exist
  components = components || [];
  (window[projectNamespace] = window[projectNamespace] || {}).components = components;

  // auto hide components until they been fully hydrated
  // reusing the "x" variable from the args for funzies
  x = document.createElement('style');
  x.innerHTML = components.map(function(c) { return c[0]; }).join(',') + '{visibility:hidden}.hydrated{visibility:inherit}';
  x.innerHTML += 'ion-app:not(.hydrated){display:none}';
  document.head.appendChild(x);

  // request the core file this browser needs
  x = document.createElement('script');
  x.src = (window.customElements ? projectCore : projectCoreEs5);
  document.head.appendChild(x);

  // performance.now() polyfill
  if ('performance' in window === false) {
    window.performance = {};
  }
  if ('now' in performance === false) {
    x = Date.now();
    performance.now = function() {
      return Date.now() - x;
    };
  }
})(
  window,
  document,
  '__STENCIL__APP__'
);
