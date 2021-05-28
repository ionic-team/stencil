import { Config } from '../../internal';
import builtins from 'rollup-plugin-node-builtins';
import linaria from 'linaria/rollup';
import css from 'rollup-plugin-css-only';
import { reactOutputTarget } from '@stencil/react-output-target';
import { sass } from '@stencil/sass';
import path from 'path';

export const config: Config = {
  namespace: 'EndToEnd',
  globalScript: './src/global.ts',
  globalStyle: './src/global.css',
  plugins: [builtins(), sass()],
  rollupPlugins: {
    after: [
      linaria(),
      css({
        output: path.join(__dirname, 'www', 'linaria.css'),
      }),
    ],
  },

  testing: {
    moduleNameMapper: {
      'lodash-es': 'lodash',
    },
    transformIgnorePatterns: [
      "node_modules/(?!(ionic-git)/)"
    ]
  },
  outputTargets: [
    {
      type: 'www',
      empty: false,
      serviceWorker: null,
    },
    {
      type: 'dist',
    },
    {
      type: 'dist-custom-elements-bundle',
    },
    {
      type: 'dist-hydrate-script',
    },
    {
      type: 'docs-json',
      file: 'docs.json',
    },
    reactOutputTarget({
      componentCorePackage: '@stencil/e2e-react-output-target',
      proxiesFile: './dist-react/components.ts',
    }),
  ],
  hydratedFlag: {
    name: 'custom-hydrate-flag',
    selector: 'attribute',
    property: 'opacity',
    initialValue: '0',
    hydratedValue: '1',
  },
  env: {
    'foo': 'bar',
    'HOST': 'example.com'
  },
  enableCache: false,
  hashFileNames: false,
  buildEs5: 'prod',
};
