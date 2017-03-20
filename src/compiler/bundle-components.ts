import { CompilerOptions, CompilerContext } from './interfaces';
import { transpileFile } from './transpiler';
import * as path from 'path';


export function bundleComponents(opts: CompilerOptions, ctx: CompilerContext) {
  return Promise.all([
    createIonicJs(opts, ctx),
    createComponentJs(opts, ctx),
    createComponentCeJs(opts, ctx),
    createComponentES5Js(opts, ctx)
  ]);
}


export function createIonicJs(opts: CompilerOptions, ctx: CompilerContext) {
  return new Promise(resolve => {
    const fileName = 'ionic.js';

    const src = path.join(opts.ionicBundlesDir, fileName);
    const dest = path.join(opts.destDir, fileName);

    return transpileFile(src, dest);
  });
}


function createComponentJs(opts: CompilerOptions, ctx: CompilerContext) {
  return new Promise(resolve => {
    const fileName = 'ionic.components.js';

    const src = path.join(opts.ionicBundlesDir, fileName);
    const dest = path.join(opts.destDir, fileName);

    const plugins = [
      ['transform-define', {
        'IONIC_COMPONENTS': ctx.components
      }]
    ];

    return transpileFile(src, dest, plugins);
  });
}


function createComponentCeJs(opts: CompilerOptions, ctx: CompilerContext) {
  return new Promise(resolve => {
    const fileName = 'ionic.components.ce.js';

    const src = path.join(opts.ionicBundlesDir, fileName);
    const dest = path.join(opts.destDir, fileName);

    const plugins = [
      ['transform-define', {
        'IONIC_COMPONENTS': ctx.components
      }]
    ];

    return transpileFile(src, dest, plugins);
  });
}


function createComponentES5Js(opts: CompilerOptions, ctx: CompilerContext) {
  return new Promise(resolve => {
    const fileName = 'ionic.components.es5.js';

    const src = path.join(opts.ionicBundlesDir, fileName);
    const dest = path.join(opts.destDir, fileName);

    const plugins = [
      'transform-es2015-classes',
      ['transform-define', {
        'IONIC_COMPONENTS': ctx.components
      }]
    ];

    return transpileFile(src, dest, plugins);
  });
}
