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
      type: 'www'
    },
    {
      type: 'dist',
      dir: 'test-dist'
    }
  ],
  copy: [
    { src: '**/*.html' },
    { src: '**/*.css' },
    { src: 'noscript.js' }
  ],
  globalScript: 'test-app/global.ts',
  globalStyle: 'test-app/style-plugin/global-sass-entry.scss',
  plugins: [
    nodePolyfills(),
    sass(),
    less(),
    postcss(),
    stylus()
  ],
  extras: {
    appendChildSlotFix: true,
    cloneNodeFix: true,
    lifecycleDOMEvents: true,
    slotChildNodesFix: true,
  },
  devServer: {
    historyApiFallback: {
      disableDotRule: true,
      index: 'index.html'
    }
  }
};
