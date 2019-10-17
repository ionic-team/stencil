import { Config } from '../../internal';

export const config: Config = {
  namespace: 'HelloWorld',
  outputTargets: [
    {
      type: 'www',
      serviceWorker: null,
      baseUrl: 'https://helloworld.stencil.js.com/'
    }
  ],
  enableCache: false
};