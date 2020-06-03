import { Config } from '../../internal';

export const config: Config = {
  namespace: 'HelloWorld',
  outputTargets: [
    { type: 'dist' },
    { type: 'dist-custom-elements-bundle' },
    { type: 'dist-hydrate-script' },
    {
      type: 'www',
      serviceWorker: null,
      baseUrl: 'https://helloworld.stencil.js.com/',
    },
  ],
  enableCache: false,
  hydratedFlag: null,
  hashFileNames: false,
  extras: {
    cssVarsShim: false,
    dynamicImportShim: false,
    safari10: false,
    scriptDataOpts: false,
    shadowDomShim: false,
  },
};
