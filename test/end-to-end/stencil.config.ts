import { Config } from '../../internal';
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
      type: 'dist-custom-element'
    }
  ],
  enableCache: false

};