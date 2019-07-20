
export const loadDeps = async (resolveLookup: Map<string, string>, fs: Map<string, string>) => {
  resolveLookup.set('@stencil/core/internal/client', '/@stencil/core/internal/client/index.mjs');
  resolveLookup.set('@stencil/core/internal/client/build-conditionals', '/@stencil/core/internal/client/build-conditionals.mjs');

  await loadDep('/@stencil/core/compiler/stencil.js');

  const deps = Promise.all(stencil.dependencies.map((dep: any) => {
    return loadDep(dep.url);
  }));

  const fetchResults = await Promise.all([
    await fetch('/@stencil/core/internal/client/index.mjs'),
    await fetch('/@stencil/core/internal/client/build-conditionals.mjs'),
    await fetch('/@stencil/core/internal/client/css-shim.mjs'),
    await fetch('/@stencil/core/internal/client/dom.mjs'),
    await fetch('/@stencil/core/internal/client/shadow-css.mjs'),
  ]);

  await Promise.all(fetchResults.map(async r => {
    const file = (new URL(r.url)).pathname;
    const code = await r.text();
    fs.set(file, code);
  }));

  await deps;
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
