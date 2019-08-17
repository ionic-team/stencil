import { Config } from '../../dist';

export const config: Config = {
  namespace: 'HelloWorld',
  outputTargets: [
    {
      type: 'dist'
    },
    {
      type: 'experimental-dist-collection'
    },
    {
      type: 'experimental-dist-custom-element'
    },
    {
      type: 'www',
      serviceWorker: null,
      copy: [
        {
          src: 'index-module.html',
          dest: 'index-module.html'
        }
      ]
    }
  ],
  enableCache: false
};