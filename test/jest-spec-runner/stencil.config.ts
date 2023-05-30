import { Config } from '../../internal';

export const config: Config = {
  outputTargets: [
    {
      type: 'dist-custom-elements',
    },
  ],
  hashFileNames: false,
  hydratedFlag: null,
  extras: {
    cssVarsShim: false,
    scriptDataOpts: false,
    shadowDomShim: false,
  },
};
