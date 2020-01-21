
export const loadDeps = async (resolveLookup: Map<string, string>, fs: Map<string, string>) => {
  resolveLookup.set('@stencil/core/internal/client', '/@stencil/core/internal/client/index.mjs');
  resolveLookup.set('@stencil/core/internal/platform', '/@stencil/core/internal/client/index.mjs');
  resolveLookup.set('@stencil/core/internal/app-data', '/@stencil/core/internal/app-data/index.mjs');
  resolveLookup.set('@stencil/core/internal/runtime', '/@stencil/core/internal/runtime/index.mjs');

  await loadDep('/@stencil/core/compiler/stencil.js');

  const deps = stencil.dependencies.map((dep: any) => {
    return loadDep(`https://cdn.jsdelivr.net/npm/${dep.name}@${dep.version}${dep.main}`);
  });

  deps.push(
    loadDep('https://cdn.jsdelivr.net/npm/rollup@1.19.3/dist/rollup.browser.js'),
    loadDep('https://cdn.jsdelivr.net/npm/terser@4.1.3/dist/bundle.min.js')
  );

  const depPromises = Promise.all(deps);


  const fetchResults = await Promise.all([
    await fetch('/@stencil/core/internal/client/index.mjs'),
    await fetch('/@stencil/core/internal/app-data/index.mjs'),
    await fetch('/@stencil/core/internal/runtime/index.mjs'),
    await fetch('/@stencil/core/internal/runtime/shadow-css.mjs'),
    await fetch('/@stencil/core/internal/client/css-shim.mjs'),
    await fetch('/@stencil/core/internal/client/dom.mjs'),
  ]);

  await Promise.all(fetchResults.map(async r => {
    const file = (new URL(r.url)).pathname;
    const code = await r.text();
    fs.set(file, code);
  }));

  await depPromises;
}


const loadDep = (url: string) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.onload = () => {
      console.log('loaded dep:', url);
      setTimeout(resolve);
    };
    script.onerror = (e) => {
      console.log('error loading dep:', url);
      reject(e);
    };
    script.src = url;
    document.head.appendChild(script);
  });
};

declare const stencil: any;
