import { CompileOptions, CompilerContext } from './interfaces';
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


export function readDir(inputDirPath: string, opts: CompileOptions, ctx: CompilerContext): Promise<string[]> {
  return new Promise((resolve1, reject1) => {

    fs.readdir(inputDirPath, (err, dirFiles) => {
      if (err) {
        reject1(err);
        return;
      }

      const collectedFiles: string[] = [];

      const promises: Promise<any>[] = dirFiles.map(dirFile => {

        return new Promise((resolve2, reject2) => {
          const readPath = path.join(inputDirPath, dirFile);

          fs.stat(readPath, (err, stats) => {
            if (err) {
              reject2(err);
              return;
            }

            if (stats.isDirectory()) {
              readDir(readPath, opts, ctx).then(subFiles => {
                subFiles.forEach(subFile => {
                  collectedFiles.push(subFile);
                });
                resolve2();
              });

            } else {
              collectedFiles.push(readPath);
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
