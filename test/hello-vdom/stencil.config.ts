import { Config } from '../../dist';

export const config: Config = {

  hashFileNames: false,

  outputTargets: [
    {
      type: 'www',
      serviceWorker: null
    }
  ],

  enableCache: false,

  devServer: {
    logRequests: true
  }

};