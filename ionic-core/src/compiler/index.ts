import * as compiler from './build';
import * as fs from 'fs';


export function compileDirectory(dirPath: string) {

}


export function compileFile(filePath: string) {
  return new Promise((resolve, reject) => {

    fs.readFile(filePath, (err, content) => {
      if (err) {
        reject(err);

      } else {
        compileFileContent(content.toString())
          .then(resolve)
          .catch(reject);
      }
    });

  });
}


export function compileFileContent(content: string) {
  return new Promise((resolve, reject) => {


    resolve();
  });
}


export function compileTemplate(template: string, opts?: any) {
  return compiler.compile(template, opts);
}
