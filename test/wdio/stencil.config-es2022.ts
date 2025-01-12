import type { Config } from '../../internal/index.js';

export const config: Config = {
  namespace: 'TestTSTarget',
  tsconfig: 'tsconfig-es2022.json',
  srcDir: 'ts-target-props',
  outputTargets: [
    {
      type: 'dist',
      dir: './test-ts-target-output/dist',
    },
    {
      type: 'dist-custom-elements',
      dir: './test-ts-target-output/custom-elements',
      customElementsExportBehavior: 'auto-define-custom-elements',
      externalRuntime: false,
    },
    {
      type: 'www',
      dir: './test-ts-target-output/www',
      serviceWorker: null,
      indexHtml: 'ts-target-props/es2022.index.html',
    },
  ],
  sourceMap: true,
};
