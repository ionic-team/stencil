import { sass } from '@stencil/sass';
import { less } from '@stencil/less';
import { stylus } from '@stencil/stylus';
import { postcss } from '@stencil/postcss';
import { Config } from '../../internal';

import nodePolyfills from 'rollup-plugin-node-polyfills';

export const config: Config = {
  namespace: 'TestApp',
  srcDir: 'test-app',
  tsconfig: 'tsconfig-stencil.json',
  outputTargets: [
    {
      type: 'www',
      empty: false,
      copy: [{ src: '**/*.html' }, { src: '**/*.css' }, { src: 'noscript.js' }],
    },
    {
      type: 'dist',
      dir: 'test-dist',
    },
    {
      type: 'dist-custom-elements',
      dir: 'test-components'
    },
  ],
  globalScript: 'test-app/global.ts',
  globalStyle: 'test-app/style-plugin/global-sass-entry.scss',
  plugins: [nodePolyfills(), sass(), less(), postcss(), stylus()],
  buildEs5: true,
  extras: {
    appendChildSlotFix: true,
    cloneNodeFix: true,
    cssVarsShim: true,
    dynamicImportShim: true,
    lifecycleDOMEvents: true,
    safari10: true,
    scriptDataOpts: true,
    shadowDomShim: true,
    slotChildNodesFix: true,
  },
  devServer: {
    historyApiFallback: {
      disableDotRule: true,
      index: 'index.html',
    },
  },
};
