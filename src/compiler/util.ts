import { BuildContext, FileMeta, Results } from './interfaces';
import * as fs from 'fs';
import * as path from 'path';


export function getFileMeta(ctx: BuildContext, filePath: string): Promise<FileMeta> {
  const fileMeta = ctx.files.get(filePath);
  if (fileMeta) {
    return Promise.resolve(fileMeta);
  }

  return readFile(filePath).then(srcText => {
    return createFileMeta(ctx, filePath, srcText);
  });
}


export function createFileMeta(ctx: BuildContext, filePath: string, srcText: string) {
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
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}


export function writeFile(filePath: string, content: string) {
  return new Promise((resolve, reject) => {
    mkdir(path.dirname(filePath), () => {
      fs.writeFile(filePath, content, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });
}


export function copyFile(src: string, dest: string) {
  return readFile(src).then(content => {
    return writeFile(dest, content);
  });
}


export function mkdir(root: string, callback: Function) {
  var chunks = root.split(path.sep); // split in chunks
  var chunk;

  if (path.isAbsolute(root) === true) { // build from absolute path
    chunk = chunks.shift(); // remove "/" or C:/
    if (!chunk) { // add "/"
      chunk = path.sep;
    }

  } else {
    chunk = path.resolve(); // build with relative path
  }

  return mkdirRecursive(chunk, chunks, callback);
}


function mkdirRecursive(root: string, chunks: string[], callback: Function): void {
  var chunk = chunks.shift();
  if (!chunk) {
    return callback(null);
  }

  var root = path.join(root, chunk);

  return fs.exists(root, (exists) => {

    if (exists === true) { // already done
      return mkdirRecursive(root, chunks, callback);
    }
    return fs.mkdir(root, (err) => {

      if (err) {
        return callback(err);
      }
      return mkdirRecursive(root, chunks, callback); // let's magic
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


export function logError(results: Results, msg: any) {
  results.errors = results.errors || [];
  results.errors.push(msg);

  return results;
}
