import { Config } from '../../dist';

export const config: Config = {
  namespace: 'HelloVDom',
  outputTargets: [{
    type: 'www',
    serviceWorker: null,
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