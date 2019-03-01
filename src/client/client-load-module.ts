import * as d from '@declarations';
import { BUILD } from '@build-conditionals';
import { consoleError } from './client-log';
import { supportsShadowDom } from './client-window';


export const loadModule = (cmpMeta: d.ComponentLazyRuntimeMeta, hostRef: d.HostRef, hmrVersionId?: string): Promise<d.ComponentConstructor> => {
  // loadModuleImport
  const bundleId = (BUILD.mode && typeof cmpMeta.$lazyBundleIds$ !== 'string')
    ? cmpMeta.$lazyBundleIds$[hostRef.$modeName$]
    : cmpMeta.$lazyBundleIds$;

  const url = `./${
    BUILD.shadowDom
      ? bundleId + (!supportsShadowDom ? '.sc' : '')
      : bundleId
    }.entry.js${BUILD.hotModuleReplacement && hmrVersionId ? '?s-hmr=' + hmrVersionId : ''}`;

  return import(
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackMode: "lazy" */
    url
  ).then(importedModule => importedModule[cmpMeta.t.replace(/-/g, '_')], consoleError);
};
