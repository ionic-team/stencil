
export function patchDynamicImport(win: any) {
  try {
    win.__stencil_import = new Function('return import(arguments[0]);');
  } catch (e) {
    const moduleMap = new Map<string, any>();
    win.__stencil_import = (src: string) => {
      // @ts-ignore
      const url = new URL(src, import.meta.url).href;
      let mod = moduleMap.get(url);
      if (!mod) {
        const doc = win.document as Document;
        const script = doc.createElement('script');
        script.type = 'module';
        script.src = URL.createObjectURL(new Blob([`import * as m from '${url}'; __stencil_import.m = m;`], { type: 'application/javascript' }))
        mod = new Promise(resolve => {
          script.addEventListener('load', () => {
            resolve(win.__stencil_import.m);
            script.remove();
          });
        });
        moduleMap.set(url, mod);
        doc.head.appendChild(script);
      }
      return mod;
    };
  }
}
