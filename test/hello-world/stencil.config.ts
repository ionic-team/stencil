import { Config } from '../../dist';

export const config: Config = {

  namespace: 'HelloWorld',
  hashFileNames: false,
  outputTargets: [
    {
      type: 'www',
      serviceWorker: null
    },
    {
      type: 'dist'
    },
    {
      type: 'angular',
      serverModuleFile: 'dist/server/helloworld-serve.ts'
    }
  ],
  enableCache: false
};