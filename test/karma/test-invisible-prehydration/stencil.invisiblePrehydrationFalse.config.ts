import { Config } from '../../../dist/declarations';

export const config: Config = {
  namespace: 'TestInvisibleFalsePrehydration',
  tsconfig: 'tsconfig.json',
  invisiblePrehydration: false,
  outputTargets: [
    {
      type: 'www',
      dir: '../www',
      empty: false,
      indexHtml: 'prehydrated-styles.html',
      serviceWorker: null,
    },
    {
      type: 'www',
      empty: false,
      indexHtml: 'prehydrated-styles.html',
      serviceWorker: null,
    },
  ],
};
