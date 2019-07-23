
export { compile } from './browser-compile';
export { getMinifyScriptOptions } from './browser-compile-options';
export { scopeCss } from './browser-scope-css';

export const version = '0.0.0-stencil-dev';

export const dependencies = [
  {
    name: 'typescript',
    version: '__VERSION:TYPESCRIPT__',
    url: 'https://cdn.jsdelivr.net/npm/typescript@__VERSION:TYPESCRIPT__/lib/typescript.js'
  }
];
