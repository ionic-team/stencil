import { Config } from '../../dist';

export const config: Config = {
  namespace: 'app',
  minifyJs: false,
  outputTargets: [
    {
      type: 'www',
      serviceWorker: null,
    }
  ]
};