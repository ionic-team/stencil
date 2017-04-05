import { GenerateConfig, GenerateContext } from './interfaces';
import { getFileMeta, isTsSourceFile } from './util';
import { parseTsSrcFile } from './parser';
import { transpile } from './transpile';
import * as fs from 'fs';
import * as path from 'path';


export function generate(config: GenerateConfig, ctx: GenerateContext = {}) {
  if (!ctx.files) {
    ctx.files = new Map();
  }

  const srcDirs = config.srcDirs || [];

  const promises = srcDirs.map(srcDir => {
    return scanDirectory(srcDir, config, ctx);
  });

  return Promise.all(promises).then(() => {
    return transpile(config, ctx);
  });
}


function scanDirectory(dir: string, config: GenerateConfig, ctx: GenerateContext) {
  return new Promise(resolve => {

    fs.readdir(dir, (err, files) => {
      if (err) {
        console.log(err);
        resolve();
        return;
      }

      const promises: Promise<any>[] = [];

      files.forEach(dirItem => {
        const readPath = path.join(dir, dirItem);

        if (!isValidDirectory(readPath)) {
          return;
        }

        promises.push(new Promise(resolve => {

          fs.stat(readPath, (err, stats) => {
            if (err) {
              console.log(err);
              resolve();
              return;
            }

            if (stats.isDirectory()) {
              scanDirectory(readPath, config, ctx).then(() => {
                resolve();
              });

            } else if (isTsSourceFile(readPath)) {
              inspectTsFile(readPath, config, ctx).then(() => {
                resolve();
              });
            }
          })

        }));

      });

      Promise.all(promises).then(() => {
        resolve();
      });
    });

  });
}


function inspectTsFile(filePath: string, config: GenerateConfig, ctx: GenerateContext = {}) {
  if (!ctx.files) {
    ctx.files = new Map();
  }

  return getFileMeta(ctx, filePath).then(fileMeta => {

    if (!fileMeta.isTsSourceFile || !fileMeta.isTransformable) {
      return;
    }

    parseTsSrcFile(fileMeta, config, ctx);
  });
}


function isValidDirectory(filePath: string) {
  return filePath.indexOf('node_modules') === -1 || filePath.indexOf('bower_components') === -1;
}
