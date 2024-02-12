import { Config } from '../../../dist/declarations';
const { WWW_OUT_DIR } = require('../constants');

export const config: Config = {
  namespace: 'TestGlobalScript',
  tsconfig: 'tsconfig.json',
  outputTargets: [
    {
      type: 'www',
      dir: `../${WWW_OUT_DIR}`,
    },
  ],
  globalScript: 'src/global.ts',
};
