import { Config } from '../../internal';
import builtins from 'rollup-plugin-node-builtins';
import { reactOutputTarget } from '@stencil/react-output-target';

export const config: Config = {
  namespace: 'EndToEnd',
  globalScript: './src/global.ts',
  globalStyle: './src/global.css',
  plugins: [builtins()],

  testing: {
    moduleNameMapper: {
      'lodash-es': 'lodash',
    },
  },
  outputTargets: [
    {
      type: 'www',
      serviceWorker: null,
    },
    {
      type: 'dist',
    },
    {
      type: 'experimental-dist-module',
    },
    reactOutputTarget({
      componentCorePackage: '@stencil/e2e-react-output-target',
      proxiesFile: './dist-react/components.ts',
    }),
  ],
  commonjs: {
    namedExports: {
      'file-saver': ['saveAs'],
    },
  },
  hydratedFlag: {
    name: 'custom-hydrate-flag',
    selector: 'attribute',
    property: 'opacity',
    initialValue: '0',
    hydratedValue: '1',
  },
  enableCache: false,
  hashFileNames: false,
};
