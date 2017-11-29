import addMetadataExport from './transformers/add-metadata-export';
import { BuildConfig, BuildContext, Diagnostic, ModuleFile, ModuleFiles, TranspileModulesResults, TranspileResults } from '../../util/interfaces';
import { buildError, catchError, isSassFile, normalizePath, hasError } from '../util';
import { getTsHost } from './compiler-host';
import { getUserTsConfig } from './compiler-options';
import { updateFileMetaFromSlot, updateModuleFileMetaFromSlot } from './transformers/vnode-slots';
import { loadTypeScriptDiagnostics } from '../../util/logger/logger-typescript';
import { removeImports } from './transformers/remove-imports';
import { removeDecorators } from './transformers/remove-decorators';
import { normalizeAssetsDir } from '../component-plugins/assets-plugin';
import { normalizeStyles } from './normalize-styles';
import renameLifecycleMethods from './transformers/rename-lifecycle-methods';
import { gatherMetadata } from './datacollection/index';
import { generateComponentTypesFile } from './create-component-types';
import * as ts from 'typescript';

export function transpileFiles(config: BuildConfig, ctx: BuildContext, moduleFiles: ModuleFiles) {

  const transpileResults: TranspileModulesResults = {
    moduleFiles: {}
  };

  return Promise.resolve().then(() => {
    // transpiling is synchronous
    transpileModules(config, ctx, moduleFiles, transpileResults);

    if (hasError(ctx.diagnostics)) {
      // looks like we've got some transpile errors
      // let's not continue with processing included styles
      return Promise.resolve([]);
    }

    // get a list of all the files names that were transpiled
    const transpiledFileNames = Object.keys(transpileResults.moduleFiles);

    return Promise.all(transpiledFileNames.map(transpiledFileName => {
      const moduleFile = transpileResults.moduleFiles[transpiledFileName];
      return processIncludedStyles(config, ctx, moduleFile);
    }));

  }).catch(err => {
    catchError(ctx.diagnostics, err);

  }).then(() => {
    return transpileResults;
  });
}

/**
 * This is only used during TESTING
 */
export function transpileModule(config: BuildConfig, input: string, compilerOptions?: any, path?: string) {
  config;
  const fileMeta: ModuleFile = {
    tsFilePath: path || 'transpileModule.tsx'
  };
  const diagnostics: Diagnostic[] = [];
  const results: TranspileResults = {
    code: null,
    diagnostics: null,
    cmpMeta: null
  };

  const transpileOpts = {
    compilerOptions: compilerOptions,
    transformers: {
      before: [
        removeImports(),
        removeDecorators(),
        renameLifecycleMethods(),
        addMetadataExport(fileMeta)
      ],
      after: [
        updateModuleFileMetaFromSlot(fileMeta)
      ]
    }
  };

  const tsResults = ts.transpileModule(input, transpileOpts);

  loadTypeScriptDiagnostics('', diagnostics, tsResults.diagnostics);

  if (diagnostics.length) {
    results.diagnostics = diagnostics;
  }

  results.code = tsResults.outputText;
  results.cmpMeta = fileMeta.cmpMeta;

  return results;
}

function transpileModules(config: BuildConfig, ctx: BuildContext, moduleFiles: ModuleFiles, transpileResults: TranspileModulesResults) {
  if (ctx.isChangeBuild) {
    // if this is a change build, then narrow down
    moduleFiles = getChangeBuildModules(ctx, moduleFiles);
  }

  const tsFileNames = Object.keys(moduleFiles);

  if (!tsFileNames.length) {
    // don't bother if there are no ts files to transpile
    return;
  }

  // fire up the typescript program
  let timespace = config.logger.createTimeSpan('transpile es2015 start', true);

  // get the tsconfig compiler options we'll use
  const tsOptions = getUserTsConfig(config);

  if (config.suppressTypeScriptErrors) {
    // suppressTypeScriptErrors mainly for unit testing
    tsOptions.lib = [];
  }

  // get the ts compiler host we'll use, which patches file operations
  // with our in-memory file system
  const tsHost = getTsHost(config, ctx, tsOptions, transpileResults);

  // fire up the typescript program
  const checkProgram = ts.createProgram(tsFileNames, tsOptions, tsHost);

  // Gather component metadata and type info
  const metadata = gatherMetadata(checkProgram.getTypeChecker(), checkProgram.getSourceFiles());

  Object.keys(metadata).forEach(tsFilePath => {
    ctx.moduleFiles[tsFilePath].cmpMeta = metadata[tsFilePath];
    ctx.moduleFiles[tsFilePath].cmpMeta.stylesMeta = normalizeStyles(config, tsFilePath, metadata[tsFilePath].stylesMeta);
    ctx.moduleFiles[tsFilePath].cmpMeta.assetsDirsMeta = normalizeAssetsDir(config, tsFilePath, metadata[tsFilePath].assetsDirsMeta);
  });

  // Generate d.ts files for component types
  const [ componentsFilePath, componentsFileContent ] = generateComponentTypesFile(config, metadata);
  if (ctx.appFiles.components_d_ts !== componentsFileContent) {
    // the components.d.ts file is unchanged, no need to resave
    config.sys.fs.writeFileSync(componentsFilePath, componentsFileContent, { encoding: 'utf8' });
    ctx.moduleFiles[componentsFilePath] = {
      tsFilePath: componentsFilePath,
      tsText: componentsFileContent
    };
  }

  // cache this for rebuilds to avoid unnecessary writes
  ctx.appFiles.components_d_ts = componentsFileContent;

  const program = ts.createProgram(tsFileNames, tsOptions, tsHost, checkProgram);

  transpileProgram(program, tsHost, config, ctx, transpileResults);
  timespace.finish(`transpile es2015 finished`);
}


