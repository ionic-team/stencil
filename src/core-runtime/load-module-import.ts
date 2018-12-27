import * as d from '../declarations';
import { dashToPascalCase } from '../util/helpers';
import { supportsShadowDom } from './data';
import { consoleError } from './log';
// import { initStyleTemplate } from '../core/styles';
// import * as perf from '../util/perf';
// import { queueUpdate } from '../core/queue-update';


export const loadModuleImport = (elm: d.HostElement, bundleIds: d.ModeBundleId, hmrVersionId?: string) => {
  // self loading module using built-in browser's import()
  // this is when not using a 3rd party bundler
  // and components are able to lazy load themselves
  // through standardized browser APIs
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
