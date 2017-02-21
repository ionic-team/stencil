import { FileMeta, TranspileOptions, TranspileContext, TsConfig } from './interfaces';
import { BuildError, runTypeScriptDiagnostics, printDiagnostics } from './logger';
import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';


export function getFile(filePath: string, opts: TranspileOptions, ctx: TranspileContext): Promise<FileMeta> {
  if (opts.cacheFiles !== false) {
    const fileContent = ctx.files.get(filePath);
    if (fileContent) {
      return Promise.resolve(fileContent);
    }
  }

  return readFile(filePath).then(srcText => {
    const file: FileMeta = {
      filePath: filePath,
      srcText: srcText,
      isTsSourceFile: isTsSourceFile(filePath),
      isTransformable: false,
      components: []
    };

    if (file.isTsSourceFile) {
      file.isTransformable = isTransformable(srcText);
    }

    if (opts.cacheFiles !== false) {
      ctx.files.set(filePath, file);
    }
    return file;
  });
}


function isTsSourceFile(filePath: string) {
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


function isTransformable(sourceText: string) {
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


export function writeTranspiledFiles(transpiledFiles: Map<string, string>, opts: TranspileOptions, ctx: TranspileContext): Promise<null> {
  const writeTranspiledFilesToDisk = (opts.writeTranspiledFilesToDisk === true);

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


export function getTsConfig(opts: TranspileOptions, ctx: TranspileContext): TsConfig {
  if (ctx.tsConfig) {
    return ctx.tsConfig;
  }

  if (!opts.tsConfigPath) {
    opts.tsConfigPath = path.join(opts.srcDir, 'tsconfig.json');
  }

  const tsConfigFile = ts.readConfigFile(opts.tsConfigPath, path => fs.readFileSync(path, 'utf8'));

  if (!tsConfigFile) {
    throw new BuildError(`tsconfig: invalid tsconfig file, "${opts.tsConfigPath}"`);

  } else if (tsConfigFile.error && tsConfigFile.error.messageText) {
    throw new BuildError(`tsconfig: ${tsConfigFile.error.messageText}`);

  } else if (!tsConfigFile.config) {
    throw new BuildError(`tsconfig: invalid config, "${opts.tsConfigPath}""`);
  }

  const parsedConfig = ts.parseJsonConfigFileContent(
                              tsConfigFile.config,
                              ts.sys, opts.srcDir,
                              {}, opts.tsConfigPath);

  const diagnostics = runTypeScriptDiagnostics(ctx, parsedConfig.errors);

  if (diagnostics.length) {
    printDiagnostics(diagnostics);
    throw new BuildError();
  }

  ctx.tsConfig = {
    options: parsedConfig.options,
    fileNames: parsedConfig.fileNames,
    raw: parsedConfig.raw
  };

  return ctx.tsConfig;
}
