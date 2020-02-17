import { Config } from '../../internal';

export const config: Config = {
  namespace: 'HelloVDom',
  outputTargets: [{
    type: 'dist'
  }],
  devServer: {
    logRequests: true
  },
  hashFileNames: false,
  hydratedFlag: null,
  extras: {
    cssVarsShim: false,
    dynamicImportShim: false,
    safari10: false,
    scriptDataOpts: false,
    shadowDomShim: false,
  }
};