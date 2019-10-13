import * as d from '../../declarations';
import { getStencilModulePath, isRemoteUrlCompiler } from '../sys/resolve/resolve-utils';
import { STENCIL_INTERNAL_CLIENT_ID, STENCIL_INTERNAL_HYDRATE_ID, STENCIL_INTERNAL_PLATFORM_ID, STENCIL_INTERNAL_RUNTIME_ID } from './entry-alias-ids';
import path from 'path';
import { Plugin } from 'rollup';


export const coreResolvePlugin = (sys: d.CompilerSystem, platform: 'client' | 'hydrate'): Plugin => {
  const compilerExe = sys.getCompilerExecutingPath();
  const internalClient = getStencilInternalModule(compilerExe, 'client');
  const internalHydrate = getStencilInternalModule(compilerExe, 'hydrate');
  const internalRuntime = getStencilInternalModule(compilerExe, 'runtime');

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

export const getStencilInternalModule = (compilerExe: string, internalModule: string) => {
  if (isRemoteUrlCompiler(compilerExe)) {
    return getStencilModulePath(`internal/${internalModule}/index.mjs`);
  }

  const compilerExeDir = path.dirname(compilerExe);
  return path.join(compilerExeDir, '..', 'internal', internalModule, 'index.mjs');
};
