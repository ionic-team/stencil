import { BuildConfig, BuildContext, Diagnostic, ModuleFileMeta, StencilSystem, TranspileResults } from './interfaces';
import { buildError, catchError, isSassSourceFile, normalizePath, readFile } from './util';
import { componentClass } from './transformers/component-class';
import { jsxToVNode } from './transformers/jsx-to-vnode';
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
  const tsCompilerOptions = createTsCompilerConfigs(buildConfig);

  const tsHost: ts.CompilerHost = {
    getSourceFile: (filePath) => {
      return ts.createSourceFile(filePath, moduleFile.tsText, ts.ScriptTarget.ES2015);
    },
    getDefaultLibFileName: () => 'lib.d.ts',
    getCurrentDirectory: () => '',
    getDirectories: () => [],
    getCanonicalFileName: (fileName) => fileName,
    useCaseSensitiveFileNames: () => false,
    getNewLine: () => '\n',

    fileExists: (filePath) => {
      return normalizePath(filePath) === moduleFile.tsFilePath;
    },

    readFile: (tsFilePath) => {
      let moduleFile = getModuleFileSync(buildConfig, ctx, tsFilePath);
      return moduleFile.tsText;
    },

    writeFile: (jsFilePath: string, jsText: string, writeByteOrderMark: boolean, onError: any, sourceFiles: ts.SourceFile[]): void => {
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
          transpileResults.moduleFiles[tsFilePath] = moduleFile;
        }
      });
      writeByteOrderMark; onError;
    }
  };

  const program = ts.createProgram([moduleFile.tsFilePath], tsCompilerOptions, tsHost);

  const tsResult = program.emit(undefined, tsHost.writeFile, undefined, false, {
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

  tsResult.diagnostics.forEach(d => {
    const tsError = buildError(transpileResults.diagnostics);
    tsError.messageText = d.messageText.toString();
    tsError.absFilePath = d.file && d.file.fileName;
  });

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


function createTsCompilerConfigs(buildConfig: BuildConfig) {
  // create defaults
  const tsCompilerOptions: ts.CompilerOptions = {
    allowJs: true,

    // Filename can be non-ts file.
    allowNonTsExtensions: true,

    allowSyntheticDefaultImports: true,
    isolatedModules: true,
    jsx: ts.JsxEmit.React,
    jsxFactory: 'h',
    lib: [
      'lib.dom.d.ts',
      'lib.es2015.d.ts',
      'lib.es5.d.ts'
    ],
    module: ts.ModuleKind.ES2015,
    moduleResolution: ts.ModuleResolutionKind.NodeJs,
    noImplicitUseStrict: true,

    // transpileModule does not write anything to disk so there is no need to verify that there are no conflicts between input and output paths.
    suppressOutputPathCheck: true,

    target: ts.ScriptTarget.ES5,
  };

  // add custom values
  tsCompilerOptions.outDir = buildConfig.collectionDest;
  tsCompilerOptions.rootDir = buildConfig.src;

  return tsCompilerOptions;
}


function getModuleFile(buildConfig: BuildConfig, ctx: BuildContext, tsFilePath: string) {
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

function getModuleFileSync(buildConfig: BuildConfig, ctx: BuildContext, tsFilePath: string) {
  tsFilePath = normalizePath(tsFilePath);

  let moduleFile = ctx.moduleFiles[tsFilePath];
  if (moduleFile) {
    if (typeof moduleFile.tsText === 'string') {
      // cool, already have the ts source content
      return moduleFile;
    }

    // we have the module, but no source content, let's load it up
    const tsText = buildConfig.sys.fs.readFileSync(tsFilePath, 'utf-8');
    moduleFile.tsText = tsText;
    return moduleFile;
  }

  // never seen this ts file before, let's start a new module file
  moduleFile = ctx.moduleFiles[tsFilePath] = {
    tsFilePath: tsFilePath,
    tsText: buildConfig.sys.fs.readFileSync(tsFilePath, 'utf-8')
  };

  return moduleFile;
}
