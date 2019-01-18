import * as d from '@declarations';
import { BUILD } from '@stencil/core/build-conditionals';
import { consoleError } from './client-log';
import { dashToPascalCase } from '@stencil/core/utils';
import { plt } from './client-data';


export const loadModule = (elm: d.HostElement, bundleIds: d.ModeBundleId, hmrVersionId?: string) => {
  // loadModuleImport
  const bundleId = (BUILD.mode && typeof bundleIds !== 'string')
    ? (bundleIds as d.BundleIds)[elm.mode]
    : bundleIds;

  const useScopedCss = (BUILD.shadowDom && !plt.supportsShadowDom);
  const url = `./${BUILD.appNamespaceLower}/${bundleId + (useScopedCss ? '.sc' : '')}.entry.js${BUILD.hotModuleReplacement && hmrVersionId ? '?s-hmr=' + hmrVersionId : ''}`;

  return __import(
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackMode: "lazy" */
    url
  ).then(importedModule => importedModule[dashToPascalCase(elm.nodeName)], consoleError);
};

declare var __import: (url: string) => Promise<any>;
