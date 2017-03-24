import { CompilerOptions, CompilerContext, FileMeta } from './interfaces';
import { transpileFile } from './transpiler';
import { getTsModule, getTsScriptTarget, writeFile } from './util';
import * as path from 'path';
import * as fs from 'fs';
import * as ts from 'typescript';
import * as babel from 'babel-core';
const rollup = require('rollup');


export function bundleComponents(opts: CompilerOptions, ctx: CompilerContext) {
  return Promise.all([
    createIonicJs(opts, ctx),
    createComponentJs(opts, ctx),
    createComponentES5Js(opts, ctx),
    createComponentFiles(opts, ctx)
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


function createComponentFiles(opts: CompilerOptions, ctx: CompilerContext) {
  return transpileComponentFiles(opts, ctx).then(() => {
    return bundleComponentFiles(opts, ctx);
  });
}


function transpileComponentFiles(opts: CompilerOptions, ctx: CompilerContext) {
  return new Promise(resolve => {
    const files: string[] = [];
    ctx.files.forEach(file => {
      if (file.isTransformable && file.isTsSourceFile) {
        files.push(file.filePath);
      }
    });

    const orgTsReadFile = ts.sys.readFile;

    ts.sys.readFile = function(filePath: string, encoding?: string): string {
      const file = ctx.files.get(filePath);
      if (file) {
        if (file.srcTextWithoutDecorators) {
          return file.srcTextWithoutDecorators;
        }
        if (file.srcText) {
          return file.srcText;
        }
      }

      return fs.readFileSync(filePath, 'utf8');
    };

    const program = ts.createProgram(files, {
      target: getTsScriptTarget(opts.scriptTarget),
      module: getTsModule(opts.module)
    });

    program.emit(undefined, (filePath: string, data: string) => {
      let file = getFileMeta(filePath, ctx);
      if (file) {
        file.transpiledText = data;

      } else {
        file = {
          fileName: path.basename(filePath),
          filePath: filePath,
          srcText: data,
          srcTextWithoutDecorators: data,
          transpiledText: data,
          isTsSourceFile: false,
          isTransformable: false
        };
        ctx.files.set(filePath, file);
      }
    });

    ts.sys.readFile = orgTsReadFile;

    resolve();
  });
}


function bundleComponentFiles(opts: CompilerOptions, ctx: CompilerContext) {
  const promises: Promise<any>[] = [];

  ctx.files.forEach(file => {
    if (file.cmpMeta && file.cmpMeta.modes) {
      promises.push(bundleComponentJs(file, opts, ctx));
    }
  });

  return Promise.all(promises);
}


function bundleComponentJs(file: FileMeta, opts: CompilerOptions, ctx: CompilerContext) {
  const paths = file.filePath.split('.');
  paths[paths.length - 1] = 'js';

  const jsFilePath = paths.join('.');

  return rollup.rollup({
    entry: jsFilePath,
    plugins: [rollupFS(ctx)]

  }).then((bundle: any) => {

    const result = bundle.generate({
      format: 'es'
    });

    let code: string = result.code;

    const match = /export {(.*?)};/g.exec(code);
    if (match) {
      code = code.replace(match[0], `return ${match[1].trim()};`)
    }

    code = `function moduleFn() {
      ${code};
    }`

    const plugins = [
      'transform-es2015-arrow-functions',
      'transform-es2015-block-scoped-functions',
      'transform-es2015-block-scoping',
      'transform-es2015-destructuring',
      'transform-es2015-parameters',
      'transform-es2015-shorthand-properties',
      'transform-es2015-template-literals',
    ];

    const presets = [
      ['babili', {
        removeConsole: true,
        removeDebugger: true
      }]
    ];

    const transpileResult = babel.transform(code, {
      presets: presets,
      plugins: plugins,
      ast: false,
      babelrc: false
    });

    const moduleFn = transpileResult.code;

    const promises: Promise<any>[] = [];

    Object.keys(file.cmpMeta.modes).forEach(mode => {
      const styles = file.cmpMeta.modes[mode].styles;
      promises.push(bundleComponentMode(file, mode, styles, moduleFn, opts, ctx));
    });

    return Promise.all(promises);
  });
}


function bundleComponentMode(file: FileMeta, mode: string, styles: string, moduleFn: string, opts: CompilerOptions, ctx: CompilerContext) {
  const outfileName = `${file.cmpMeta.tag}.${mode}.js`;
  const outfile = path.join(opts.destDir, outfileName);

  styles = styles || '';
  styles = styles.replace(/\'/g, '"');
  styles = styles.replace(/\n/g, '');

  let output = `ionicComponent({
  tag: '${file.cmpMeta.tag}',
  mode: '${mode}',
  styles: '${styles}',
  moduleFn: ${moduleFn}\n});`;

  output = output.replace('function moduleFn()', 'function()');

  return writeFile(outfile, output);
}


function rollupFS(ctx: CompilerContext) {
  return {
    resolveId: function(importee: string, importer: string) {
      const file = getFileMeta(importee, ctx);
      if (file) {
        if (file.transpiledText) {
          return importee;
        }
      }
    },
    load: function(filePath: string) {
      const file = getFileMeta(filePath, ctx);
      if (file) {
        if (file.transpiledText) {
          return file.transpiledText;
        }
      }
    }
  };
}


function getFileMeta(filePath: string, ctx: CompilerContext) {
  const file = ctx.files.get(filePath);
  if (file) {
    return file;
  }

  const paths = filePath.split('.');
  paths[paths.length - 1] = 'ts';

  const tsFilePath = paths.join('.');

  return ctx.files.get(tsFilePath);
}
