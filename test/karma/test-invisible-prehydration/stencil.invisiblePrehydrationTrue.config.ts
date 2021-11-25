import { Config } from '../../../dist/declarations';
const { WWW_OUT_DIR } = require('../constants');

export const config: Config = {
  namespace: 'TestInvisibleTruePrehydration',
  tsconfig: 'tsconfig.json',
  invisiblePrehydration: true,
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
