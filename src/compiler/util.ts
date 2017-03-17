import { CompilerOptions, CompilerContext } from './interfaces';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as ts from 'typescript';


export function isTsSourceFile(filePath: string) {
  const parts = filePath.toLowerCase().split('.');
  if (parts.length > 1) {
    if (parts[parts.length - 1] === 'ts') {
      if (parts.length > 2 && parts[parts.length - 2] === 'd') {
        return false;
      }
    }
    return true;
  }
  return false;
}


export function isTransformable(sourceText: string) {
  return (sourceText.indexOf('@Component') > -1);
}


export function readFile(filePath: string): Promise<string> {
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


export function writeTranspiledFiles(transpiledFiles: Map<string, string>, opts: CompilerOptions, ctx: CompilerContext): Promise<null> {
  const writeTranspiledFilesToDisk = false;

  if (writeTranspiledFilesToDisk) {
    ensureDirectories(transpiledFiles);
  }

  const writePromises: Promise<any>[] = [];

  transpiledFiles.forEach((transpileText, filePath) => {
    if (opts.cacheFiles !== false) {
      let file = ctx.files.get(filePath);

      if (!file) {
        file = {
          filePath: filePath,
          srcText: transpileText,
          isTsSourceFile: isTsSourceFile(filePath),
          isTransformable: false,
          components: []
        };
        ctx.files.set(filePath, file);
      }

      file.transpileText = transpileText;
    }

    if (writeTranspiledFilesToDisk) {
      writePromises.push(writeFile(filePath, transpileText));
    }
  })

  return Promise.all(writePromises);
}


export function emptyDir(dirPath: string) {
  return new Promise((resolve, reject) => {

    fs.emptyDir(dirPath, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });

  });
}


export function writeFile(filePath: string, data: string): Promise<null> {
  return new Promise((resolve, reject) => {
    if (!path.isAbsolute(filePath)) {
      reject(`absolute file path required: ${filePath}`);
      return;
    }

    fs.writeFile(filePath, data, (err) => {
      if (err) {
        reject(err);

      } else {
        resolve();
      }
    });
  });
}


export function ensureDirectories(files: Map<string, string>) {
  let dirPaths: string[] = [];

  files.forEach((content, filePath) => {
    content;
    const dirPath = path.dirname(filePath);
    if (dirPaths.indexOf(dirPath) === -1) {
      dirPaths.push(dirPath);
    }
  });

  dirPaths.forEach(dirPath => {
    recursiveCreateDirectory(dirPath);
  });
}


function recursiveCreateDirectory(dirPath: string) {
  var basePath = path.dirname(dirPath);
  var shouldCreateParent = dirPath !== basePath && !dirExists(basePath);
  if (shouldCreateParent) {
    recursiveCreateDirectory(basePath);
  }
  if (shouldCreateParent || !dirExists(dirPath)) {
    fs.mkdirSync(dirPath);
  }
}


function dirExists(dirPath: string) {
  try {
    fs.accessSync(dirPath);
  } catch (e) {
    return false;
  }
  return true;
}


export function getTsScriptTarget(str: string) {
  if (str === 'es5') {
    return ts.ScriptTarget.ES5
  }

  return ts.ScriptTarget.ES2015
}


export function getTsModule(str: string) {
  if (str === 'common') {
    return ts.ModuleKind.CommonJS;
  }

  return ts.ModuleKind.ES2015;
}
