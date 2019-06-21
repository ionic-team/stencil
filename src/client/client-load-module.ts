import * as d from '../declarations';
import { BUILD } from '@build-conditionals';
import { consoleError } from './client-log';


export const loadModule = (cmpMeta: d.ComponentRuntimeMeta, hostRef: d.HostRef, hmrVersionId?: string): Promise<d.ComponentConstructor> => {
  // loadModuleImport
  const bundleId = (BUILD.mode && typeof cmpMeta.$lazyBundleIds$ !== 'string')
    ? cmpMeta.$lazyBundleIds$[hostRef.$modeName$]
    : cmpMeta.$lazyBundleIds$;

  return import(
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${bundleId}.entry.js${BUILD.hotModuleReplacement && hmrVersionId ? '?s-hmr=' + hmrVersionId : ''}`
  ).then(importedModule => importedModule[cmpMeta.$tagName$.replace(/-/g, '_')], consoleError);
};
