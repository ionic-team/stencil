import * as d from '../../declarations';
import { STENCIL_INTERNAL_CLIENT_ID, STENCIL_INTERNAL_HYDRATE_ID, STENCIL_INTERNAL_PLATFORM_ID, STENCIL_INTERNAL_RUNTIME_ID } from './entry-alias-ids';
import path from 'path';
import { Plugin } from 'rollup';


export const coreResolvePlugin = (config: d.Config, platform: 'client' | 'hydrate'): Plugin => {
  const compilerExe = config.sys_next.getCompilerExecutingPath();
  const compilerExeDir = path.dirname(compilerExe);
  const internalDir = path.join(compilerExeDir, '..', 'internal');
  const internalClient = path.join(internalDir, 'client', 'index.mjs');
  const internalHydrate = path.join(internalDir, 'hydrate', 'index.mjs');
  const internalRuntime = path.join(internalDir, 'runtime', 'index.mjs');

  return {
    name: 'coreResolvePlugin',

    resolveId(id) {
      if (id === STENCIL_INTERNAL_PLATFORM_ID) {
        if (platform === 'client') {
          return internalClient;
        }
        if (platform === 'hydrate') {
          return internalHydrate;
        }
      }
      if (id === STENCIL_INTERNAL_CLIENT_ID) {
        return internalClient;
      }
      if (id === STENCIL_INTERNAL_HYDRATE_ID) {
        return internalHydrate;
      }
      if (id === STENCIL_INTERNAL_RUNTIME_ID) {
        return internalRuntime;
      }
      return null;
    }
  };
};
