import { BuildContext, CompilerConfig, FileMeta, Packages, Results } from './interfaces';


export function getFileMeta(config: CompilerConfig, ctx: BuildContext, filePath: string): Promise<FileMeta> {
  const fileMeta = ctx.files.get(filePath);
  if (fileMeta) {
    return Promise.resolve(fileMeta);
  }

  return readFile(config.packages, filePath).then(srcText => {
    return createFileMeta(config.packages, ctx, filePath, srcText);
  });
}


export function createFileMeta(packages: Packages, ctx: BuildContext, filePath: string, srcText: string) {
  const fileMeta: FileMeta = {
    fileName: packages.path.basename(filePath),
    filePath: filePath,
    fileExt: packages.path.extname(filePath),
    srcDir: packages.path.dirname(filePath),
    srcText: srcText,
    srcTextWithoutDecorators: null,
    jsFilePath: null,
    jsText: null,
    isTsSourceFile: isTsSourceFile(filePath),
    isTransformable: false,
    cmpMeta: null
  };

  if (fileMeta.isTsSourceFile) {
    fileMeta.isTransformable = isTransformable(fileMeta.srcText);
  }

  ctx.files.set(filePath, fileMeta);

  return fileMeta;
}


export function readFile(packages: Packages, filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
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
    mkdir(packages, packages.path.dirname(filePath), () => {
      packages.fs.writeFile(filePath, content, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });
}


export function copyFile(packages: Packages, src: string, dest: string) {
  return readFile(packages, src).then(content => {
    return writeFile(packages, dest, content);
  });
}


export function mkdir(packages: Packages, root: string, callback: Function) {
  var chunks = root.split(packages.path.sep); // split in chunks
  var chunk;

  if (packages.path.isAbsolute(root) === true) { // build from absolute path
    chunk = chunks.shift(); // remove "/" or C:/
    if (!chunk) { // add "/"
      chunk = packages.path.sep;
    }

  } else {
    chunk = packages.path.resolve(); // build with relative path
  }

  return mkdirRecursive(packages, chunk, chunks, callback);
}


function mkdirRecursive(packages: Packages, root: string, chunks: string[], callback: Function): void {
  var chunk = chunks.shift();
  if (!chunk) {
    return callback(null);
  }

  var root = packages.path.join(root, chunk);

  return packages.fs.exists(root, (exists) => {

    if (exists === true) { // already done
      return mkdirRecursive(packages, root, chunks, callback);
    }
    return packages.fs.mkdir(root, (err) => {

      if (err) {
        return callback(err);
      }
      return mkdirRecursive(packages, root, chunks, callback); // let's magic
    });
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


export function isTransformable(sourceText: string) {
  return (sourceText.indexOf('@Component') > -1);
}


export function logError(results: Results, msg: any) {
  results.errors = results.errors || [];
  results.errors.push(msg);

  return results;
}
