import { Config } from '../../dist';

export const config: Config = {

  globalStyle: 'src/global/app.css',

  hashFileNames: false,

  outputTargets: [
    {
      type: 'www',
      serviceWorker: null
    },
    {
      type: 'experimental-dist-module',
      externalRuntime: true
    }
  ],

  // devServer: null,

  enableCache: false

};