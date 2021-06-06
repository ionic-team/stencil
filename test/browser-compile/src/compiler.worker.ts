import type StencilCompiler from '@stencil/core/compiler';

(self as any).importScripts('/@stencil/core/compiler/stencil.js');

const stencil: typeof StencilCompiler = (self as any).stencil;

export const transpileWorker = (code: string, opts: StencilCompiler.TranspileOptions) => {
  return stencil.transpile(code, opts);
};
