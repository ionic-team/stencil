import { GenerateContext, FileMeta } from './interfaces';
import * as fs from 'fs';
import * as path from 'path';


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
    srcDir: path.dirname(filePath),
    srcText: srcText,
    srcTextWithoutDecorators: null,
    jsFilePath: null,
    jsText: null,
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


export function copyFile(src: string, dest: string) {
  return readFile(src).then(content => {
    return writeFile(dest, content);
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
