import { Config } from '../../dist';

export const config: Config = {
  namespace: 'HelloWorld',
  hashFileNames: false,
  outputTargets: [
    { type: 'dist-collection' },
    { type: 'dist-lazy' },
    {
      type: 'dist-module',
      file: 'www/web-components.js'
    },
    {
      type: 'www',
      serviceWorker: null
    }
  ],
  copy: [
    {
      src: 'index-module.html',
      dest: 'index-module.html'
    }
  ],
  enableCache: false
};