import { BuildConfig, BuildContext, Diagnostic, ModuleFileMeta, StencilSystem, TranspileResults } from '../interfaces';
import { buildError, catchError, isSassSourceFile, normalizePath } from '../util';
import { componentClass } from './transformers/component-class';
import { getTsHost, getModuleFile, getTsCompilerRootNames, getUserTsConfig } from './transpile-util';
import { jsxToVNode } from './transformers/jsx-to-vnode';
import { loadTypeScriptDiagnostics } from '../logger/logger-typescript';
import { removeImports } from './transformers/remove-imports';
import { updateLifecycleMethods } from './transformers/update-lifecycle-methods';
import * as ts from 'typescript';


export function transpile(buildConfig: BuildConfig, ctx: BuildContext, tsFilePath: string) {
  tsFilePath = normalizePath(tsFilePath);

  const transpileResults: TranspileResults = {
    moduleFiles: {},
    diagnostics: []
  };

  return getModuleFile(buildConfig, ctx, tsFilePath).then(moduleFile => {
    if (ctx.isChangeBuild && !ctx.changeHasComponentModules && !ctx.changeHasNonComponentModules) {
      // this is a change build, but it's not for any
      // typescript modules or components so don't bother transpiling
      return Promise.resolve(moduleFile);
    }

    if (typeof moduleFile.jsText === 'string' && moduleFile.hasCmpClass) {
      // only skip transpile if we already have jsText, and this module is a component
      // if it's a component, it's safe to say it's not being imported by another?
      return Promise.resolve(moduleFile);
    }

    // do a full transpile
    return transpileFile(buildConfig, ctx, moduleFile, transpileResults);

  }).then(moduleFile => {
    // we got a transpiled moduled (either through a full transpile or from cache)
    transpileResults.moduleFiles[tsFilePath] = moduleFile;

    // process each of the styles within this module
    return processIncludedStyles(buildConfig, ctx, transpileResults.diagnostics, moduleFile);

  }).catch(err => {
    catchError(transpileResults.diagnostics, err);

  }).then(() => {
    return transpileResults;
  });
}


function transpileFile(buildConfig: BuildConfig, ctx: BuildContext, moduleFile: ModuleFileMeta, transpileResults: TranspileResults) {
  const tsConfig = getUserTsConfig(buildConfig, ctx, transpileResults);
  if (transpileResults.diagnostics.length) {
    return moduleFile;
  }

  const tsCompilerOptions = tsConfig.options;

  if (!ctx.tsHost) {
    ctx.tsHost = getTsHost(buildConfig, ctx, tsCompilerOptions);
  }

  const program = ts.createProgram(
    getTsCompilerRootNames(buildConfig, moduleFile.tsFilePath),
    tsCompilerOptions,
    ctx.tsHost
  );

  program.emit(undefined, ctx.tsHost.writeFile, undefined, false, {
    before: [
      componentClass(ctx.moduleFiles, transpileResults.diagnostics),
      removeImports(),
      updateLifecycleMethods()
    ],
    after: [
      jsxToVNode(ctx.moduleFiles)
    ]
  });

  ctx.transpileBuildCount++;

  const tsDiagnostics = program.getSyntacticDiagnostics()
    .concat(program.getSemanticDiagnostics(), program.getOptionsDiagnostics());

  loadTypeScriptDiagnostics(buildConfig, transpileResults.diagnostics, tsDiagnostics);

  return moduleFile;
}


function processIncludedStyles(buildConfig: BuildConfig, ctx: BuildContext, diagnostics: Diagnostic[], moduleFile: ModuleFileMeta) {
  if (ctx.isChangeBuild && !ctx.changeHasSass && !ctx.changeHasCss) {
    // this is a change, but it's not for any styles so don't bother
    return Promise.resolve([]);
  }

  if (!moduleFile.cmpMeta || !moduleFile.cmpMeta.styleMeta) {
    // module isn't a component or the component doesn't have styles, so don't bother
    return Promise.resolve([]);
  }

  const sys = buildConfig.sys;

  const promises: Promise<any>[] = [];

  const modeNames = Object.keys(moduleFile.cmpMeta.styleMeta);
  modeNames.forEach(modeName => {
    const modeMeta = moduleFile.cmpMeta.styleMeta[modeName];

    if (modeMeta.parsedStyleUrls) {
      modeMeta.parsedStyleUrls.forEach(parsedStyleUrl => {
        if (isSassSourceFile(parsedStyleUrl)) {
          const scssFileName = sys.path.basename(parsedStyleUrl);
          const scssFilePath = sys.path.join(sys.path.dirname(moduleFile.tsFilePath), scssFileName);

          promises.push(
            getIncludedSassFiles(sys, diagnostics, moduleFile, scssFilePath)
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