function transpileProgram(program: ts.Program, tsHost: ts.CompilerHost, config: BuildConfig, ctx: BuildContext, transpileResults: TranspileModulesResults) {

  // this is the big one, let's go ahead and kick off the transpiling
  program.emit(undefined, tsHost.writeFile, undefined, false, {
    before: [
      removeDecorators(),
      removeImports(),
      renameLifecycleMethods()
    ],
    after: [
      updateFileMetaFromSlot(ctx.moduleFiles)
    ]
  });

  // keep track of how many files we transpiled (great for debugging/testing)
  ctx.transpileBuildCount = Object.keys(transpileResults.moduleFiles).length;

  if (!config.suppressTypeScriptErrors) {
    // suppressTypeScriptErrors mainly for unit testing
    const tsDiagnostics: ts.Diagnostic[] = [];
    program.getSyntacticDiagnostics().forEach(d => tsDiagnostics.push(d));
    program.getSemanticDiagnostics().forEach(d => tsDiagnostics.push(d));
    program.getOptionsDiagnostics().forEach(d => tsDiagnostics.push(d));

    loadTypeScriptDiagnostics(config.rootDir, ctx.diagnostics, tsDiagnostics);
  }
}


function getChangeBuildModules(ctx: BuildContext, moduleFiles: ModuleFiles) {
  const changeModuleFiles: ModuleFiles = {};

  const tsFileNames = Object.keys(moduleFiles);
  tsFileNames.forEach(tsFileName => {
    const moduleFile = moduleFiles[tsFileName];

    if (moduleFile.tsFilePath.indexOf('.d.ts') > -1) {
      // don't bother for d.ts files
      return;
    }

    if (typeof ctx.jsFiles[moduleFile.jsFilePath] !== 'string') {
      // only add it to our collection when there is no jsText
      changeModuleFiles[tsFileName] = moduleFile;
    }
  });

  return changeModuleFiles;
}


function processIncludedStyles(config: BuildConfig, ctx: BuildContext, moduleFile: ModuleFile) {
  if (ctx.isChangeBuild && !ctx.changeHasSass && !ctx.changeHasCss) {
    // this is a change, but it's not for any styles so don't bother
    return Promise.resolve([]);
  }

  if (!moduleFile.cmpMeta || !moduleFile.cmpMeta.stylesMeta) {
    // module isn't a component or the component doesn't have styles, so don't bother
    return Promise.resolve([]);
  }

  const promises: Promise<any>[] = [];

  // loop through each of the style paths and see if there are any sass files
  // for each sass file let's figure out which source sass files it uses
  const modeNames = Object.keys(moduleFile.cmpMeta.stylesMeta);
  modeNames.forEach(modeName => {
    const modeMeta = moduleFile.cmpMeta.stylesMeta[modeName];

    if (modeMeta.absolutePaths) {
      modeMeta.absolutePaths.forEach(absoluteStylePath => {
        if (isSassFile(absoluteStylePath)) {
          // this componet mode has a sass file, let's see which
          // sass files are included in it
          promises.push(
            getIncludedSassFiles(config, ctx.diagnostics, moduleFile, absoluteStylePath)
          );
        }
      });
    }

  });

  return Promise.all(promises);
}


function getIncludedSassFiles(config: BuildConfig, diagnostics: Diagnostic[], moduleFile: ModuleFile, scssFilePath: string) {
  return new Promise(resolve => {
    scssFilePath = normalizePath(scssFilePath);

    const sassConfig = {
      ...config.sassConfig,
      file: scssFilePath
    };

    moduleFile.includedSassFiles = moduleFile.includedSassFiles || [];

    if (moduleFile.includedSassFiles.indexOf(scssFilePath) === -1) {
      moduleFile.includedSassFiles.push(scssFilePath);
    }

    config.sys.sass.render(sassConfig, (err, result) => {
      if (err) {
        const d = buildError(diagnostics);
        d.messageText = err.message;
        d.absFilePath = err.file;

      } else if (result.stats && result.stats.includedFiles) {
        result.stats.includedFiles.forEach((includedFile: string) => {
          includedFile = normalizePath(includedFile);

          if (moduleFile.includedSassFiles.indexOf(includedFile) === -1) {
            moduleFile.includedSassFiles.push(includedFile);
          }
        });
      }

      resolve();
    });

  });
}
