import { Config } from '../../internal';

export const config: Config = {

  hashFileNames: false,
  outputTargets: [
    {
      type: 'dist-custom-element',
      dir: 'dist-custom'
    },
    {
      type: 'www',
      dir: 'www'
    }
  ],

  enableCache: false,

  devServer: {
    logRequests: true
  }

};