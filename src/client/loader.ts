import { LoadComponentRegistry } from '../util/interfaces';


(function(window: any, document: Document, appNamespace: string, publicPath?: string, appCore?: string, appCorePolyfilled?: string, components?: LoadComponentRegistry[], x?: any, i?: number) {
  'use strict';

  // create global namespace if it doesn't already exist
  (window[appNamespace] = window[appNamespace] || {}).components = components = components || [];

  // auto hide components until they been fully hydrated
  // reusing the "x" variable from the args for funzies
  x = document.createElement('style');
  x.setAttribute('data-styles', '');
  x.innerHTML = (components.map(function(c) { return c[0]; }).join(',') + '{visibility:hidden}.💎{visibility:inherit}').toLowerCase();
  document.head.insertBefore(x, document.head.firstChild);

  // get this current script
  x = document.getElementsByTagName('script');
  for (i = x.length - 1; i >= 0; i--) {
    if (x[i].src && x[i].src.indexOf(publicPath + '.js') > -1) {
      publicPath = x[i].src.replace(publicPath + '.js', publicPath);
      break;
    }
  }
  publicPath += '/';

  // request the core this browser needs
  // test for native support of custom elements and fetch
  // if either of those are not supported, then use the core w/ polyfills
  x = document.createElement('script');
  x.src = publicPath + ((window.customElements && window.fetch) ? appCore : appCorePolyfilled);
  x.setAttribute('data-path', publicPath);
  x.setAttribute('data-core', appCore);
  document.head.appendChild(x);

})(window, document, '__STENCIL__APP__');
