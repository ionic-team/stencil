import * as d from '../../declarations';
import { fetchModuleAsync } from '../sys/fetch/fetch-module-async';
import { getStencilModuleUrl, packageVersions } from '../sys/fetch/fetch-utils';
import { isRemoteUrlCompiler } from '../sys/resolve/resolve-utils';
import { normalizePath } from '@utils';
import { STENCIL_INTERNAL_CLIENT_ID, STENCIL_INTERNAL_HYDRATE_ID, STENCIL_INTERNAL_PLATFORM_ID, STENCIL_INTERNAL_RUNTIME_ID } from './entry-alias-ids';
import path from 'path';
import { Plugin } from 'rollup';


export const coreResolvePlugin = (config: d.Config, compilerCtx: d.CompilerCtx, platform: 'client' | 'hydrate'): Plugin => {
  const compilerExe = config.sys_next.getCompilerExecutingPath();
  const internalClient = getStencilInternalModule(config.rootDir, compilerExe, 'client');
  const internalHydrate = getStencilInternalModule(config.rootDir, compilerExe, 'hydrate');
  const internalRuntime = getStencilInternalModule(config.rootDir, compilerExe, 'runtime');

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
    },

    load(filePath) {
      if (filePath === internalClient || filePath === internalHydrate || filePath === internalRuntime) {
        if (isRemoteUrlCompiler(compilerExe)) {
          const url = getStencilModuleUrl(compilerExe, filePath);
          return fetchModuleAsync(compilerCtx.fs, packageVersions, url, filePath);
        }
      }
      return null;
    },

    resolveImportMeta(prop, { format }) {
      if (prop === 'url' && format === 'es') {
        return '""';
      }
      return null;
    }
  };
};

export const getStencilInternalModule = (rootDir: string, compilerExe: string, internalModule: string) => {
  if (isRemoteUrlCompiler(compilerExe)) {
    return normalizePath(path.join(rootDir, 'node_modules', '@stencil', 'core', 'internal', internalModule, 'index.mjs'));
  }

  const compilerExeDir = path.dirname(compilerExe);
  return normalizePath(path.join(compilerExeDir, '..', 'internal', internalModule, 'index.mjs'));
};
