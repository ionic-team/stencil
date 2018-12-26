import { Config } from '../../../dist';

export const config: Config = {

  hashFileNames: false,

  outputTargets: [
    {
      type: 'www',
      serviceWorker: null,
      empty: false
    },
    {
      type: 'webcomponent',
      dir: 'www/webcomponents'
    }
  ],

  devServer: null,

  enableCache: false

};