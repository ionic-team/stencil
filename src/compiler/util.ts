import { BuildContext, CompilerConfig, FileMeta, Packages, Results } from './interfaces';


export function getFileMeta(config: CompilerConfig, ctx: BuildContext, filePath: string): Promise<FileMeta> {
  const fileMeta = ctx.files.get(filePath);
  if (fileMeta) {
    return Promise.resolve(fileMeta);
  }

  return readFile(config.packages, filePath).then(srcText => {
    return createFileMeta(config, ctx, filePath, srcText);
  });
}


export function createFileMeta(config: CompilerConfig, ctx: BuildContext, filePath: string, srcText: string) {
  const fileMeta: FileMeta = {
    fileName: config.packages.path.basename(filePath),
    filePath: filePath,
    fileExt: config.packages.path.extname(filePath),
    srcDir: config.packages.path.dirname(filePath),
    srcText: srcText,
    jsFilePath: null,
    jsText: null,
    isTsSourceFile: isTsSourceFile(filePath),
    hasCmpClass: false,
    cmpMeta: null,
    cmpClassName: null
  };

  if (fileMeta.isTsSourceFile) {
    fileMeta.hasCmpClass = hasCmpClass(config, fileMeta.srcText, fileMeta.filePath);
  }

  ctx.files.set(filePath, fileMeta);

  return fileMeta;
}


export function readFile(packages: Packages, filePath: string) {
  return new Promise<string>((resolve, reject) => {
    packages.fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}


export function writeFile(packages: Packages, filePath: string, content: string) {
  return new Promise((resolve, reject) => {
    packages.fs.writeFile(filePath, content, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}


export function copyFile(packages: Packages, src: string, dest: string) {
  return readFile(packages, src).then(content => {
    return writeFile(packages, dest, content);
  });
}


export function writeFiles(packages: Packages, files: Map<string, string>) {
  const paths: string[] = [];

  files.forEach((content, filePath) => {
    content;
    paths.push(filePath);
  });

  return ensureDirs(packages, paths).then(() => {
    const promises: Promise<any>[] = [];

    files.forEach((content, filePath) => {
      promises.push(writeFile(packages, filePath, content));
    });

    return Promise.all(promises);
  });
}


export function ensureDirs(packages: Packages, paths: string[]) {
  const path = packages.path;
  const fs = packages.fs;

  let checkDirs: string[] = [];

  paths.forEach(p => {
    const dir = path.dirname(p);
    if (checkDirs.indexOf(dir) === -1) {
      checkDirs.push(dir);
    }
  });

  checkDirs = checkDirs.sort((a, b) => {
    if (a.split(path.sep).length < b.split(path.sep).length) {
      return -1;
    }
    if (a.split(path.sep).length > b.split(path.sep).length) {
      return 1;
    }
    if (a.length < b.length) {
      return -1;
    }
    if (a.length > b.length) {
      return 1;
    }
    if (a < b) {
      return -1;
    }
    if (a > b) {
      return 1;
    }
    return 0;
  });

  const dirExists = new Set();

  return new Promise((resolve, reject) => {

    function checkDir(resolve: Function) {
      const dir = checkDirs.shift();
      if (!dir) {
        resolve();
        return;
      }

      var chunks = dir.split(path.sep);

      checkChunk(chunks, 0, resolve);
    }

    function checkChunk(chunks: string[], appendIndex: number, resolve: Function) {
      if (appendIndex >= chunks.length - 1) {
        checkDir(resolve);
        return;
      }

      const dir = chunks.slice(0, appendIndex + 2).join(path.sep);

      if (dirExists.has(dir)) {
        checkChunk(chunks, ++appendIndex, resolve);
        return;
      }

      fs.access(dir, err => {
        if (err) {
          // no access
          fs.mkdir(dir, err => {
            if (err) {
              reject(err);

            } else {
              checkChunk(chunks, ++appendIndex, resolve);
            }
          });

        } else {
          // has access
          dirExists.add(dir);
          checkChunk(chunks, ++appendIndex, resolve);
        }
      });
    }

    checkDir(resolve);
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


export function hasCmpClass(config: CompilerConfig, sourceText: string, filePath: string) {
  if (sourceText.indexOf('@Component') === -1) {
    return false;
  }

  if (sourceText.indexOf('@angular/core') > -1) {
    if (config.debug) {
      console.log(`compile, skipping @angular/core component: ${filePath}`);
    }
    return false;
  }

  return true;
}


export function logError(results: Results, msg: any) {
  results.errors = results.errors || [];
  results.errors.push(msg);

  return results;
}
