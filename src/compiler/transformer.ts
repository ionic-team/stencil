import { FileMeta, CompilerOptions, CompilerContext } from './interfaces';
import { parseTsSrcFile } from './parser';
import { isTsSourceFile, isTransformable, readFile } from './util';
import { preprocessStyles } from './styles';
import * as fs from 'fs';
import * as path from 'path';


export function transformTsFiles(opts: CompilerOptions, ctx: CompilerContext = {}): Promise<Map<string, FileMeta>> {
  return transformDirectory(opts.srcDir, opts, ctx).then(() => {
    return ctx.files;
  });
}


export function transformTsFile(filePath: string, opts: CompilerOptions, ctx: CompilerContext = {}) {
  if (!ctx.files) {
    ctx.files = new Map();
  }

  return getFile(filePath, opts, ctx).then(file => {
    return transformFile(file, opts, ctx);
  });
}


export function transformTsFileSync(filePath: string, opts: CompilerOptions, ctx: CompilerContext = {}) {
  if (!ctx.files) {
    ctx.files = new Map();
  }

  const file = getFileSync(filePath, opts, ctx);
  return transformFile(file, opts, ctx);
}


function transformFile(file: FileMeta, opts: CompilerOptions, ctx: CompilerContext) {
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

  preprocessStyles(file, opts, ctx);

  return file;
}


function transformDirectory(dir: string, opts: CompilerOptions, ctx: CompilerContext) {
  return new Promise((resolve) => {

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

        if (fs.statSync(readPath).isDirectory()) {
          promises.push(transformDirectory(readPath, opts, ctx));

        } else if (isTsSourceFile(readPath)) {
          promises.push(transformTsFile(readPath, opts, ctx));
        }
      });

      Promise.all(promises).then(() => {
        resolve();
      });
    });

  });
}


export function getFile(filePath: string, opts: CompilerOptions, ctx: CompilerContext): Promise<FileMeta> {
  if (opts.cacheFiles !== false) {
    const file = ctx.files.get(filePath);
    if (file) {
      return Promise.resolve(file);
    }
  }

  return readFile(filePath).then(srcText => {
    return createFileMeta(filePath, srcText, opts, ctx);
  });
}


export function getFileSync(filePath: string, opts: CompilerOptions, ctx: CompilerContext) {
  if (opts.cacheFiles !== false) {
    const file = ctx.files.get(filePath);
    if (file) {
      return file;
    }
  }

  return createFileMeta(filePath, fs.readFileSync(filePath, 'utf8'), opts, ctx);
}


function createFileMeta(filePath: string, srcText: string, opts: CompilerOptions, ctx: CompilerContext) {
  const file: FileMeta = {
    filePath: filePath,
    srcText: srcText,
    isTsSourceFile: isTsSourceFile(filePath),
    isTransformable: false,
    components: []
  };

  if (file.isTsSourceFile) {
    file.isTransformable = isTransformable(file.srcText);
  }

  if (opts.cacheFiles !== false) {
    ctx.files.set(filePath, file);
  }

  return file;
}


function isValidDirectory(filePath: string) {
  return filePath.indexOf('node_modules') === -1;
}

