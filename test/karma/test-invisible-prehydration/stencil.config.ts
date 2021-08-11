import { Config } from '../../../dist/declarations';

export const config: Config = {
  namespace: 'TestPrehydratedDefaultStyles',
  tsconfig: 'tsconfig.json',
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
