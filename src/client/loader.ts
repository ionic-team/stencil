import { LoadComponentRegistry } from '../util/interfaces';


(function(window: any, document: Document, appNamespace: string, appCore?: string, appCoreEs5?: string, components?: LoadComponentRegistry[], x?: any) {
  'use strict';

  // create global namespace if it doesn't already exist
  (window[appNamespace] = window[appNamespace] || {}).components = components = components || [];

  // auto hide components until they been fully hydrated
  // reusing the "x" variable from the args for funzies
  x = document.createElement('style');
  x.innerHTML = (components.map(function(c) { return c[0]; }).join(',') + '{visibility:hidden}.💎{visibility:inherit}').toLowerCase();
  x.innerHTML += 'ion-app:not(.💎){display:none}';
  document.head.appendChild(x);

  // request the core file this browser needs
  x = document.createElement('script');
  x.src = (window.customElements ? appCore : appCoreEs5);
  document.head.appendChild(x);

})(window, document, '__STENCIL__APP__');
