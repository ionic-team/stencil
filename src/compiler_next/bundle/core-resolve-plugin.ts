import * as d from '../../declarations';
import { fetchModuleAsync } from '../sys/fetch/fetch-module-async';
import { getStencilModuleUrl, packageVersions } from '../sys/fetch/fetch-utils';
import { HYDRATED_CSS } from '../../runtime/runtime-constants';
import { isExternalUrl } from '../sys/resolve/resolve-utils';
import { normalizePath, normalizeFsPath } from '@utils';
import { STENCIL_CORE_ID, STENCIL_INTERNAL_CLIENT_ID, STENCIL_INTERNAL_HYDRATE_ID } from './entry-alias-ids';
import path from 'path';
import { Plugin } from 'rollup';


export const coreResolvePlugin = (config: d.Config, compilerCtx: d.CompilerCtx, platform: 'client' | 'hydrate' | 'worker'): Plugin => {
  if (platform === 'worker') {
    return {
      name: 'coreResolvePlugin',
      resolveId(id) {
        if (
          id === STENCIL_CORE_ID ||
          id === STENCIL_INTERNAL_CLIENT_ID ||
          id === STENCIL_INTERNAL_HYDRATE_ID
        ) {
          this.error(`${id} cannot be imported from a worker`);
        }
        return null;
      },
    };
  }
  const compilerExe = config.sys_next.getCompilerExecutingPath();
  const internalClient = getStencilInternalModule(config.rootDir, compilerExe, 'client');
  const internalHydrate = getStencilInternalModule(config.rootDir, compilerExe, 'hydrate');

  return {
    name: 'coreResolvePlugin',

    resolveId(id) {
      if (id === STENCIL_CORE_ID) {
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
      return null;
    },

    async load(filePath) {
      if (filePath === internalClient || filePath === internalHydrate) {
        if (isExternalUrl(compilerExe)) {
          const url = getStencilModuleUrl(compilerExe, filePath);
          return fetchModuleAsync(compilerCtx.fs, packageVersions, url, filePath);
        }

        let code = await compilerCtx.fs.readFile(normalizeFsPath(filePath));
        const hydratedFlag = config.hydratedFlag;
        if (hydratedFlag) {
          const hydratedFlagHead = getHydratedFlagHead(hydratedFlag);
          if (HYDRATED_CSS !== hydratedFlagHead) {
            code = code.replace(HYDRATED_CSS, hydratedFlagHead);
            if (hydratedFlag.name !== 'hydrated') {
              code = code.replace(`.classList.add("hydrated")`, `.classList.add("${hydratedFlag.name}")`);
              code = code.replace(`.classList.add('hydrated')`, `.classList.add('${hydratedFlag.name}')`);
              code = code.replace(`.setAttribute("hydrated",`, `.setAttribute("${hydratedFlag.name}",`);
              code = code.replace(`.setAttribute('hydrated',`, `.setAttribute('${hydratedFlag.name}',`);
            }
          }
        } else {
          code = code.replace(HYDRATED_CSS, '{}');
        }
        return code;
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
  if (isExternalUrl(compilerExe)) {
    return normalizePath(path.join(rootDir, 'node_modules', '@stencil', 'core', 'internal', internalModule, 'index.mjs'));
  }

  const compilerExeDir = path.dirname(compilerExe);
  return normalizePath(path.join(compilerExeDir, '..', 'internal', internalModule, 'index.mjs'));
};

export const getHydratedFlagHead = (h: d.HydratedFlag) => {
  // {visibility:hidden}.hydrated{visibility:inherit}

  let initial: string;
  let hydrated: string;

  if (!String(h.initialValue) || h.initialValue === '' || h.initialValue == null) {
    initial = '';
  } else {
    initial = `{${h.property}:${h.initialValue}}`;
  }

  const selector = h.selector === 'attribute' ?
    `[${h.name}]` :
    `.${h.name}`

  if (!String(h.hydratedValue) || h.hydratedValue === '' || h.hydratedValue == null) {
    hydrated = '';
  } else {
    hydrated = `${selector}{${h.property}:${h.hydratedValue}}`;
  }

  return initial + hydrated;
};
