import { NAMESPACE } from '@build-conditionals';

export const patchBrowser = async () => {
  const scriptElm = Array.from(document.querySelectorAll('script')).find(a => a.src.includes(NAMESPACE));
  const resourcesUrl = new URL('.', new URL(scriptElm ? scriptElm.src : '', location.href));
  patchDynamicImport(resourcesUrl.href);

  if (!window.customElements) {
    // @ts-ignore
    await import('./polyfills/dom.js');
  }
  return resourcesUrl.pathname;
};

export const patchDynamicImport = (base: string) => {
  const win = window as any;
  // try {
  //   win.__stencil_import = new Function('return import(arguments[0]);');
  // } catch (e) {
    const moduleMap = new Map<string, any>();
    win.__stencil_import = (src: string) => {
      const url = new URL(src, base).href;
      let mod = moduleMap.get(url);
      if (!mod) {
        const doc = win.document as Document;
        const script = doc.createElement('script');
        script.type = 'module';
        script.src = URL.createObjectURL(new Blob([`import * as m from '${url}'; __stencil_import.m = m;`], { type: 'application/javascript' }))
        mod = new Promise(resolve => {
          script.onload = () => {
            resolve(win.__stencil_import.m);
            script.remove();
          };
        });
        moduleMap.set(url, mod);
        doc.head.appendChild(script);
      }
      return mod;
    };
  // }
};
