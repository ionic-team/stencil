import { Config } from '../../internal';

export const config: Config = {
  namespace: 'app',
  minifyJs: false,
  asyncQueue: false,
  outputTargets: [
    {
      type: 'www',
      serviceWorker: null,
    }
  ]
};