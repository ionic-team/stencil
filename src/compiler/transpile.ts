import { createFileMeta } from './util';
import { CompilerConfig, CompilerContext } from './interfaces';
import * as fs from 'fs';
import * as ts from 'typescript';


export function transpile(config: CompilerConfig, ctx: CompilerContext): Promise<any> {
  const tsFileNames = getTsFileNames(ctx);

  if (config.debug) {
    console.log(`transpile: ${tsFileNames}`);
  }

  if (!tsFileNames.length) {
    return Promise.resolve();
  }

  const tsCompilerOptions = createTsCompilerConfigs(config);
  const tsHost = ts.createCompilerHost(tsCompilerOptions);

  const tsSysReadFile = ts.sys.readFile;

  ts.sys.readFile = function(tsFilePath: string) {
    let fileMeta = ctx.files.get(tsFilePath);
    if (fileMeta) {
      return fileMeta.srcTextWithoutDecorators || fileMeta.srcText;
    }

    fileMeta = createFileMeta(ctx, tsFilePath, fs.readFileSync(tsFilePath, 'utf-8'));
    return fileMeta.srcText;
  };

  const program = ts.createProgram(tsFileNames, tsCompilerOptions, tsHost);

  function writeFile(fileName: string, data: string, writeByteOrderMark: boolean, onError: (message: string) => void, sourceFiles: ts.SourceFile[]) {

    sourceFiles.forEach(s => {
      const fileMeta = ctx.files.get(s.fileName);
      if (fileMeta) {
        fileMeta.jsFilePath = fileName;
        fileMeta.jsText = data;
      }
    });

    writeByteOrderMark;
    onError;
  }

  program.emit(undefined, writeFile);

  ts.sys.readFile = tsSysReadFile;

  return writeJsFiles(ctx);
}


function writeJsFiles(ctx: CompilerContext) {
  ctx.files.forEach(f => {
    if (f.jsFilePath && f.jsText) {
      if (!f.cmpMeta) {
        return;
      }

      f.jsText = f.jsText.replace(`Object.defineProperty(exports, "__esModule", { value: true });`, '');
      f.jsText = f.jsText.trim();

      ts.sys.writeFile(f.jsFilePath, f.jsText);
    }
  });

  return Promise.resolve();
}


function createTsCompilerConfigs(config: CompilerConfig) {
  const tsCompilerOptions: ts.CompilerOptions = Object.assign({}, config.compilerOptions);

  tsCompilerOptions.noImplicitUseStrict = true;
  tsCompilerOptions.moduleResolution = ts.ModuleResolutionKind.NodeJs;
  tsCompilerOptions.module = getTsModule(config.compilerOptions.module);
  tsCompilerOptions.target = getTsScriptTarget(config.compilerOptions.target);

  tsCompilerOptions.lib = tsCompilerOptions.lib || [];
  if (!tsCompilerOptions.lib.indexOf('dom')) {
    tsCompilerOptions.lib.push('dom');
  }
  if (!tsCompilerOptions.lib.indexOf('es2015')) {
    tsCompilerOptions.lib.push('es2015');
  }

  return tsCompilerOptions;
}


function getTsFileNames(ctx: CompilerContext) {
  const fileNames: string[] = [];

  ctx.files.forEach(fileMeta => {
    if (!fileMeta.isTsSourceFile || !fileMeta.cmpMeta) {
      return;
    }

    fileNames.push(fileMeta.filePath);
  });

  return fileNames;
}


export function getTsScriptTarget(str: 'es5' | 'es2015') {
  if (str === 'es2015') {
    return ts.ScriptTarget.ES2015;
  }

  return ts.ScriptTarget.ES5;
}


export function getTsModule(str: 'commonjs' | 'es2015') {
  if (str === 'es2015') {
    return ts.ModuleKind.ES2015;
  }

  return ts.ModuleKind.CommonJS;
}
