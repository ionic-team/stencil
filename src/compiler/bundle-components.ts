import { CompilerOptions, CompilerContext, ComponentMeta } from './interfaces';
import { readFile, writeFile } from './util';
import * as path from 'path';
import * as babel from 'babel-core';


export function bundleComponents(opts: CompilerOptions, ctx: CompilerContext) {
  return Promise.all([
    createIonicJs(opts, ctx),
    createComponentJs(opts, ctx)
  ]);
}


export function createIonicJs(opts: CompilerOptions, ctx: CompilerContext) {
  return new Promise(resolve => {
    const fileName = 'ionic.js';

    const src = path.join(opts.ionicBundlesDir, fileName);
    const dest = path.join(opts.destDir, fileName);

    return transpile(src, dest, ctx.components);
  });
}


function createComponentJs(opts: CompilerOptions, ctx: CompilerContext) {
  return new Promise(resolve => {
    const fileName = 'ionic.components.js';

    const src = path.join(opts.ionicBundlesDir, fileName);
    const dest = path.join(opts.destDir, fileName);

    return transpile(src, dest, ctx.components);
  });
}


function transpile(src: string, dest: string, components: ComponentMeta[]) {
  return readFile(src).then(code => {

    const plugins = [
      'transform-es2015-arrow-functions',
      'transform-es2015-block-scoped-functions',
      'transform-es2015-block-scoping',
      'transform-es2015-destructuring',
      'transform-es2015-parameters',
      'transform-es2015-shorthand-properties',
      'transform-es2015-template-literals',
      ['transform-define', {
        'IONIC_COMPONENTS': components
      }]
    ];

    const transpileResult = babel.transform(code, { plugins: plugins });

    const minifyResult = babel.transformFromAst(transpileResult.ast, transpileResult.code, {
      presets: [
        ['babili', {
          removeConsole: true,
          removeDebugger: true
        }]
      ]
    });

    const destMin = dest.replace('.js', '.min.js');

    return Promise.all([
      writeFile(dest, transpileResult.code),
      writeFile(destMin, minifyResult.code),
    ]);

  });
}