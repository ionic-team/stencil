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
    }
  ],
  globalScript: 'src/global/app.ts',
  enableCache: false
};