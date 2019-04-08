import * as d from '../declarations';
import { BUILD } from '@build-conditionals';
import { consoleError } from './client-log';
import { supportsShadowDom } from './client-window';


export const loadModule = (cmpMeta: d.ComponentRuntimeMeta, hostRef: d.HostRef, hmrVersionId?: string): Promise<d.ComponentConstructor> => {
  // loadModuleImport
  const bundleId = (BUILD.mode && typeof cmpMeta.$lazyBundleIds$ !== 'string')
    ? cmpMeta.$lazyBundleIds$[hostRef.$modeName$]
    : cmpMeta.$lazyBundleIds$;

  const url = `./${
    BUILD.shadowDom
      ? bundleId + (!supportsShadowDom ? '.sc' : '')
      : bundleId
    }.entry.js${BUILD.hotModuleReplacement && hmrVersionId ? '?s-hmr=' + hmrVersionId : ''}`;

  // TODO: replace once rollup is fixed
  return /*!STENCIL:LOAD_MODULE_IMPORT*/ import(
    url
  ).then(importedModule => importedModule[cmpMeta.$tagName$.replace(/-/g, '_')], consoleError);
};
