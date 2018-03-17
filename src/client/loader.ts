import { LoadComponentRegistry } from '../declarations';


export function init(
  win: any,
  doc: HTMLDocument,
  namespace: string,
  fsNamespace: string,
  resourcesUrl: string,
  appCore: string,
  appCorePolyfilled: string,
  hydratedCssClass: string,
  components: LoadComponentRegistry[],
  x?: any, y?: any, scriptElm?: HTMLScriptElement
) {
  // create global namespace if it doesn't already exist
  (win[namespace] = win[namespace] || {}).components = components;

  y = components.filter(function(c) { return c[2]; }).map(function(c) { return c[0]; });
  if (y.length) {
    // auto hide components until they been fully hydrated
    // reusing the "x" and "i" variables from the args for funzies
    x = doc.createElement('style');
    x.innerHTML = y.join() + '{visibility:hidden}.' + hydratedCssClass + '{visibility:inherit}';
    x.setAttribute('data-styles', '');
    doc.head.insertBefore(x, doc.head.firstChild);
  }

  // figure out the script element for this current script
  y = doc.querySelectorAll('script');
  for (x = y.length - 1; x >= 0; x--) {
    scriptElm = y[x];
    if (scriptElm.src || scriptElm.hasAttribute('data-resources-url')) {
      break;
    }
  }

  // get the resource path attribute on this script element
  y = scriptElm.getAttribute('data-resources-url');

  if (y) {
    // the script element has a data-resources-url attribute, always use that
    resourcesUrl = y;
  }

  if (!resourcesUrl && scriptElm.src) {
    // we don't have an exact resourcesUrl, so let's
    // figure it out relative to this script's src and app's filesystem namespace
    y = scriptElm.src.split('/').slice(0, -1);
    resourcesUrl = (y.join('/')) + (y.length ? '/' : '') + fsNamespace + '/';
  }

  // request the core this browser needs
  // test for native support of custom elements and fetch
  // if either of those are not supported, then use the core w/ polyfills
  // also check if the page was build with ssr or not
  x = doc.createElement('script');
  if (usePolyfills(win, win.location, x, 'import("")')) {
      x.src = resourcesUrl + appCorePolyfilled;
  } else {
      x.src = resourcesUrl + appCore;
      x.setAttribute('type', 'module');
      x.setAttribute('crossorigin', true);
  }
  x.setAttribute('data-resources-url', resourcesUrl);
  x.setAttribute('data-namespace', fsNamespace);
  doc.head.appendChild(x);
}


export function usePolyfills(win: any, location: Location, scriptElm: HTMLScriptElement, dynamicImportTest: string) {
  // fyi, dev mode has verbose if/return statements
  // but it minifies to a nice 'lil one-liner ;)

  if (location.search.indexOf('core=esm') > 0) {
    // force es2015 build
    return false;
  }

  if (
      (location.search.indexOf('core=es5') > 0) ||
      (location.protocol === 'file:') ||
      (!win.customElements) ||
      (!win.fetch) ||
      (!(win.CSS && win.CSS.supports && win.CSS.supports('color', 'var(--c)'))) ||
      (!('noModule' in scriptElm))
    ) {
    // force es5 build w/ polyfills
    return true;
  }

  return doesNotSupportsDynamicImports(dynamicImportTest);
}


function doesNotSupportsDynamicImports(dynamicImportTest: string) {
  try {
    new Function(dynamicImportTest);
    return false;
  } catch (e) {}
  return true;
}
