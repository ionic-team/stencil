import { Config } from '../../dist';

export const config: Config = {
  globalStyle: 'src/global/app.css',
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
};