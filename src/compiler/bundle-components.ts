import { CompilerOptions, CompilerContext } from './interfaces';
import { writeFile } from './util';
import * as fs from 'fs-extra'
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

    fs.copy(src, dest, err => {
      if (err) {
        console.log(err);
      }
      resolve();
    });
  });
}


function createComponentJs(opts: CompilerOptions, ctx: CompilerContext) {
  return new Promise(resolve => {
    const fileName = 'ionic.components.js';

    const src = path.join(opts.ionicBundlesDir, fileName);
    const dest = path.join(opts.destDir, fileName);

    return transpile(src, dest, [
      'transform-es2015-arrow-functions',
      'transform-es2015-block-scoped-functions',
      'transform-es2015-block-scoping',
      'transform-es2015-destructuring',
      'transform-es2015-parameters',
      'transform-es2015-shorthand-properties',
      'transform-es2015-template-literals'
    ]);
  });
}


function transpile(src: string, dest: string, plugins: string[]) {
  return new Promise(resolve => {

    babel.transformFile(src, { plugins: plugins }, (err, transpileResult) => {
      if (err) {
        console.log(err);
      }

      const minifyResult = babel.transformFromAst(transpileResult.ast, transpileResult.code, {
        presets: [
          ['babili', { removeConsole: true, removeDebugger: true } ]
        ]
      });

      const destMin = dest.replace('.js', '.min.js');

      Promise.all([
        writeFile(dest, transpileResult.code),
        writeFile(destMin, minifyResult.code),

      ]).then(() => {
        resolve();
      });
    });

  });
}