import { readFile, writeFile } from './util';
import * as babel from 'babel-core';


export function transpileFile(src: string, dest: string, plugins: any[] = [], minify = true) {
  return readFile(src).then(code => {
    return transpile(code, dest, plugins, minify);
  });
}


export function transpile(code: string, dest: string, plugins: any[] = [], minify = true) {
  plugins = plugins.concat([
    'transform-es2015-arrow-functions',
    'transform-es2015-block-scoped-functions',
    'transform-es2015-block-scoping',
    'transform-es2015-destructuring',
    'transform-es2015-parameters',
    'transform-es2015-shorthand-properties',
    'transform-es2015-template-literals',
  ]);

  const transpileResult = babel.transform(code, { plugins: plugins });

  const promises: Promise<any>[] = [];

  promises.push(writeFile(dest, transpileResult.code));

  if (minify) {
    const minifyResult = babel.transformFromAst(transpileResult.ast, transpileResult.code, {
      presets: [
        ['babili', {
          removeConsole: true,
          removeDebugger: true
        }],
      ]
    });

    const destMin = dest.replace('.js', '.min.js');

    promises.push(writeFile(destMin, minifyResult.code));
  }

  return promises;
}
