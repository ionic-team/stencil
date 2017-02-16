import { CompileOptions, CompilerContext } from './interfaces';
import * as fs from 'fs';


export function readFile(filePath: string, opts: CompileOptions, ctx: CompilerContext): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, content) => {
      if (err) {
        reject(err);

      } else {
        resolve(content.toString());
      }
    });
  });
}


export function writeFile(filePath: string, data: string, opts: CompileOptions, ctx: CompilerContext): Promise<boolean> {
  return new Promise((resolve, reject) => {
    if (opts.writeToDisk === false) {
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
