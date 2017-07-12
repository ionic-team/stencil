import { BuildConfig, BuildContext, ModuleFileMeta, TranspileResults } from '../interfaces';
import { normalizePath, readFile } from '../util';
import * as ts from 'typescript';


export function getTsHost(buildConfig: BuildConfig, ctx: BuildContext, tsCompilerOptions: ts.CompilerOptions, transpileResults: TranspileResults) {
  const tsHost = ts.createCompilerHost(tsCompilerOptions);

  tsHost.getSourceFile = (tsFilePath) => {
    tsFilePath = normalizePath(tsFilePath);

    const module = getModuleFileSync(buildConfig, ctx, tsFilePath);
    if (module && typeof module.tsText === 'string') {
      return ts.createSourceFile(tsFilePath, module.tsText, ts.ScriptTarget.ES2015);
    }
    buildConfig.logger.error(`tsHost.getSourceFile unable to find ${tsFilePath}`);
    return null;
  };

  tsHost.fileExists = (tsFilePath) => {
    tsFilePath = normalizePath(tsFilePath);

    return moduleFileExistsSync(buildConfig, ctx, tsFilePath);
  },

  tsHost.readFile = (tsFilePath) => {
    tsFilePath = normalizePath(tsFilePath);

    let moduleFile = getModuleFileSync(buildConfig, ctx, tsFilePath);
    return moduleFile.tsText;
  },

  tsHost.writeFile = (jsFilePath: string, jsText: string, writeByteOrderMark: boolean, onError: any, sourceFiles: ts.SourceFile[]): void => {
    sourceFiles.forEach(sourceFile => {
      const tsFilePath = normalizePath(sourceFile.fileName);
      jsFilePath = normalizePath(jsFilePath);

      let moduleFile = ctx.moduleFiles[tsFilePath];
      if (moduleFile) {
        // we got the module we already cached
        moduleFile.jsFilePath = jsFilePath;
        moduleFile.jsText = jsText;

      } else {
        // this actually shouldn't happen, but just in case
        moduleFile = ctx.moduleFiles[tsFilePath] = {
          tsFilePath: tsFilePath,
          jsFilePath: jsFilePath,
          jsText: jsText
        };
      }

      if (moduleFile.cmpMeta) {
        // if this module has component meta data, then
        // also update the component meta's component path
        // which should be an absolute url to the compiled js output file
        moduleFile.cmpMeta.componentPath = jsFilePath;
      }

      // add this module to the list of files that were just transpiled
      transpileResults.moduleFiles[tsFilePath] = moduleFile;
    });
    writeByteOrderMark; onError;
  };

  return tsHost;
}


export function getModuleFile(buildConfig: BuildConfig, ctx: BuildContext, tsFilePath: string): Promise<ModuleFileMeta> {
  tsFilePath = normalizePath(tsFilePath);

  let moduleFile = ctx.moduleFiles[tsFilePath];
  if (moduleFile) {
    if (typeof moduleFile.tsText === 'string') {
      // cool, already have the ts source content
      return Promise.resolve(moduleFile);
    }

    // we have the module, but no source content, let's load it up
    return readFile(buildConfig.sys, tsFilePath).then(tsText => {
      moduleFile.tsText = tsText;
      return moduleFile;
    });
  }

  // never seen this ts file before, let's start a new module file
  return readFile(buildConfig.sys, tsFilePath).then(tsText => {
    moduleFile = ctx.moduleFiles[tsFilePath] = {
      tsFilePath: tsFilePath,
      tsText: tsText
    };

    return moduleFile;
  });
}


export function getModuleFileSync(buildConfig: BuildConfig, ctx: BuildContext, tsFilePath: string) {
  tsFilePath = normalizePath(tsFilePath);

  let moduleFile = ctx.moduleFiles[tsFilePath];

  try {
    if (moduleFile) {
      // sweet, we already have this module in our cache!
      if (typeof moduleFile.tsText !== 'string') {
        // we have the module, but no source content, let's load it up
        moduleFile.tsText = buildConfig.sys.fs.readFileSync(tsFilePath, 'utf-8');
      }

    } else {
      // never seen this ts file before, let's start a new module file
      moduleFile = ctx.moduleFiles[tsFilePath] = {
        tsFilePath: tsFilePath,
        tsText: buildConfig.sys.fs.readFileSync(tsFilePath, 'utf-8')
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


export function moduleFileExistsSync(buildConfig: BuildConfig, ctx: BuildContext, tsFilePath: string) {
  let moduleFile = ctx.moduleFiles[tsFilePath];
  if (moduleFile) {
    return (typeof moduleFile.tsText === 'string');
  }

  const module = getModuleFileSync(buildConfig, ctx, tsFilePath);
  return (typeof module.tsText === 'string');
}
