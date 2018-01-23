import { LoadComponentRegistry } from '../declarations';


export function init(
  win: any,
  doc: HTMLDocument,
  appNamespace: string,
  urlNamespace: string,
  publicPath: string,
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
    x.setAttribute('data-visibility', '');
    doc.head.insertBefore(x, doc.head.firstChild);
  }

  // get this current script
  // script tag cannot use "async" attribute
  x = doc.scripts[doc.scripts.length - 1];
  if (x && x.src) {
    y = x.src.split('/').slice(0, -1);
    publicPath = (y.join('/')) + (y.length ? '/' : '') + urlNamespace + '/';
  }

  // request the core this browser needs
  // test for native support of custom elements and fetch
  // if either of those are not supported, then use the core w/ polyfills
  // also check if the page was build with ssr or not
  x = doc.createElement('script');
  x.src = publicPath + ((supportsCustomElements(win) && supportsEsModules(x) && supportsFetch(win) && supportsCssVariables(win)) ? appCore : appCorePolyfilled);
  x.setAttribute('data-path', publicPath);
  x.setAttribute('data-namespace', urlNamespace);
  doc.head.appendChild(x);
}

export function supportsEsModules(scriptElm: HTMLScriptElement) {
  // detect static ES module support
  const staticModule = 'noModule' in scriptElm;
  if (!staticModule) {
    return false;
  }
  // detect dynamic import support
  try {
    new Function('import("")');
    return true;
  } catch (err) {
    return false;
  }
}

export function supportsCustomElements(win: Window) {
  return win.customElements;
}

export function supportsFetch(win: Window) {
  return win.fetch;
}

export function supportsCssVariables(win: any) {
  return (win.CSS && win.CSS.supports && win.CSS.supports('color', 'var(--c)'));
}
