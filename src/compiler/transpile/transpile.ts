import { BuildConfig, BuildContext, Diagnostic, ModuleFileMeta, ModuleFiles, StencilSystem, TranspileResults } from '../interfaces';
import { buildError, catchError, isSassSourceFile, normalizePath } from '../util';
import { componentClass } from './transformers/component-class';
import { getTsHost, getTsFileNamesToCompile } from './compiler-host';
import { getUserTsConfig } from './compiler-options';
import { jsxToVNode } from './transformers/jsx-to-vnode';
import { loadTypeScriptDiagnostics } from '../logger/logger-typescript';
import { removeImports } from './transformers/remove-imports';
import { updateLifecycleMethods } from './transformers/update-lifecycle-methods';
import * as ts from 'typescript';


export function transpile(buildConfig: BuildConfig, ctx: BuildContext, moduleFiles: ModuleFiles) {

  const transpileResults: TranspileResults = {
    moduleFiles: {},
    diagnostics: []
  };

  return Promise.resolve().then(() => {

    transpileModules(buildConfig, ctx, moduleFiles, transpileResults);

    if (transpileResults.diagnostics.length) {
      return Promise.resolve([]);
    }

    const transpiledFileNames = Object.keys(transpileResults.moduleFiles);

    return Promise.all(transpiledFileNames.map(transpiledFileName => {
      const moduleFile = transpileResults.moduleFiles[transpiledFileName];
      return processIncludedStyles(buildConfig, ctx, transpileResults.diagnostics, moduleFile);
    }));

  }).catch(err => {
    catchError(transpileResults.diagnostics, err);

  }).then(() => {
    return transpileResults;
  });
}


function transpileModules(buildConfig: BuildConfig, ctx: BuildContext, moduleFiles: ModuleFiles, transpileResults: TranspileResults) {
  const tsOptions = getUserTsConfig(buildConfig, ctx);

  if (ctx.isChangeBuild) {
    moduleFiles = getRebuildModules(moduleFiles);
  }

  if (buildConfig.suppressTypeScriptErrors) {
    tsOptions.options.lib = [];
  }

  const tsHost = getTsHost(buildConfig, ctx, tsOptions.options, transpileResults);

  const tsFileNames = getTsFileNamesToCompile(buildConfig, moduleFiles);

  const program = ts.createProgram(tsFileNames, tsOptions.options, tsHost);

  program.emit(undefined, tsHost.writeFile, undefined, false, {
    before: [
      componentClass(buildConfig, ctx.moduleFiles, transpileResults.diagnostics),
      removeImports(),
      updateLifecycleMethods()
    ],
    after: [
      jsxToVNode(ctx.moduleFiles)
    ]
  });

  ctx.transpileBuildCount = Object.keys(transpileResults.moduleFiles).length;

  if (!buildConfig.suppressTypeScriptErrors) {
    const tsDiagnostics = program.getSyntacticDiagnostics()
      .concat(program.getSemanticDiagnostics(), program.getOptionsDiagnostics());

    loadTypeScriptDiagnostics(buildConfig, transpileResults.diagnostics, tsDiagnostics);
  }
}


function getRebuildModules(moduleFiles: ModuleFiles) {
  const rebuildModuleFiles: ModuleFiles = {};

  const tsFileNames = Object.keys(moduleFiles);
  tsFileNames.forEach(tsFileName => {
    const moduleFile = moduleFiles[tsFileName];

    if (moduleFile.tsFilePath.indexOf('.d.ts') > -1) return;

    if (typeof moduleFile.jsText !== 'string') {
      rebuildModuleFiles[tsFileName] = moduleFile;
    }
  });

  return rebuildModuleFiles;
}


function processIncludedStyles(buildConfig: BuildConfig, ctx: BuildContext, diagnostics: Diagnostic[], moduleFile: ModuleFileMeta) {
  if (ctx.isChangeBuild && !ctx.changeHasSass && !ctx.changeHasCss) {
    // this is a change, but it's not for any styles so don't bother
    return Promise.resolve([]);
  }

  if (!moduleFile.cmpMeta || !moduleFile.cmpMeta.stylesMeta) {
    // module isn't a component or the component doesn't have styles, so don't bother
    return Promise.resolve([]);
  }

  const sys = buildConfig.sys;

  const promises: Promise<any>[] = [];

  const modeNames = Object.keys(moduleFile.cmpMeta.stylesMeta);
  modeNames.forEach(modeName => {
    const modeMeta = moduleFile.cmpMeta.stylesMeta[modeName];

    if (modeMeta.absStylePaths) {
      modeMeta.absStylePaths.forEach(absoluteStylePath => {
        if (isSassSourceFile(absoluteStylePath)) {
          promises.push(
            getIncludedSassFiles(sys, diagnostics, moduleFile, absoluteStylePath)
          );
        }
      });
    }

  });

  return Promise.all(promises);
}


function getIncludedSassFiles(sys: StencilSystem, diagnostics: Diagnostic[], moduleFile: ModuleFileMeta, scssFilePath: string) {
  return new Promise(resolve => {
    scssFilePath = normalizePath(scssFilePath);

    const sassConfig = {
      file: scssFilePath
    };

    moduleFile.includedSassFiles = moduleFile.includedSassFiles || [];

    if (moduleFile.includedSassFiles.indexOf(scssFilePath) === -1) {
      moduleFile.includedSassFiles.push(scssFilePath);
    }

    sys.sass.render(sassConfig, (err, result) => {
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
