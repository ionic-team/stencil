import * as d from '../../../declarations';
import { CACHES } from '../fetch/fetch-cache';
import { getRemoteTypeScriptUrl } from '../dependencies';
import { HAS_FETCH_CACHE, IS_FETCH_ENV, IS_WEB_WORKER_ENV } from '@utils';
import { join } from 'path';


export const fetchPreloadFs = async (config: d.Config, inMemoryFs: d.InMemoryFileSystem) => {
  if (IS_WEB_WORKER_ENV && IS_FETCH_ENV) {
    const preloadUrls = getCoreFetchPreloadUrls(config, config.sys_next.getCompilerExecutingPath());

    const coreCache = HAS_FETCH_CACHE ? await caches.open(CACHES.core) : null;

    await Promise.all(preloadUrls.map(async preload => {
      try {
        const fileExists = await inMemoryFs.access(preload.filePath);
        if (!fileExists) {
          const content = await getCoreContent(coreCache, preload.url);
          await inMemoryFs.writeFile(preload.filePath, content);
        }

      } catch (e) {
        config.logger.error(e);
      }
    }));

    await inMemoryFs.commit();
  }
};

const getCoreContent = async (coreCache: Cache, url: string) => {
  if (coreCache) {
    const cachedRsp = await coreCache.match(url);
    if (cachedRsp) {
      return cachedRsp.text();
    }
  }

  const rsp = await fetch(url);
  if (rsp.ok && coreCache) {
    coreCache.put(url, rsp.clone());
  }
  return rsp.text();
};

const getCoreFetchPreloadUrls = (config: d.Config, compilerUrl: string) => {
  const stencilUrl = new URL('..', compilerUrl);
  const tsUrl = new URL('..', getRemoteTypeScriptUrl());
  return [
    ...stencilPreloadPaths.map(p => {
      return {
        url: new URL(p, stencilUrl).href,
        filePath: join(config.rootDir, 'node_modules', '@stencil', 'core', p),
      }
    }),
    ...tsPreloadPaths.map(p => {
      return {
        url: new URL(p, tsUrl).href,
        filePath: join(config.rootDir, 'node_modules', 'typescript', p),
      }
    }),
  ];
};

const stencilPreloadPaths = [
  'internal/index.d.ts',
  'internal/stencil-core.js',
  'internal/stencil-core.d.ts',
  'internal/stencil-ext-modules.d.ts',
  'internal/stencil-private.d.ts',
  'internal/stencil-public-compiler.d.ts',
  'internal/stencil-public-docs.d.ts',
  'internal/stencil-public-runtime.d.ts',
  'package.json',
];

const tsPreloadPaths = [
  'lib/lib.dom.d.ts',
  'lib/lib.es2015.d.ts',
  'lib/lib.es5.d.ts',
  'lib/lib.es2015.core.d.ts',
  'lib/lib.es2015.collection.d.ts',
  'lib/lib.es2015.generator.d.ts',
  'lib/lib.es2015.iterable.d.ts',
  'lib/lib.es2015.symbol.d.ts',
  'lib/lib.es2015.promise.d.ts',
  'lib/lib.es2015.proxy.d.ts',
  'lib/lib.es2015.reflect.d.ts',
  'lib/lib.es2015.symbol.wellknown.d.ts',
  'package.json',
];
