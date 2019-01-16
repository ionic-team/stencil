import { Config } from '../../dist'
import { sass } from '@stencil/sass';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';


export const config: Config = {
  namespace: 'TestApp',
  srcDir: 'test-app',
  tsconfig: 'tsconfig-stencil.json',
  outputTargets: [
    {
      type: 'www',
      empty: false
    },
    // {
    //   type: 'webcomponent',
    //   dir: 'www/webcomponent',
    //   empty: false
    // },
    // {
    //   type: 'dist',
    //   dir: 'test-dist'
    // }
  ],
  copy: [
    { src: '**/*.html' },
    { src: 'noscript.js' }
  ],
  excludeSrc: [],
  globalScript: 'test-app/global.ts',
  globalStyle: 'test-app/style-plugin/global-sass-entry.scss',
  plugins: [
    builtins(),
    globals(),
    sass()
  ],
  devServer: {
    historyApiFallback: {
      disableDotRule: true,
      index: 'index.html'
    }
  },
  exposeAppOnReady: true,
  exposeAppRegistry: true
};
