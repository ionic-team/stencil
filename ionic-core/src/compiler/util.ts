import { CompileOptions, CompilerContext, FileMeta } from './interfaces';
import * as fs from 'fs';
import * as path from 'path';


export function readFile(filePath: string, opts: CompileOptions, ctx: CompilerContext): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!path.isAbsolute(filePath)) {
      reject(`absolute file path required: ${filePath}`);
      return;
    }

    fs.readFile(filePath, (err, content) => {
      if (err) {
        reject(err);

      } else {
        resolve(content.toString());
      }
    });
  });
}


export function readDir(inputDirPath: string, sourceFileDirPath: string, opts: CompileOptions, ctx: CompilerContext): Promise<FileMeta[]> {
  return new Promise((resolve1, reject1) => {

    fs.readdir(inputDirPath, (err, dirFiles) => {
      if (err) {
        reject1(err);
        return;
      }

      const collectedFiles: FileMeta[] = [];

      const promises: Promise<any>[] = dirFiles.map(dirFile => {

        return new Promise((resolve2, reject2) => {
          const inputReadPath = path.join(inputDirPath, dirFile);
          const sourceReadPath = path.join(sourceFileDirPath, dirFile);

          fs.stat(inputReadPath, (err, stats) => {
            if (err) {
              reject2(err);
              return;
            }

            if (stats.isDirectory()) {
              readDir(inputReadPath, sourceReadPath, opts, ctx).then(subFiles => {
                subFiles.forEach(subFile => {
                  collectedFiles.push(subFile);
                });
                resolve2();
              });

            } else {
              const file: FileMeta = {
                inputFilePath: inputReadPath,
                sourceFileDirPath: sourceReadPath,
                ext: inputReadPath.split('.').pop().toLowerCase()
              };
              collectedFiles.push(file);
              resolve2();
            }
          });

        });

      });

      Promise.all(promises).then(() => {
        resolve1(collectedFiles);
      });

    });

  });

};


export function writeFile(filePath: string, data: string, opts: CompileOptions, ctx: CompilerContext): Promise<boolean> {
  return new Promise((resolve, reject) => {
    if (!path.isAbsolute(filePath)) {
      reject(`absolute file path required: ${filePath}`);
      return;
    }

    if (opts && opts.writeToDisk === false) {
      resolve(false);
      return;
    }

    fs.writeFile(filePath, data, (err) => {
      if (err) {
        reject(err);

      } else {
        resolve(true);
      }
    });
  });
}
