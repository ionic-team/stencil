import { Config } from '../../internal';
import { sass } from '@stencil/sass';

export const config: Config = {

  hashFileNames: false,

  outputTargets: [
    {
      type: 'www',
      serviceWorker: null
    },
    {
      type: 'dist-custom-element',
      dir: 'www/dist-module',
      copy: [
        {
          src: 'custom-elements.html',
          dest: '../custom-elements.html',
          warn: true
        }
      ]
    }
  ],
  globalScript: 'src/global.ts',
  enableCache: false,
  plugins: [
    sass()
  ]

};