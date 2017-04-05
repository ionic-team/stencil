import { GenerateContext, FileMeta } from './interfaces';
import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';


export function getFileMeta(ctx: GenerateContext, filePath: string): Promise<FileMeta> {
  const fileMeta = ctx.files.get(filePath);
  if (fileMeta) {
    return Promise.resolve(fileMeta);
  }

  return readFile(filePath).then(srcText => {
    return createFileMeta(ctx, filePath, srcText);
  });
}


export function createFileMeta(ctx: GenerateContext, filePath: string, srcText: string) {
  const fileMeta: FileMeta = {
    fileName: path.basename(filePath),
    filePath: filePath,
    fileExt: path.extname(filePath),
    srcText: srcText,
    srcTextWithoutDecorators: null,
    isTsSourceFile: isTsSourceFile(filePath),
    isTransformable: false,
    cmpMeta: null
  };

  if (fileMeta.isTsSourceFile) {
    fileMeta.isTransformable = isTransformable(fileMeta.srcText);
  }

  ctx.files.set(filePath, fileMeta);

  return fileMeta;
}


export function readFile(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}


export function writeFile(filePath: string, content: string) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, content, (err) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve();
      }
    });
  });
}


export function isTsSourceFile(filePath: string) {
  const parts = filePath.toLowerCase().split('.');
  if (parts.length > 1) {
    if (parts[parts.length - 1] === 'ts') {
      if (parts.length > 2 && parts[parts.length - 2] === 'd') {
        return false;
      }
      return true;
    }
  }
  return false;
}


export function isTransformable(sourceText: string) {
  return (sourceText.indexOf('@Component') > -1);
}


export function getTsScriptTarget(str: 'es5' | 'es2015') {
  if (str === 'es5') {
    return ts.ScriptTarget.ES5
  }

  return ts.ScriptTarget.ES2015
}


export function getTsModule(str: 'commonjs' | 'es2015') {
  if (str === 'es2015') {
    return ts.ModuleKind.ES2015;
  }

  return ts.ModuleKind.CommonJS;
}
