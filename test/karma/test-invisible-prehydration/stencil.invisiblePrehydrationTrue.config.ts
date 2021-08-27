import { Config } from '../../../dist/declarations';

export const config: Config = {
  namespace: 'TestPrehydratedTrueStyles',
  tsconfig: 'tsconfig.json',
  invisiblePrehydration: true,
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
