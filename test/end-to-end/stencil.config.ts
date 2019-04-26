import { Config } from '../../dist';
import builtins from 'rollup-plugin-node-builtins';

export const config: Config = {
  namespace: 'EndToEnd',

  plugins: [
    builtins()
  ],

  testing: {
  },
  outputTargets: [
    {
      type: 'www',
      serviceWorker: null
    },
    {
      type: 'dist',
    },
    {
      type: 'experimental-dist-module',
      externalRuntime: true
    }
  ],
  enableCache: false

};