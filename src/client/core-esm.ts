import * as d from '../declarations';
import { createComponentOnReadyPrototype } from './loader';
import { createPlatformMain } from './platform-main';
import { parseComponentLoader } from '../util/data-parse';
import { dashToPascalCase } from '../util/helpers';


declare const appGlobal: Function;
declare const applyPolyfills: Function;
const pltMap: { [namespace: string]: d.PlatformApi } = {};
let initCmpOnReady = false;

export { h } from '../renderer/vdom/h';


export function defineCustomElement(win: Window, cmpData: d.ComponentHostData | d.ComponentHostData[], opts: CustomElementsDefineOptions = {}) {
  const cmpDataArray = (Array.isArray(cmpData) ? cmpData : [cmpData]) as d.ComponentHostData[];
  const doc = win.document;
  const hydratedCssClass = opts.hydratedCssClass || '__APP__HYDRATED__CSS__PLACEHOLDER__';

  const styleCmps = cmpDataArray.filter(([hasStyles]) => hasStyles).map(c => c[0]);
  if (styleCmps.length > 0) {
    // auto hide components until they been fully hydrated
    // reusing the "x" and "i" variables from the args for funzies
    const styleElm = doc.createElement('style');
    styleElm.innerHTML = styleCmps.join() + '{visibility:hidden}.' + hydratedCssClass + '{visibility:inherit}';
    styleElm.setAttribute('data-styles', '');
    doc.head.insertBefore(styleElm, doc.head.firstChild);
  }

  const namespace = opts.namespace || '__APP__NAMESPACE__PLACEHOLDER__';

  if (!initCmpOnReady) {
    initCmpOnReady = true;
    createComponentOnReadyPrototype(win, namespace, (win as any).HTMLElement.prototype);
  }

  return new Promise(resolve => {

    applyPolyfills(win, () => {

      if (!pltMap[namespace]) {
        const Context: d.CoreContext = {};
        const resourcesUrl = opts.resourcesUrl || './';

        appGlobal(namespace, Context, win, doc, resourcesUrl, hydratedCssClass);

        // create a platform for this namespace
        pltMap[namespace] = createPlatformMain(
          namespace,
          Context,
          win,
          doc,
          resourcesUrl,
          hydratedCssClass
        );
      }

      // polyfills have been applied if need be
      (cmpData as d.ComponentHostData[]).forEach(c => {
        let HostElementConstructor: any;

        if (isNative(win.customElements.define)) {
          // native custom elements supported
          const createHostConstructor = new Function('w', 'return class extends w.HTMLElement{}');
          HostElementConstructor = createHostConstructor(win);

        } else {
          // using polyfilled custom elements
          HostElementConstructor = function(self: any) {
            return (win as any).HTMLElement.call(this, self);
          };

          HostElementConstructor.prototype = Object.create(
            (win as any).HTMLElement.prototype,
            { constructor: { value: HostElementConstructor, configurable: true } }
          );
        }

        // convert the static constructor data to cmp metadata
        // define the component as a custom element
        pltMap[namespace].defineComponent(
          buildComponentLoader(c),
          HostElementConstructor
        );
      });

      resolve();
    });
  });
}

function buildComponentLoader(c: d.ComponentHostData) {
  const meta = parseComponentLoader(c);
  const bundleIds = meta.bundleIds as string | d.BundleIds;
  const className = dashToPascalCase(c[0]);
  (meta.bundleIds as d.GetModuleFn) = ({mode, scoped}) => {
    if (typeof bundleIds === 'string') {
      return loadBundle(bundleIds, scoped, className);
    } else {
      return loadBundle(bundleIds[mode], scoped, className);
    }
  };
  return meta;
}

function loadBundle(bundleId: string, useScopedCss: boolean, className: string) {
  return import(
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./build/${bundleId}${(useScopedCss ? '.sc' : '')}.entry.js`
  ).then(m => m[className]);
}

function isNative(fn: Function) {
  return (/\{\s*\[native code\]\s*\}/).test('' + fn);
}


export interface CustomElementsDefineOptions {
  hydratedCssClass?: string;
  namespace?: string;
  resourcesUrl?: string;
}
