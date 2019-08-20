import path from 'path';

export { compile } from './compile';
export { getMinifyScriptOptions } from './compile-options';
export { path };
export { stencilRollupPlugin as rollupPlugin } from '../rollup-plugins/stencil-public-plugin';

export const version = '0.0.0-stencil-dev';

export const dependencies = [
  {
    name: 'typescript',
    version: '__VERSION:TYPESCRIPT__',
    url: 'https://cdn.jsdelivr.net/npm/typescript@__VERSION:TYPESCRIPT__/lib/typescript.js'
  }
];
