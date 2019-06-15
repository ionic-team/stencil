import { Config } from '../../dist';

export const config: Config = {
  namespace: 'BrowserCompiler',

  plugins: [
  ],

  outputTargets: [
    {
      type: 'www',
      serviceWorker: null,
      copy: [
        {
          src: '../../../dist/sys/browser',
          dest: './compiler',
          warn: true
        }
      ]
    }
  ],
  enableCache: false

};