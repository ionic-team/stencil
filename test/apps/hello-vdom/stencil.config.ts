import { Config } from '../../../dist';

export const config: Config = {

  hashFileNames: false,

  outputTargets: [
    {
      type: 'www',
      serviceWorker: null
    }
  ],

  // devServer: null,

  enableCache: false

};