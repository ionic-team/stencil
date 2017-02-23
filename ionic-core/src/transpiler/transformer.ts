import { TranspileOptions, TranspileContext } from './interfaces';
import { parseTsSrcFile } from './parser';
import { getFile } from './util';
import { compileFileTemplates } from './template-compiler';
import { generateComponentFile } from './generator';


export function transformTsFiles(filePaths: string[], opts: TranspileOptions, ctx: TranspileContext = {}) {
  const promises = filePaths.map(filePath => {
    return transformTsFile(filePath, opts, ctx);
  });

  return Promise.all(promises).then(() => {
    return ctx.files;
  });
}


export function transformTsFile(filePath: string, opts: TranspileOptions, ctx: TranspileContext = {}) {
  if (!ctx.files) {
    ctx.files = new Map();
  }

  return getFile(filePath, opts, ctx).then(file => {
    if (!file.isTsSourceFile || !file.isTransformable) {
      return file;
    }

    if (file.srcTransformedText) {
      return file;
    }

    parseTsSrcFile(file, opts, ctx);

    if (!file.components.length) {
      return file;
    }

    return compileFileTemplates(file, opts, ctx).then(() => {
      generateComponentFile(file, opts, ctx);

      if (file.components) {
        file.components.forEach(c => {
          if (c.errors) {
            c.errors.forEach(console.error);
          }
        });
      }

      return file;
    });
  });
}
