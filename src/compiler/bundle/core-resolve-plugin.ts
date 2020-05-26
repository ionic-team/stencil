import * as d from '../../declarations';
import { dirname, join } from 'path';
import { fetchModuleAsync } from '../sys/fetch/fetch-module-async';
import { getNodeModulePath } from '../sys/resolve/resolve-utils';
import { HYDRATED_CSS } from '../../runtime/runtime-constants';
import { isExternalUrl, getStencilModuleUrl, packageVersions } from '../sys/fetch/fetch-utils';
import { normalizePath, normalizeFsPath } from '@utils';
import { APP_DATA_CONDITIONAL, STENCIL_CORE_ID, STENCIL_INTERNAL_ID, STENCIL_INTERNAL_CLIENT_ID, STENCIL_INTERNAL_HYDRATE_ID } from './entry-alias-ids';
import { Plugin } from 'rollup';

export const coreResolvePlugin = (config: d.Config, compilerCtx: d.CompilerCtx, platform: 'client' | 'hydrate' | 'worker', externalRuntime: boolean): Plugin => {
  if (platform === 'worker') {
    return {
      name: 'coreResolvePlugin',
      resolveId(id) {
        if (id === STENCIL_CORE_ID || id === STENCIL_INTERNAL_CLIENT_ID || id === STENCIL_INTERNAL_HYDRATE_ID) {
          this.error(`${id} cannot be imported from a worker`);
        }
        return null;
      },
    };
  }
  const compilerExe = config.sys.getCompilerExecutingPath();
  const internalClient = getStencilInternalModule(config.rootDir, compilerExe, 'client');
  const internalHydrate = getStencilInternalModule(config.rootDir, compilerExe, 'hydrate');

  return {
    name: 'coreResolvePlugin',

    resolveId(id) {
      if (id === STENCIL_CORE_ID || id === STENCIL_INTERNAL_ID) {
        if (platform === 'client') {
          if (externalRuntime) {
            return {
              id: STENCIL_INTERNAL_CLIENT_ID,
              external: true,
            };
          }
          // adding ?app-data=conditional as an identifier to ensure we don't
          // use the default app-data, but build a custom one based on component meta
          return internalClient + APP_DATA_CONDITIONAL;
        }
        if (platform === 'hydrate') {
          return internalHydrate;
        }
      }
      if (id === STENCIL_INTERNAL_CLIENT_ID) {
        if (externalRuntime) {
          // not bunding the client runtime and the user's component together this
          // must be the custom elements build, where @stencil/core/internal/client
          // is an import, rather than bundling
          return {
            id: STENCIL_INTERNAL_CLIENT_ID,
            external: true,
          };
        }
        // importing @stencil/core/internal/client directly, so it shouldn't get
        // the custom app-data conditionals
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
          return fetchModuleAsync(config.sys, compilerCtx.fs, packageVersions, url, filePath);
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
      if (config.extras.dynamicImportShim && prop === 'url' && format === 'es') {
        return '""';
      }
      return null;
    },
  };
};

export const getStencilInternalModule = (rootDir: string, compilerExe: string, internalModule: string) => {
  if (isExternalUrl(compilerExe)) {
    return getNodeModulePath(rootDir, '@stencil', 'core', 'internal', internalModule, 'index.mjs');
  }

  const compilerExeDir = dirname(compilerExe);
  return normalizePath(join(compilerExeDir, '..', 'internal', internalModule, 'index.mjs'));
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

  const selector = h.selector === 'attribute' ? `[${h.name}]` : `.${h.name}`;

  if (!String(h.hydratedValue) || h.hydratedValue === '' || h.hydratedValue == null) {
    hydrated = '';
  } else {
    hydrated = `${selector}{${h.property}:${h.hydratedValue}}`;
  }

  return initial + hydrated;
};
