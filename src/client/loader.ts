import { LoadComponentRegistry } from '../util/interfaces';


export function init(win: any, doc: HTMLDocument, appNamespace: string, publicPath: string, appCore: string, appCoreSsr: string, appCorePolyfilled: string, components: LoadComponentRegistry[], x?: any, y?: any) {
  // create global namespace if it doesn't already exist
  (win[appNamespace] = win[appNamespace] || {}).components = components;

  y = components.filter(function(c) { return c[2]; }).map(function(c) { return c[0]; });
  if (y.length) {
    // auto hide components until they been fully hydrated
    // reusing the "x" and "i" variables from the args for funzies
    x = doc.createElement('style');
    x.innerHTML = y.join() + '{visibility:hidden}';
    x.setAttribute('data-visibility', '');
    doc.head.insertBefore(x, doc.head.firstChild);
  }

  // get this current script
  // script tag cannot use "async" attribute
  appNamespace = appNamespace.toLowerCase();
  x = doc.scripts[doc.scripts.length - 1];
  if (x && x.src) {
    y = x.src.split('/').slice(0, -1);
    publicPath = (y.join('/')) + (y.length ? '/' : '') + appNamespace + '/';
  }

  // request the core this browser needs
  // test for native support of custom elements and fetch
  // if either of those are not supported, then use the core w/ polyfills
  // also check if the page was build with ssr or not
  x = doc.createElement('script');
  x.src = publicPath + ((supportsCustomElements(x) && supportsEsModules(win) && supportsFetch(win) && supportsCssVariables(win)) ? (requiresSsrClient(doc) ? appCoreSsr : appCore) : appCorePolyfilled);
  x.setAttribute('data-path', publicPath);
  x.setAttribute('data-namespace', appNamespace);
  doc.head.appendChild(x);
}

export function supportsCustomElements(scriptElm: HTMLScriptElement) {
  return 'noModule' in scriptElm;
}

export function supportsEsModules(win: Window) {
  return win.customElements;
}

export function supportsFetch(win: Window) {
  return win.fetch;
}

export function supportsCssVariables(win: any) {
  return (win.CSS && win.CSS.supports && win.CSS.supports('color', 'var(--c)'));
}

export function requiresSsrClient(doc: HTMLDocument) {
  return doc.documentElement.hasAttribute('data-ssr');
}
