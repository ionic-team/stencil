import { LoadComponentRegistry } from '../util/interfaces';


(function(window: any, document: Document, appNamespace: string, appCore?: string, appCorePolyfilled?: string, components?: LoadComponentRegistry[], x?: any) {
  'use strict';

  // create global namespace if it doesn't already exist
  (window[appNamespace] = window[appNamespace] || {}).components = components = components || [];

  // auto hide components until they been fully hydrated
  // reusing the "x" variable from the args for funzies
  x = document.createElement('style');
  x.setAttribute('data-styles', '');
  x.innerHTML = (components.map(function(c) { return c[0]; }).join(',') + '{visibility:hidden}.💎{visibility:inherit}').toLowerCase();
  document.head.insertBefore(x, document.head.firstChild);

  // request the core file this browser needs
  x = document.createElement('script');
  x.src = (window.customElements && window.fetch) ? appCore : appCorePolyfilled;
  document.head.appendChild(x);

})(window, document, '__STENCIL__APP__');
