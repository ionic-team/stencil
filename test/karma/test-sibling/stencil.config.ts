import { Config } from '../../../dist/declarations';

export const config: Config = {
  namespace: 'TestSibling',
  tsconfig: 'tsconfig.json',
  outputTargets: [
    {
      type: 'dist',
    },
  ],
  globalScript: 'src/global.ts',
};
