
export const loadDeps = async (resolveLookup: Map<string, string>, fs: Map<string, string>) => {
  resolveLookup.set('@stencil/core/internal/client', '/@stencil/core/internal/client/index.mjs');
  resolveLookup.set('@stencil/core/internal/client/build-conditionals', '/@stencil/core/internal/client/build-conditionals.mjs');

  await loadDep('/@stencil/core/compiler/stencil.js');

  const deps = stencil.dependencies.map((dep: any) => {
    return loadDep(dep.url);
  });

  deps.push(
    loadDep('https://cdn.jsdelivr.net/npm/rollup@1.19.3/dist/rollup.browser.js'),
    loadDep('https://cdn.jsdelivr.net/npm/terser@4.1.3/dist/bundle.min.js')
  );

  const depPromises = Promise.all(deps);


  const fetchResults = await Promise.all([
    await fetch('/@stencil/core/internal/client/index.mjs'),
    await fetch('/@stencil/core/internal/client/build-conditionals.mjs'),
    await fetch('/@stencil/core/internal/client/css-shim.stencil-client.mjs'),
    await fetch('/@stencil/core/internal/client/dom.stencil-client.mjs'),
    await fetch('/@stencil/core/internal/client/shadow-css.stencil-client.mjs'),
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
    script.onerror = reject;
    script.src = url;
    document.head.appendChild(script);
  });
};

declare const stencil: any;
