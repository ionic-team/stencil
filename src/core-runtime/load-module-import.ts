import * as d from '../declarations';
import { consoleError } from './log';
import { dashToPascalCase } from '../util/helpers';
import { supportsShadowDom } from './data';


export const loadModuleImport = (elm: d.HostElement, bundleIds: d.ModeBundleId, hmrVersionId?: string) => {
  // loadModuleImport
  const bundleId = (BUILD.mode && typeof bundleIds !== 'string')
    ? (bundleIds as d.BundleIds)[elm.mode]
    : bundleIds;

  const useScopedCss = (BUILD.shadowDom && !supportsShadowDom);
  const url = `./${BUILD.appNamespaceLower}/${bundleId + (useScopedCss ? '.sc' : '')}.entry.js${BUILD.hotModuleReplacement && hmrVersionId ? '?s-hmr=' + hmrVersionId : ''}`;

  return __import(
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackMode: "lazy" */
    url
  ).then(importedModule => importedModule[dashToPascalCase(elm.nodeName)], consoleError);
};

declare var __import: (url: string) => Promise<any>;
