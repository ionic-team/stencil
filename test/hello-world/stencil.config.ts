import { Config } from '../../dist';

export const config: Config = {
  namespace: 'HelloWorld',
  hashFileNames: false,
  outputTargets: [
    {
      type: 'www',
      serviceWorker: null,
      prerenderConfig: 'prerender.config.js'
    },
    { type: 'dist-collection' },
    { type: 'dist-lazy' },
    {
      type: 'dist-module',
      file: 'www/web-components.js'
    },
    {
      type: 'angular',
      serverModuleFile: 'dist/server/helloworld-serve.ts'
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