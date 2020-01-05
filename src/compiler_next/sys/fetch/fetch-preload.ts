import * as d from '../../../declarations';
import { CACHES } from '../fetch/fetch-cache';
import { getRemoteTypeScriptUrl } from '../dependencies';
import { HAS_FETCH_CACHE, IS_WEB_WORKER_ENV } from '../environment';


export const preloadInMemoryFsFromCache = async (config: d.Config, inMemoryFs: d.InMemoryFileSystem) => {
  if (IS_WEB_WORKER_ENV && HAS_FETCH_CACHE) {
    const preloadUrls = getCoreFetchPreloadUrls(config.sys_next.getCompilerExecutingPath());

    const coreCache = await caches.open(CACHES.core);

    await Promise.all(preloadUrls.map(async url => {
      try {
        const content = await getCoreContent(coreCache, url);
        await inMemoryFs.writeFile(url, content, { inMemoryOnly: true });

      } catch (e) {
        console.error(e);
      }
    }));
  }
};

const getCoreContent = async (coreCache: Cache, url: string) => {
  const cachedRsp = await coreCache.match(url);
  if (cachedRsp) {
    return cachedRsp.text();
  }
  const rsp = await fetch(url);
  if (rsp.ok) {
    coreCache.put(url, rsp.clone());
  }
  return rsp.text();
};

const getCoreFetchPreloadUrls = (compilerUrl: string) => {
  const stencilUrl = new URL('..', compilerUrl);
  const tsUrl = getRemoteTypeScriptUrl();
  return [
    ...stencilPreloadPaths.map(p => new URL(p, stencilUrl).href),
    ...tsPreloadPaths.map(p => new URL(p, tsUrl).href),
  ];
};

const stencilPreloadPaths = [
  'internal/index.d.ts',
  'internal/stencil-ext-modules.d.ts',
  'internal/stencil-private.d.ts',
  'internal/stencil-public-compiler.d.ts',
  'internal/stencil-public-docs.d.ts',
  'internal/stencil-public-runtime.d.ts',
  'internal/stencil-ext-modules.d.ts',
  'internal/stencil-public-docs.d.ts',
  'package.json',
];

const tsPreloadPaths = [
  'lib.dom.d.ts',
  'lib.es2015.d.ts',
  'lib.es5.d.ts',
  'lib.es2015.core.d.ts',
  'lib.es2015.collection.d.ts',
  'lib.es2015.generator.d.ts',
  'lib.es2015.iterable.d.ts',
  'lib.es2015.symbol.d.ts',
  'lib.es2015.promise.d.ts',
  'lib.es2015.proxy.d.ts',
  'lib.es2015.reflect.d.ts',
  'lib.es2015.symbol.wellknown.d.ts',
];
