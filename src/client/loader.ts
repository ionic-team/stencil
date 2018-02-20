import { LoadComponentRegistry } from '../declarations';


export function init(
  win: any,
  doc: HTMLDocument,
  docScripts: HTMLScriptElement[],
  appNamespace: string,
  urlNamespace: string,
  publicPath: string,
  discoverPublicPath: boolean,
  appCore: string,
  appCorePolyfilled: string,
  hydratedCssClass: string,
  components: LoadComponentRegistry[], x?: any, y?: any
) {
  // create global namespace if it doesn't already exist
  (win[appNamespace] = win[appNamespace] || {}).components = components;

  y = components.filter(function(c) { return c[2]; }).map(function(c) { return c[0]; });
  if (y.length) {
    // auto hide components until they been fully hydrated
    // reusing the "x" and "i" variables from the args for funzies
    x = doc.createElement('style');
    x.innerHTML = y.join() + '{visibility:hidden}.' + hydratedCssClass + '{visibility:inherit}';
    x.setAttribute('data-styles', '');
    doc.head.insertBefore(x, doc.head.firstChild);
  }

  // get this current script
  // script tag cannot use "async" attribute
  if (discoverPublicPath) {
    x = docScripts[docScripts.length - 1];
    if (x && x.src) {
      y = x.src.split('/').slice(0, -1);
      publicPath = (y.join('/')) + (y.length ? '/' : '') + urlNamespace + '/';
    }
  }

  // request the core this browser needs
  // test for native support of custom elements and fetch
  // if either of those are not supported, then use the core w/ polyfills
  // also check if the page was build with ssr or not
  x = doc.createElement('script');
  x.src = publicPath + (usePolyfills(win as any, win.location, x, 'import("")') ? appCorePolyfilled : appCore);
  x.setAttribute('data-path', publicPath);
  x.setAttribute('data-namespace', urlNamespace);
  doc.head.appendChild(x);
}


export function usePolyfills(win: any, location: Location, scriptElm: HTMLScriptElement, dynamicImportTest: string) {
  // fyi, dev mode has verbose if/return statements
  // but it minifies to a nice 'lil one-liner ;)

  if (location.search.indexOf('core=es5') > -1) {
    // force es5 polyfill w/ ?core=es5 querystring
    return true;
  }

  if (location.protocol === 'file:') {
    // file protocol cannot use dynamic module imports
    return true;
  }

  if (!win.customElements) {
    // does not have customElement support
    return true;
  }

  if (!win.fetch) {
    // does not have fetch support
    return true;
  }

  if (!(win.CSS && win.CSS.supports && win.CSS.supports('color', 'var(--c)'))) {
    // does not have CSS variables support
    return true;
  }

  if (!('noModule' in scriptElm)) {
    // does not have static ES module support
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
