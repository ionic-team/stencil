import type { Config } from '../../internal';

export const config: Config = {
  namespace: 'AsyngGlobalEndToEnd',
  srcDir: 'async-global/src',
  tsconfig: './tsconfig.globalAsync.json',
  globalScript: './async-global/globalAsync.ts',
  outputTargets: [
    {
      type: 'dist-custom-elements',
    },
  ],
  testing: {
    roots: ['./async-global'],
  },
};
