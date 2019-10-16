import { Config } from '../../dist';

export const config: Config = {
  namespace: 'HelloWorld',
  outputTargets: [
    // { type: 'dist' },
    {
      type: 'dist-custom-elements',
      dir: 'www'
    },
    // {
    //   type: 'www',
    //   serviceWorker: null,
    //   copy: [
    //     {
    //       src: 'index-module.html',
    //       dest: 'index-module.html'
    //     }
    //   ]
    // }
  ],
  enableCache: false
};