
export { compile } from './browser-compile';
export { getMinifyScriptOptions } from './browser-compile-options';

export const version = '0.0.0-stencil-dev';

export const dependencies = [
  {
    name: 'rollup',
    version: '__VERSION:ROLLUP__',
    url: 'https://unpkg.com/rollup@__VERSION:ROLLUP__/dist/rollup.browser.js'
  },
  {
    name: 'terser',
    version: '__VERSION:TERSER__',
    url: 'https://unpkg.com/terser@__VERSION:TERSER__/dist/bundle.js'
  },
  {
    name: 'typescript',
    version: '__VERSION:TYPESCRIPT__',
    url: 'https://unpkg.com/typescript@__VERSION:TYPESCRIPT__/lib/typescript.js'
  }
];
