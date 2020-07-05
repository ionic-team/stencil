import { Config } from '../../internal';
import builtins from 'rollup-plugin-node-builtins';
import { reactOutputTarget } from '@stencil/react-output-target';

export const config: Config = {
  namespace: 'EndToEnd',
  globalScript: './src/global.ts',
  globalStyle: './src/global.css',
  globalStyles: [
    './src/foo.css',
    './src/bar.css',
  ],
  plugins: [
    builtins()
  ],

  testing: {
    moduleNameMapper: {
      'lodash-es': 'lodash'
    }
  },
  outputTargets: [
    {
      type: 'www',
      serviceWorker: null
    },
    {
      type: 'dist',
    },
    {
      type: 'experimental-dist-module'
    },
    reactOutputTarget({
      componentCorePackage: '@stencil/e2e-react-output-target',
      proxiesFile: './dist-react/components.ts',
    })
  ],
  commonjs: {
    namedExports: {
      'file-saver': ['saveAs']
    }
  },
  enableCache: false,
  hashFileNames: false,
};
