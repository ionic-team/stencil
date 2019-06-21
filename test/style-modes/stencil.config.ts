import { Config } from '../../dist';

export const config: Config = {

  hashFileNames: false,

  outputTargets: [
    {
      type: 'www',
      serviceWorker: null
    }
  ],
  globalScript: 'src/global.ts',
  enableCache: false

};