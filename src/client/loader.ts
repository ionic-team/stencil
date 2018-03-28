import * as d from '../declarations';


export function init(
  win: any,
  doc: HTMLDocument,
  namespace: string,
  fsNamespace: string,
  resourcesUrl: string,
  appCore: string,
  appCorePolyfilled: string,
  hydratedCssClass: string,
  components: d.LoadComponentRegistry[],
  HTMLElementPrototype: any,
  App?: d.AppGlobal,
  x?: any, y?: any, scriptElm?: HTMLScriptElement,
  orgComponentOnReady?: Function
) {
  // create global namespace if it doesn't already exist
  App = win[namespace] = win[namespace] || {};
  App.components = components;

  if (!win.customElements) {
    // temporary customElements polyfill only for "whenDefined"
    // this is incase customElements.whenDefined('my-tag') is
    // used before the polyfill is downloaded
    win.$whenDefined = [];
    win.customElements = {
      whenDefined: function(tag: string) {
        return {
          then: function(cb: Function) {
            win.$whenDefined.push([tag, cb]);
          }
        };
      }
    };
  }

  y = components.filter(function(c) { return c[2]; }).map(function(c) { return c[0]; });
  if (y.length) {
    // auto hide components until they been fully hydrated
    // reusing the "x" and "i" variables from the args for funzies
    x = doc.createElement('style');
    x.innerHTML = y.join() + '{visibility:hidden}.' + hydratedCssClass + '{visibility:inherit}';
    x.setAttribute('data-styles', '');
    doc.head.insertBefore(x, doc.head.firstChild);
  }

  // create a temporary array to store the resolves
  // before the core file has fully loaded
  App.$r = [];

  // add componentOnReady to HTMLElement.prototype
  orgComponentOnReady = HTMLElementPrototype.componentOnReady;
  HTMLElementPrototype.componentOnReady = function componentOnReady(cb?: () => void): any {
    const elm = this;

    // there may be more than one app on the window so
    // call original HTMLElement.prototype.componentOnReady
    // if one exists already
    orgComponentOnReady && orgComponentOnReady.call(elm);

    function executor(resolve: () => void) {
      if (App.$r) {
        // core file hasn't loaded yet
        // so let's throw it in this temporary queue
        // and when the core does load it'll handle these
        App.$r.push([elm, resolve]);

      } else {
        // core has finished loading because there's no temporary queue
        // call the core's logic to handle this
        App.componentOnReady(elm, resolve);
      }
    }

    if (cb) {
      // just a callback
      return executor(cb);
    }

    // callback wasn't provided, let's return a promise
    if (win.Promise) {
      // use native/polyfilled promise
      return new Promise(executor);
    }

    // promise may not have been polyfilled yet
    return { then: executor } as Promise<any>;
  };

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
    // requires the es5/polyfilled core
    x.src = resourcesUrl + appCorePolyfilled;

  } else {
    // let's do this!
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
    // force esm build
    return false;
  }

  if (
      (location.search.indexOf('core=es5') > 0) ||
      (location.protocol === 'file:') ||
      (!(win.customElements && win.customElements.define)) ||
      (!win.fetch) ||
      (!(win.CSS && win.CSS.supports && win.CSS.supports('color', 'var(--c)'))) ||
      (!('noModule' in scriptElm))
    ) {
    // es5 build w/ polyfills
    return true;
  }

  // final test to see if this browser support dynamic imports
  return doesNotSupportsDynamicImports(dynamicImportTest);
}


function doesNotSupportsDynamicImports(dynamicImportTest: string) {
  try {
    new Function(dynamicImportTest);
    return false;
  } catch (e) {}
  return true;
}
