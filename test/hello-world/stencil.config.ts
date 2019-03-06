import { Config } from '../../dist';

export const config: Config = {
  namespace: 'HelloWorld',
  hashFileNames: false,
  outputTargets: [
    { type: 'dist' },
    {
      type: 'dist-module',
      dir: 'www'
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