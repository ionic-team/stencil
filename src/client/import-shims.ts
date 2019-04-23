import { NAMESPACE } from '@build-conditionals';
import { doc, win } from './client-window';
import { getDynamicImportFunction } from '@utils';

export const patchBrowser = async () => {
  const scriptElm = Array.from(doc.querySelectorAll('script')).find(a => a.src.includes(NAMESPACE));
  const resourcesUrl = new URL('.', new URL(scriptElm ? scriptElm.src : '', doc.baseURI));
  patchDynamicImport(resourcesUrl.href);

  if (!window.customElements) {
    // @ts-ignore
    await import('./polyfills/dom.js');
  }
  return resourcesUrl.pathname;
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
        script.src = URL.createObjectURL(new Blob([`import * as m from '${url}'; window[${importFunctionName}].m = m;`], { type: 'application/javascript' }))
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
