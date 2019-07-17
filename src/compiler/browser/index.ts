
export { compile } from './browser-compile';

export const version = '0.0.0-stencil-dev';

export const dependencies = {
  rollup: {
    version: '__VERSION:ROLLUP__',
    url: 'https://unpkg.com/rollup@__VERSION:ROLLUP__/dist/rollup.browser.js'
  },
  terser: {
    version: '__VERSION:TERSER__',
    url: 'https://unpkg.com/terser@__VERSION:TERSER__/dist/bundle.js'
  },
  typescript: {
    version: '__VERSION:TYPESCRIPT__',
    url: 'https://unpkg.com/typescript@__VERSION:TYPESCRIPT__/lib/typescript.js'
  },
};
