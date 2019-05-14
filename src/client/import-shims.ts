import { NAMESPACE } from '@build-conditionals';
import { doc, win } from './client-window';
import { getDynamicImportFunction } from '@utils';

export const patchEsm = () => {
  // @ts-ignore
  if (!(win.CSS && win.CSS.supports && win.CSS.supports('color', 'var(--c)'))) {
    // @ts-ignore
    return import('./polyfills/css-shim.js');
  }
  return Promise.resolve();
};

export const patchBrowser = async () => {
  // @ts-ignore
  const importMeta = import.meta.url;
  if (importMeta !== '') {
    return Promise.resolve(new URL('.', importMeta).pathname);
  } else {
    const allScripts = Array.from(doc.querySelectorAll('script'));
    const scriptElm = (
      allScripts.find(s => s.hasAttribute(DATA_RESOURCES_URL)) ||
      allScripts.find(s => s.src.includes(`/${NAMESPACE}.esm.js`))
    );

    const resourcesUrl = new URL('.', new URL(scriptElm.getAttribute(DATA_RESOURCES_URL) || scriptElm.src, doc.baseURI));
    patchDynamicImport(resourcesUrl.href);

    if (!window.customElements) {
      // @ts-ignore
      await import('./polyfills/dom.js');
    }
    return resourcesUrl.pathname;
  }
};

export const patchDynamicImport = (base: string) => {
  const importFunctionName = getDynamicImportFunction(NAMESPACE);
  try {
    (win as any)[importFunctionName] = new Function('w', 'return import(w);');
  } catch (e) {
    const moduleMap = new Map<string, any>();
    (win as any)[importFunctionName] = (src: string) => {
      const url = new URL(src, base).href;
      let mod = moduleMap.get(url);
      if (!mod) {
        const script = doc.createElement('script');
        script.type = 'module';
        script.src = URL.createObjectURL(new Blob([`import * as m from '${url}'; window.${importFunctionName}.m = m;`], { type: 'application/javascript' }))
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

const DATA_RESOURCES_URL = 'data-resources-url';
