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
    return Promise.resolve(new URL('.', importMeta).href);
  } else {
    const scriptElm = Array.from(doc.querySelectorAll('script')).find(s => (
      s.src.includes(`/${NAMESPACE}.esm.js`) ||
      s.getAttribute('data-namespace') === NAMESPACE
    ));

    const resourcesUrl = new URL('.', new URL(scriptElm.getAttribute('data-resources-url') || scriptElm.src, win.location.href));
    patchDynamicImport(resourcesUrl.href);

    if (!window.customElements) {
      // @ts-ignore
      await import('./polyfills/dom.js');
    }
    return resourcesUrl.href;
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

