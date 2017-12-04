import { BuildConfig, BuildContext, ModuleFile, TranspileModulesResults } from '../../util/interfaces';
import { normalizePath, isDtsFile, isJsFile, readFile } from '../util';
import * as ts from 'typescript';


export function getTsHost(config: BuildConfig, ctx: BuildContext, tsCompilerOptions: ts.CompilerOptions, transpileResults: TranspileModulesResults) {
  const tsHost = ts.createCompilerHost(tsCompilerOptions);

  tsHost.getSourceFile = (filePath) => {
    const cachedValue = readFromCache(ctx, filePath);
    if (cachedValue != null) {
      return ts.createSourceFile(filePath, cachedValue, ts.ScriptTarget.ES2015);
    }

    const diskValue = readFileFromDisk(config, filePath);
    if (diskValue != null) {
      return ts.createSourceFile(filePath, diskValue, ts.ScriptTarget.ES2015);
    }

    config.logger.error(`tsHost.getSourceFile unable to find ${filePath}`);
    return null;
  };

  tsHost.fileExists = (filePath) => {
    if (isCached(ctx, filePath)) {
      return true;
    }

    return fileExistsOnDisk(config, filePath);
  },

  tsHost.readFile = (filePath) => {
    const cachedValue = readFromCache(ctx, filePath);
    if (cachedValue) {
      return cachedValue;
    }

    const diskValue = readFileFromDisk(config, filePath);
    if (diskValue) {
      return diskValue;
    }

    return null;
  },

  tsHost.writeFile = (outputFilePath: string, outputText: string, writeByteOrderMark: boolean, onError: any, sourceFiles: ts.SourceFile[]): void => {
    sourceFiles.forEach(sourceFile => {
      writeFileInMemory(config, ctx, transpileResults, sourceFile, outputFilePath, outputText);
    });
    writeByteOrderMark; onError;
  };

  return tsHost;
}


function writeFileInMemory(config: BuildConfig, ctx: BuildContext, transpileResults: TranspileModulesResults, sourceFile: ts.SourceFile, outputFilePath: string, outputText: string) {
  const tsFilePath = normalizePath(sourceFile.fileName);
  outputFilePath = normalizePath(outputFilePath);

  if (isJsFile(outputFilePath)) {
    // transpiled file is a js file
    const jsFilePath = outputFilePath;

    let moduleFile = ctx.moduleFiles[tsFilePath];
    if (moduleFile) {
      // we got the module we already cached
      moduleFile.jsFilePath = jsFilePath;

    } else {
      // this actually shouldn't happen, but just in case
      moduleFile = ctx.moduleFiles[tsFilePath] = {
        tsFilePath: tsFilePath,
        jsFilePath: jsFilePath,
      };
    }

    // cache the js content
    ctx.jsFiles[jsFilePath] = outputText;

    // add this module to the list of files that were just transpiled
    transpileResults.moduleFiles[tsFilePath] = moduleFile;

  } else if (isDtsFile(outputFilePath)) {
    // transpiled file is a .d.ts file
    const dtsFilePath = outputFilePath;

    let moduleFile = ctx.moduleFiles[tsFilePath];
    if (moduleFile) {
      // we got the module we already cached
      moduleFile.dtsFilePath = dtsFilePath;

    } else {
      // this actually shouldn't happen, but just in case
      moduleFile = ctx.moduleFiles[tsFilePath] = {
        tsFilePath: tsFilePath,
        dtsFilePath: dtsFilePath,
      };
    }

    // write the .d.ts file
    ctx.filesToWrite[dtsFilePath] = outputText;

    // add this module to the list of files that were just transpiled
    transpileResults.moduleFiles[tsFilePath] = moduleFile;

  } else {
    // idk, this shouldn't happen
    config.logger.debug(`unknown transpiled output: ${outputFilePath}`);
  }
}


/**
 * Check if the given file path exists in cache
 * @param ctx BuildContext
 * @param filePath path to file to check from cache
 */
function isCached(ctx: BuildContext, filePath: string) {
  if (ctx.moduleFiles[filePath] && typeof ctx.moduleFiles[filePath].tsText === 'string') {
    return true;
  }
  return !!ctx.jsFiles[filePath];
}

/**
 * Read the give file path from cache
 * @param ctx BuildContext
 * @param filePath path to file to read from cache
 */
function readFromCache(ctx: BuildContext, filePath: string): string | undefined {
  if (ctx.moduleFiles[filePath] && typeof ctx.moduleFiles[filePath].tsText === 'string') {
    return ctx.moduleFiles[filePath].tsText;
  }
  return ctx.jsFiles[filePath];
}

/**
 * Check if a file exists on disk
 * @param config BuildConfig
 * @param filePath path to file to check existence on disk
 */
function fileExistsOnDisk(config: BuildConfig, filePath: string) {
  try {
    const stat = config.sys.fs.statSync(normalizePath(filePath));
    return stat.isFile();
  } catch {
    return false;
  }
}

/**
 * Read a given file path from disk
 * @param config BuildConfig
 * @param filePath path to file to read from disk
 */
function readFileFromDisk(config: BuildConfig, filePath: string) {
  let fileContents: string | undefined;
  try {
    fileContents = config.sys.fs.readFileSync(normalizePath(filePath), 'utf-8');
  } catch {
    fileContents = undefined;
  }

  return fileContents;
}



export function getModuleFile(config: BuildConfig, ctx: BuildContext, tsFilePath: string): Promise<ModuleFile> {
  tsFilePath = normalizePath(tsFilePath);

  let moduleFile = ctx.moduleFiles[tsFilePath];
  if (moduleFile) {
    if (typeof moduleFile.tsText === 'string') {
      // cool, already have the ts source content
      return Promise.resolve(moduleFile);
    }

    // we have the module, but no source content, let's load it up
    return readFile(config.sys, tsFilePath).then(tsText => {
      moduleFile.tsText = tsText;
      return moduleFile;
    });
  }

  // never seen this ts file before, let's start a new module file
  return readFile(config.sys, tsFilePath).then(tsText => {
    moduleFile = ctx.moduleFiles[tsFilePath] = {
      tsFilePath: tsFilePath,
      tsText: tsText
    };

    return moduleFile;
  });
}
