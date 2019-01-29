import * as d from '@declarations';
import { BUILD } from '@build-conditionals';
import { consoleError } from './client-log';
import { dashToPascalCase } from '@utils';
import { plt } from './client-window';


export const loadModule = (elm: d.HostElement, bundleIds: d.ModeBundleId, hmrVersionId?: string) => {
  // loadModuleImport
  const bundleId = (BUILD.mode && typeof bundleIds !== 'string')
    ? (bundleIds as d.BundleIds)[elm.mode]
    : bundleIds;

  const useScopedCss = (BUILD.shadowDom && !plt.supportsShadowDom);
  const url = `./${bundleId + (useScopedCss ? '.sc' : '')}.entry.js${BUILD.hotModuleReplacement && hmrVersionId ? '?s-hmr=' + hmrVersionId : ''}`;

  return import(
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackMode: "lazy" */
    url
  ).then(importedModule => importedModule[dashToPascalCase(elm.nodeName)], consoleError);
};
