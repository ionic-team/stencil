import * as fs from 'fs-extra';
import * as ts from 'typescript';
import * as crypto from 'crypto';


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


export function hashContent(content: string) {
  const hash = crypto.createHash('sha1');
  hash.update(content);
  return hash.digest('hex');
}


export function readFile(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {

    fs.readFile(filePath, 'utf-8', (err, content) => {
      if (err) {
        reject(err);
      } else {
        resolve(content.toString());
      }
    });

  });
}


export function writeFile(filePath: string, data: string): Promise<null> {
  return new Promise((resolve, reject) => {

    fs.writeFile(filePath, data, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });

  });
}


export function emptyDir(dirPath: string) {
  return new Promise((resolve, reject) => {

    fs.emptyDir(dirPath, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });

  });
}


export function copy(src: string, dest: string) {
  return new Promise((resolve, reject) => {

    fs.copy(src, dest, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });

  });
}


export function getTsScriptTarget(str: string) {
  if (str === 'es5') {
    return ts.ScriptTarget.ES5
  }

  return ts.ScriptTarget.ES2015
}


export function getTsModule(str: string) {
  if (str === 'common') {
    return ts.ModuleKind.CommonJS;
  }

  return ts.ModuleKind.ES2015;
}
