import { BuildConfig, BuildContext, ModuleFileMeta, TranspileResults } from '../interfaces';
import { loadTypeScriptDiagnostics } from '../logger/logger-typescript';
import { normalizePath, readFile } from '../util';
import * as ts from 'typescript';


export function getUserTsConfig(buildConfig: BuildConfig, ctx: BuildContext, transpileResults: TranspileResults): { options: ts.CompilerOptions } {
  if (ctx.userTsConfig) {
    // already created the tsconfig object, let's use that
    return ctx.userTsConfig;
  }

  const sys = buildConfig.sys;

  // create where we'll find the user's tsconfig.json file
  const tsConfigPath = sys.path.join(buildConfig.rootDir, 'tsconfig.json');
  buildConfig.logger.debug(`ts config: ${tsConfigPath}`);

  // load up the user tsconfig file
  const tsConfigFile = ts.readConfigFile(tsConfigPath, path => sys.fs.readFileSync(path, 'utf8'));

  // check for major errors
  if (!tsConfigFile) {
    throw new Error(`tsconfig: invalid tsconfig file, "${tsConfigPath}"`);

  } else if (tsConfigFile.error && tsConfigFile.error.messageText) {
    throw new Error(`tsconfig: ${tsConfigFile.error.messageText}`);

  } else if (!tsConfigFile.config) {
    throw new Error(`tsconfig: invalid config, "${tsConfigPath}""`);
  }

  // parse the user's tsconfig
  const tsConfig = ts.parseJsonConfigFileContent(
    tsConfigFile.config,
    ts.sys, buildConfig.rootDir,
    {}, tsConfigPath);

  // load any errors it may have had into our diagnostics
  if (tsConfig.errors) {
    loadTypeScriptDiagnostics(buildConfig, transpileResults.diagnostics, tsConfig.errors);
  }

  // force defaults
  // must always allow decorators
  tsConfig.options.experimentalDecorators = true;

  // for es5 transpile
  tsConfig.options.target = ts.ScriptTarget.ES5;

  // resolve using NodeJs style
  tsConfig.options.moduleResolution = ts.ModuleResolutionKind.NodeJs;

  // this does not write anything to
  // disk so there is no need to verify that there
  // are no conflicts between input and output paths
  tsConfig.options.suppressOutputPathCheck = true;

  // apply user config to tsconfig
  tsConfig.options.outDir = buildConfig.collectionDest;
  tsConfig.options.rootDir = buildConfig.src;

  if (buildConfig.devMode) {
    // for dev builds let's not create d.ts files
    tsConfig.options.declaration = undefined;
  }

  // cache for later
  ctx.userTsConfig = {
    options: tsConfig.options,
    fileNames: tsConfig.fileNames,
    raw: tsConfig.raw
  };

  return ctx.userTsConfig;
}


export function getTsHost(buildConfig: BuildConfig, ctx: BuildContext, tsCompilerOptions: ts.CompilerOptions) {
  // let's start a new tsFiles object to cache all the transpiled files in
  const tsHost = ts.createCompilerHost(tsCompilerOptions);

  tsHost.fileExists = (tsFilePath) => {
    tsFilePath = normalizePath(tsFilePath);

    const moduleFile = getModuleFileSync(buildConfig, ctx, tsFilePath);
    return (moduleFile && typeof moduleFile.tsText === 'string');
  };

  tsHost.readFile = (tsFilePath) => {
    const moduleFile = getModuleFileSync(buildConfig, ctx, tsFilePath);
    return moduleFile.tsText;
  };

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
    });
    writeByteOrderMark; onError;
  };

  return tsHost;
}


export function getTsCompilerRootNames(buildConfig: BuildConfig, entryPath: string) {
  const rootNames = buildConfig.sys.getCompilerTypes();
  rootNames.push(entryPath);
  return rootNames;
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
        const tsText = buildConfig.sys.fs.readFileSync(tsFilePath, 'utf-8');
        moduleFile.tsText = tsText;
      }

    } else {
      // never seen this ts file before, let's start a new module file
      moduleFile = ctx.moduleFiles[tsFilePath] = {
        tsFilePath: tsFilePath,
        tsText: buildConfig.sys.fs.readFileSync(tsFilePath, 'utf-8')
      };
    }

  } catch (e) {
    buildConfig.logger.debug(e);
  }

  return moduleFile;
}
