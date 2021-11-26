import nodePolyfills from 'rollup-plugin-node-polyfills';
import { sass } from '@stencil/sass';
import { less } from '@stencil/less';
import { stylus } from '@stencil/stylus';
import { postcss } from '@stencil/postcss';

const { CUSTOM_ELEMENTS_OUT_DIR, DIST_OUT_DIR, TEST_OUTPUT_DIR, WWW_OUT_DIR } = require('./constants');
import { Config } from '../../internal';

export const config: Config = {
  namespace: 'TestApp',
  srcDir: 'test-app',
  tsconfig: 'tsconfig-stencil.json',
  outputTargets: [
    {
      type: 'www',
      empty: false,
      copy: [{ src: '**/*.html' }, { src: '**/*.css' }, { src: 'noscript.js' }],
      dir: WWW_OUT_DIR,
    },
    {
      type: 'dist',
      dir: DIST_OUT_DIR,
    },
    {
      type: 'dist-custom-elements',
      dir: CUSTOM_ELEMENTS_OUT_DIR,
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
    scopedSlotTextContentFix: true,
    scriptDataOpts: true,
    shadowDomShim: true,
    slotChildNodesFix: true,
  },
  devServer: {
    // when running `npm start`, serve from the root directory, rather than the `www` output target location
    root: TEST_OUTPUT_DIR,
    historyApiFallback: {
      disableDotRule: true,
      index: 'index.html',
    },
  },
};
