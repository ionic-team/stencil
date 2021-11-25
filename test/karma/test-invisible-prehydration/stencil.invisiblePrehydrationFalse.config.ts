import { Config } from '../../../dist/declarations';
const { WWW_OUT_DIR } = require('../constants');

export const config: Config = {
  namespace: 'TestInvisibleFalsePrehydration',
  tsconfig: 'tsconfig.json',
  invisiblePrehydration: false,
  outputTargets: [
    {
      type: 'www',
      dir: `../${WWW_OUT_DIR}`,
      empty: false,
      indexHtml: 'prehydrated-styles.html',
      serviceWorker: null,
    },
  ],
};
