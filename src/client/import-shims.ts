import * as d from '../declarations';
import { BUILD, NAMESPACE } from '@build-conditionals';
import { consoleDevInfo } from './client-log';
import { H, doc, plt, win } from './client-window';
import { getDynamicImportFunction } from '@utils';


export const patchEsm = () => {
  // @ts-ignore
  if (BUILD.cssVarShim && !(win.CSS && win.CSS.supports && win.CSS.supports('color', 'var(--c)'))) {
    // @ts-ignore
    return import('./polyfills/css-shim.js').then(() => {
      plt.$cssShim$ = (win as any).__stencil_cssshim;
      if (plt.$cssShim$) {
        return plt.$cssShim$.initShim();
      }
    });
  }
  return Promise.resolve();
};

export const patchBrowser = (): Promise<d.CustomElementsDefineOptions> => {
  // NOTE!! This fn cannot use async/await!
  if (BUILD.isDev) {
    consoleDevInfo('Stencil is running in the development mode.');
  }

  if (BUILD.cssVarShim) {
    // shim css vars
    plt.$cssShim$ = (win as any).__stencil_cssshim;
  }

  if (BUILD.cloneNodeFix) {
    // opted-in to polyfill cloneNode() for slot polyfilled components
    patchCloneNodeFix((H as any).prototype);
  }

  if (BUILD.profile && !performance.mark) {
    // not all browsers support performance.mark/measure (Safari 10)
    performance.mark = performance.measure = () => {/*noop*/};
    performance.getEntriesByName = () => [];
  }

  // @ts-ignore
  const scriptElm = Array.from(doc.querySelectorAll('script')).find(s => (
    new RegExp(`\/${NAMESPACE}(\\.esm)?\\.js($|\\?|#)`).test(s.src) ||
    s.getAttribute('data-stencil-namespace') === NAMESPACE
  ));
  const opts = (scriptElm as any)['data-opts'] || {};
  const importMeta = import.meta.url;

  if ('onbeforeload' in scriptElm && !history.scrollRestoration /* IS_ESM_BUILD */) {
    // Safari < v11 support: This IF is true if it's Safari below v11.
    // This fn cannot use async/await since Safari didn't support it until v11,
    // however, Safari 10 did support modules. Safari 10 also didn't support "nomodule",
    // so both the ESM file and nomodule file would get downloaded. Only Safari
    // has 'onbeforeload' in the script, and "history.scrollRestoration" was added
    // to Safari in v11. Return a noop then() so the async/await ESM code doesn't continue.
    // IS_ESM_BUILD is replaced at build time so this check doesn't happen in systemjs builds.
    return { then() {/* promise noop */} } as any;
  }

  if (importMeta !== '') {
    opts.resourcesUrl = new URL('.', importMeta).href;

  } else {
    opts.resourcesUrl = new URL('.', new URL(scriptElm.getAttribute('data-resources-url') || scriptElm.src, win.location.href)).href;
    patchDynamicImport(opts.resourcesUrl, scriptElm);

    if (!window.customElements) {
      // module support, but no custom elements support (Old Edge)
      // @ts-ignore
     return import('./polyfills/dom.js').then(() => opts);
    }
  }
  return Promise.resolve(opts);
};

export const patchDynamicImport = (base: string, orgScriptElm: HTMLScriptElement) => {
  const importFunctionName = getDynamicImportFunction(NAMESPACE);
  try {
    // test if this browser supports dynamic imports
    // There is a caching issue in V8, that breaks using import() in Function
    // By generating a random string, we can workaround it
    // Check https://bugs.chromium.org/p/v8/issues/detail?id=9558 for more info
    (win as any)[importFunctionName] = new Function('w', `return import(w);//${Math.random()}`);
  } catch (e) {
    // this shim is specifically for browsers that do support "esm" imports
    // however, they do NOT support "dynamic" imports
    // basically this code is for old Edge, v18 and below
    const moduleMap = new Map<string, any>();
    (win as any)[importFunctionName] = (src: string) => {
      const url = new URL(src, base).href;
      let mod = moduleMap.get(url);
      if (!mod) {
        const script = doc.createElement('script');
        script.type = 'module';
        script.crossOrigin = orgScriptElm.crossOrigin;
        script.src = URL.createObjectURL(new Blob([`import * as m from '${url}'; window.${importFunctionName}.m = m;`], { type: 'application/javascript' }));
        mod = new Promise(resolve => {
          script.onload = () => {
            resolve((win as any)[importFunctionName].m);
            script.remove();
          };
        });
        moduleMap.set(url, mod);
        doc.head.appendChild(script);
      }
      return mod;
    };
  }
};


export const patchCloneNodeFix = (HTMLElementPrototype: any) => {
  const nativeCloneNodeFn = HTMLElementPrototype.cloneNode;

  HTMLElementPrototype.cloneNode = function(this: Node, deep: boolean) {
    if (this.nodeName === 'TEMPLATE') {
      return nativeCloneNodeFn.call(this, deep);
    }
    const clonedNode = nativeCloneNodeFn.call(this, false);
    const srcChildNodes = this.childNodes;
    if (deep) {
      for (let i = 0; i < srcChildNodes.length; i++) {
        // Node.ATTRIBUTE_NODE === 2, and checking because IE11
        if (srcChildNodes[i].nodeType !== 2) {
          clonedNode.appendChild(
            srcChildNodes[i].cloneNode(true)
          );
        }
      }
    }
    return clonedNode;
  };
};
