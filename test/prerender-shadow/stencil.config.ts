import { Config } from '../../dist';

export const config: Config = {

  hashFileNames: false,

  outputTargets: [
    {
      type: 'www',
      serviceWorker: null
    },
    {
      type: 'dist-hydrate-script',
      dir: 'dist/hydrate'
    }
  ],

  enableCache: false

};