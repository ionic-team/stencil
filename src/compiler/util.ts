import { BuildContext, FileMeta, Packages, Results } from './interfaces';


export function getFileMeta(packages: Packages, ctx: BuildContext, filePath: string): Promise<FileMeta> {
  const fileMeta = ctx.files.get(filePath);
  if (fileMeta) {
    return Promise.resolve(fileMeta);
  }

  return readFile(packages, filePath).then(srcText => {
    return createFileMeta(packages, ctx, filePath, srcText);
  });
}


export function createFileMeta(packages: Packages, ctx: BuildContext, filePath: string, srcText: string) {
  ctx.files = ctx.files || new Map();

  let fileMeta = ctx.files.get(filePath);
  if (!fileMeta) {
    fileMeta = {
      fileName: packages.path.basename(filePath),
      filePath: filePath,
      fileExt: packages.path.extname(filePath),
      srcDir: packages.path.dirname(filePath),
      srcText: srcText,
      jsFilePath: null,
      jsText: null,
      isTsSourceFile: isTsSourceFile(filePath),
      isScssSourceFile: isScssSourceFile(filePath),
      hasCmpClass: false,
      cmpMeta: null,
      cmpClassName: null,
      isWatching: false,
      recompileOnChange: false,
      rebundleOnChange: false,
      transpiledCount: 0
    };

    ctx.files.set(filePath, fileMeta);
  }

  if (fileMeta.isTsSourceFile) {
    fileMeta.hasCmpClass = hasCmpClass(fileMeta.srcText, fileMeta.filePath);
  }

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
    if (parts[parts.length - 1] === 'ts' || parts[parts.length - 1] === 'tsx') {
      if (parts.length > 2 && parts[parts.length - 2] === 'd') {
        return false;
      }
      return true;
    }
  }
  return false;
}

export function isScssSourceFile(filePath: string) {
  const parts = filePath.toLowerCase().split('.');
  if (parts.length > 1) {
    return (parts[parts.length - 1] === 'scss');
  }
  return false;
}


export function hasCmpClass(sourceText: string, filePath: string) {
  if (sourceText.indexOf('@Component') === -1) {
    return false;
  }

  if (sourceText.indexOf('@angular/core') > -1) {
    console.log(`compile, skipping @angular/core component: ${filePath}`);
    return false;
  }

  return true;
}


export function logError(results: Results, msg: any) {
  results.errors = results.errors || [];
  results.errors.push(msg);

  return results;
}
