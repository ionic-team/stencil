import { BuildConfig, BuildContext, ModuleFile, TranspileModulesResults } from '../../util/interfaces';
import { normalizePath, isDtsFile, isJsFile, readFile } from '../util';
import * as ts from 'typescript';


export function getTsHost(config: BuildConfig, ctx: BuildContext, tsCompilerOptions: ts.CompilerOptions, transpileResults: TranspileModulesResults) {
  const tsHost = ts.createCompilerHost(tsCompilerOptions);

  tsHost.getSourceFile = (tsFilePath) => {
    tsFilePath = normalizePath(tsFilePath);

    const module = getModuleFileSync(config, ctx, tsFilePath);
    if (module && typeof module.tsText === 'string') {
      return ts.createSourceFile(tsFilePath, module.tsText, ts.ScriptTarget.ES2015);
    }
    config.logger.error(`tsHost.getSourceFile unable to find ${tsFilePath}`);
    return null;
  };

  tsHost.fileExists = (tsFilePath) => {
    tsFilePath = normalizePath(tsFilePath);

    return moduleFileExistsSync(config, ctx, tsFilePath);
  },

  tsHost.readFile = (tsFilePath) => {
    tsFilePath = normalizePath(tsFilePath);

    let moduleFile = getModuleFileSync(config, ctx, tsFilePath);
    return moduleFile.tsText;
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
    // js file
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
    // .d.ts file
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


export function getModuleFileSync(config: BuildConfig, ctx: BuildContext, tsFilePath: string) {
  tsFilePath = normalizePath(tsFilePath);

  let moduleFile = ctx.moduleFiles[tsFilePath];

  try {
    if (moduleFile) {
      // sweet, we already have this module in our cache!
      if (typeof moduleFile.tsText !== 'string') {
        // we have the module, but no source content, let's load it up
        moduleFile.tsText = config.sys.fs.readFileSync(tsFilePath, 'utf-8');
      }

    } else {
      // never seen this ts file before, let's start a new module file
      moduleFile = ctx.moduleFiles[tsFilePath] = {
        tsFilePath: tsFilePath,
        tsText: config.sys.fs.readFileSync(tsFilePath, 'utf-8')
      };
    }

  } catch (e) {
    moduleFile = ctx.moduleFiles[tsFilePath] = {
      tsFilePath: tsFilePath,
      tsText: null
    };
  }

  return moduleFile;
}


export function moduleFileExistsSync(config: BuildConfig, ctx: BuildContext, tsFilePath: string) {
  let moduleFile = ctx.moduleFiles[tsFilePath];
  if (moduleFile) {
    return (typeof moduleFile.tsText === 'string');
  }

  const module = getModuleFileSync(config, ctx, tsFilePath);
  return (typeof module.tsText === 'string');
}
