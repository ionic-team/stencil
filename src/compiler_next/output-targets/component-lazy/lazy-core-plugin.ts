import * as d from '../../../declarations';
import { LAZY_BROWSER_ENTRY_ID, LAZY_EXTERNAL_ENTRY_ID, STENCIL_INTERNAL_ID } from '../../bundle/entry-alias-ids';
import { Plugin } from 'rollup';


export const lazyCorePlugin = (_config: d.Config, _buildCtx: d.BuildCtx): Plugin => {
  const lazyBundles: d.LazyBundlesRuntimeData = [];
  const lazyBundlesStr = JSON.stringify(lazyBundles);

  return {
    name: 'lazyCorePlugin',

    resolveId(importee) {
      if (importee === LAZY_BROWSER_ENTRY_ID || importee === LAZY_EXTERNAL_ENTRY_ID) {
        return importee;
      }
      return null;
    },

    load(id) {
      if (id === LAZY_BROWSER_ENTRY_ID) {
        return LAZY_BROWSER_ENTRY.replace(LAZY_BUNDLES_PLACEHOLDER, lazyBundlesStr);
      }
      if (id === LAZY_EXTERNAL_ENTRY_ID) {
        return LAZY_EXTERNAL_ENTRY.replace(LAZY_BUNDLES_PLACEHOLDER, lazyBundlesStr);
      }
      return null;
    }
  };
};

const LAZY_BUNDLES_PLACEHOLDER = `[/*!__STENCIL_LAZY_DATA__*/]`;


const LAZY_BROWSER_ENTRY = `
import { bootstrapLazy, globalScripts, patchBrowser } from '${STENCIL_INTERNAL_ID}';

patchBrowser().then(options => {
  globalScripts();
  return bootstrapLazy(${LAZY_BUNDLES_PLACEHOLDER}, options);
});
`;


const LAZY_EXTERNAL_ENTRY = `
import { bootstrapLazy, globalScripts, patchEsm } from '${STENCIL_INTERNAL_ID}';

export const defineCustomElements = (win, options) => patchEsm().then(() => {
  globalScripts();
  bootstrapLazy(${LAZY_BUNDLES_PLACEHOLDER}, options);
});
`;
