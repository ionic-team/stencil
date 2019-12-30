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

export const patchBrowser = async (): Promise<d.CustomElementsDefineOptions> => {
  if (BUILD.isDev) {
    consoleDevInfo('Stencil is running in the development mode.');
  }
  if (BUILD.cssVarShim) {
    plt.$cssShim$ = (win as any).__stencil_cssshim;
  }
  if (BUILD.cloneNodeFix) {
    patchCloneNodeFix((H as any).prototype);
  }

  // @ts-ignore
  const importMeta = import.meta.url;
  const regex = new RegExp(`\/${NAMESPACE}(\\.esm)?\\.js($|\\?|#)`);
  const scriptElm = Array.from(doc.querySelectorAll('script')).find(s => (
    regex.test(s.src) ||
    s.getAttribute('data-stencil-namespace') === NAMESPACE
  ));
  const opts = (scriptElm as any)['data-opts'];
  if (importMeta !== '') {
    return {
      ...opts,
      resourcesUrl: new URL('.', importMeta).href
    };
  } else {
    const resourcesUrl = new URL('.', new URL(scriptElm.getAttribute('data-resources-url') || scriptElm.src, win.location.href));
    patchDynamicImport(resourcesUrl.href, scriptElm);

    if (!window.customElements) {
      // @ts-ignore
      await import('./polyfills/dom.js');
    }
    return {
      ...opts,
      resourcesUrl: resourcesUrl.href,
    };
  }
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
