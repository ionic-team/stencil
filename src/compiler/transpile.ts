import { GenerateConfig, GenerateContext } from './interfaces';
import { getTsModule, getTsScriptTarget, createFileMeta, writeFile } from './util';
import * as ts from 'typescript';
import * as fs from 'fs';


export function transpile(config: GenerateConfig, ctx: GenerateContext): Promise<any> {
  const tsFileNames = getTsFileNames(ctx);
  if (!tsFileNames.length) {
    return Promise.resolve();
  }

  const compilerOptions: ts.CompilerOptions = {
    outDir: config.outDir,
    target: getTsScriptTarget(config.scriptTarget),
    module: getTsModule(config.module),
    declaration: false,
    sourceMap: false
  };

  const host = ts.createCompilerHost(compilerOptions);

  const tsSysReadFile = ts.sys.readFile;

  ts.sys.readFile = function(tsFilePath: string) {
    let fileMeta = ctx.files.get(tsFilePath);
    if (fileMeta && fileMeta.srcText) {
      return fileMeta.srcText;
    }

    fileMeta = createFileMeta(ctx, tsFilePath, fs.readFileSync(tsFilePath, 'utf-8'));
    return fileMeta.srcText;
  };

  const promises: Promise<any>[] = [];

  const program = ts.createProgram(tsFileNames, compilerOptions, host);

  program.emit(undefined, (jsFilePath: string, jsText: string) => {
    promises.push(writeFile(jsFilePath, jsText));
  });

  ts.sys.readFile = tsSysReadFile;

  return Promise.all(promises);
}


function getTsFileNames(ctx: GenerateContext) {
  const fileNames: string[] = [];

  ctx.files.forEach(fileMeta => {
    if (!fileMeta.isTsSourceFile) {
      return;
    }

    fileNames.push(fileMeta.filePath);
  });

  return fileNames;
}
