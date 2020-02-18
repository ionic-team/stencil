import { Config } from '../../dist';

export const config: Config = {
  namespace: 'my-counter',
  hashFileNames: false,
  outputTargets: [
    {
      type: 'www',
      serviceWorker: null // disable service workers
    }
  ],
  hydratedFlag: null,
  extras: {
    cssVarsShim: false,
    dynamicImportShim: false,
    safari10: false,
    scriptDataOpts: false,
    shadowDomShim: false,
  }
};
