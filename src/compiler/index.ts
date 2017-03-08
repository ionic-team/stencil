import * as fs from 'fs';
import * as path from 'path';
import * as sass from 'node-sass';


export function compileComponents(srcDir: string, jsDir: string, ctx?: BuildContext) {
  if (!jsDir) {
    jsDir = srcDir;
  }

  if (!ctx) {
    ctx = {};
  }

  return compileComponentDirectory(srcDir, jsDir, ctx).then(() => {
    console.log('compileComponents done');
  });
}


function compileComponentDirectory(srcDir: string, jsDir: string, ctx: BuildContext) {
  return new Promise((resolve, reject) => {

    fs.readdir(srcDir, (err, files) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      }

      const promises: Promise<any>[] = [];

      files.forEach(fileName => {
        const readSrcPath = path.join(srcDir, fileName);
        const readJsPath = path.join(jsDir, fileName);

        if (fs.statSync(readSrcPath).isDirectory()) {
          promises.push(compileComponentDirectory(readSrcPath, readJsPath, ctx));

        } else {
          promises.push(compileComponentFile(fileName, srcDir, jsDir, ctx));
        }
      });

      Promise.all(promises).then(() => {
        resolve();
      });
    });

  });
}


export function compileComponentFile(srcFileName: string, srcDir: string, jsDir: string, ctx?: BuildContext) {
  if (!isTsFile(srcFileName)) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    fs.readFile(path.join(srcDir, srcFileName), 'utf8', (err, srcContent) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      }

      const componentName = getComponentName(srcContent);
      if (!componentName) {
        resolve();
        return;
      }

      const parts = srcFileName.split('.');
      parts[parts.length - 1] = 'js';
      const jsFileName = parts.join('.');

      const jsFilePath = path.join(jsDir, jsFileName);

      fs.readFile(jsFilePath, 'utf8', (err, jsContent) => {
        if (err) {
          console.log(err);
          reject(err);
          return;
        }

        if (!ctx) {
          ctx = {};
        }
        if (!ctx.files) {
          ctx.files = {};
        }

        const annotationsMatch = getAnnotationsMatch(jsContent);
        if (!annotationsMatch) {
          resolve();
          return;
        }

        const annotations = parseAnnotations(annotationsMatch);
        if (!annotations) {
          resolve();
          return;
        }

        const meta = ctx.files[srcFileName] = {
          srcFileName: srcFileName,
          componentName: componentName,
          srcDir: srcDir,
          srcContent: srcContent,
          jsFileName: jsFileName,
          jsDir: jsDir,
          jsContent: jsContent,
          annotations: annotations
        };

        if (meta.annotations.preprocessStyles) {
          preprocessStyles(meta.annotations.preprocessStyles, srcDir, (styles) => {
            meta.annotations.styles = styles;
            delete meta.annotations.preprocessStyles;

            meta.jsContent = replaceAnnotations(meta.jsContent, annotationsMatch, meta.annotations);

            fs.writeFile(jsFilePath, meta.jsContent, (err) => {
              if (err) {
                console.log(err);
                reject(err);
                return;
              }

              resolve();
            });
          });

        } else {
          resolve();
        }

      });

    });
  });
}


function preprocessStyles(fileNames: string[], srcDir: string, callback: {(styles: string)}) {
  const sassImports = fileNames.map(f => {
    return path.join(srcDir, f);
  })

  var sassConfig = {
    data: '@charset "UTF-8"; @import "' + sassImports.join('","') + '";',
    outputStyle: 'compressed'
  };

  sass.render(sassConfig, (err, result) => {
    if (err) {
      console.log(err);
      callback(null);

    } else {
      const cssOutput = result.css.toString().trim();
      callback(cssOutput);
    }
  });
}


function getAnnotationsMatch(content: string) {
  return content.match(/\.\$annotations([\s\S]*?)=([\s\S]*?)\{([\s\S]*?)(.*?)([\s\S]*?)\};/m);

}


function parseAnnotations(match: RegExpMatchArray): Annotations {
  return eval(`(function(){ return { ${match[5]} }; })()`);
}


function replaceAnnotations(content: string, annotationsMatch: RegExpMatchArray, annotations: Annotations) {
  const str = `.$annotations = ${JSON.stringify(annotations)};`;
  return content.replace(annotationsMatch[0], str);
}


function getComponentName(content: string) {
  var classMatch = content.match(/export class (.*?) extends IonElement/);
  if (classMatch) {
    return classMatch[1];
  }

  return null;
}


function isTsFile(fileName: string) {
  const parts = fileName.toLowerCase().split('.');
  if (parts[parts.length - 1] === 'ts') {
    if (parts.length > 2 && parts[parts.length - 2] === 'd') {
      return false;
    }
    return true;
  }
  return false;
}


export interface BuildContext {
  files?: {[fileName: string]: FileMeta};
}


export interface Annotations {
  preprocessStyles: string[];
  styles: string;
}


export interface FileMeta {
  srcFileName: string;
  srcDir: string;
  jsFileName: string;
  jsDir: string;
  componentName: string;
  srcContent: string;
  jsContent: string;
  annotations: Annotations;
}