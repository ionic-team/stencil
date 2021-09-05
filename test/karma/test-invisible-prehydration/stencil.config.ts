import { Config } from '../../../dist/declarations';

export const config: Config = {
  namespace: 'TestInvisibleDefaultPrehydration',
  tsconfig: 'tsconfig.json',
  outputTargets: [
    {
      type: 'www',
      dir: '../www',
      empty: false,
      indexHtml: 'prehydrated-styles.html',
      serviceWorker: null,
    },
  ],
};
