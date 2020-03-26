import * as d from '../../../declarations';
import { dependencies, getRemoteTypeScriptUrl } from '../dependencies';
import { httpFetch } from './fetch-utils';
import { IS_FETCH_ENV, IS_WEB_WORKER_ENV } from '@utils';
import { join } from 'path';

export const fetchPreloadFs = async (config: d.Config, inMemoryFs: d.InMemoryFileSystem) => {
  if (IS_WEB_WORKER_ENV && IS_FETCH_ENV) {
    const preloadUrls = getCoreFetchPreloadUrls(config, config.sys.getCompilerExecutingPath());

    await Promise.all(
      preloadUrls.map(async preload => {
        try {
          const fileExists = await inMemoryFs.access(preload.filePath);
          if (!fileExists) {
            const rsp = await httpFetch(config.sys, preload.url);
            if (rsp && rsp.ok) {
              const content = await rsp.clone().text();
              await inMemoryFs.writeFile(preload.filePath, content);
            }
          }
        } catch (e) {
          config.logger.error(e);
        }
      }),
    );

    await inMemoryFs.commit();
  }
};

const getCoreFetchPreloadUrls = (config: d.Config, compilerUrl: string) => {
  const stencilCoreBase = new URL('..', compilerUrl);
  const stencilResourcePaths = dependencies.find(dep => dep.name === '@stencil/core').resources;
  const tsLibBase = new URL('..', getRemoteTypeScriptUrl(config.sys));
  const tsResourcePaths = dependencies.find(dep => dep.name === 'typescript').resources;

  return [
    ...stencilResourcePaths.map(p => {
      return {
        url: new URL(p, stencilCoreBase).href,
        filePath: join(config.rootDir, 'node_modules', '@stencil', 'core', p),
      };
    }),
    ...tsResourcePaths.map(p => {
      return {
        url: new URL(p, tsLibBase).href,
        filePath: join(config.rootDir, 'node_modules', 'typescript', p),
      };
    }),
  ];
};
