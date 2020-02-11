import { Config } from '../../internal';
import builtins from 'rollup-plugin-node-builtins';

export const config: Config = {
  namespace: 'EndToEnd',
  globalScript: './src/global.ts',
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
      type: 'experimental-dist-module'
    }
  ],
  enableCache: false

};