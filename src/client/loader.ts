import { LoadComponentRegistry } from '../util/interfaces';


(function(window: any, document: Document, appNamespace?: string, publicPath?: string, appCore?: string, appCoreSsr?: string, appCorePolyfilled?: string, components?: LoadComponentRegistry[], x?: any, i?: any) {
  'use strict';

  // create global namespace if it doesn't already exist
  (window[appNamespace] = window[appNamespace] || {}).components = components = components || [];

  // auto hide components until they been fully hydrated
  // reusing the "x" and "i" variables from the args for funzies
  // note: filter and map must stay es5 and must not use arrow functions
  i = components.filter(function(c) { return c[2]; }).map(function(c) { return c[0]; });
  if (i.length) {
    x = document.createElement('style');
    x.innerHTML = i.join() + '{visibility:hidden}';
    x.setAttribute('data-visibility', '');
    document.head.insertBefore(x, document.head.firstChild);
  }

  // get this current script
  appNamespace = appNamespace.toLowerCase();
  x = document.scripts;
  for (i = x.length - 1; i >= 0; i--) {
    if (x[i].src && x[i].src.split('/').pop() === appNamespace + '.js') {
      publicPath = x[i].src.replace(appNamespace + '.js', appNamespace + '/');
      break;
    }
  }

  // request the core this browser needs
  // test for native support of custom elements and fetch
  // if either of those are not supported, then use the core w/ polyfills
  // also check if the page was build with ssr or not
  x = document.createElement('script');
  x.src = publicPath + ((window.customElements && window.fetch) ? (document.querySelector('[data-ssrv]') ? appCoreSsr : appCore) : appCorePolyfilled);
  x.setAttribute('data-path', publicPath);
  x.setAttribute('data-core', appCore);
  document.head.appendChild(x);

})(window, document, '__APP__');
