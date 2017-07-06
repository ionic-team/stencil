import { BuildConfig, BuildContext, Diagnostic, ModuleFileMeta, StencilSystem, TranspileResults } from './interfaces';
import { componentClass } from './transformers/component-class';
import { jsxToVNode } from './transformers/jsx-to-vnode';
import { readFile } from './util';
import { removeImports } from './transformers/remove-imports';
import { updateLifecycleMethods } from './transformers/update-lifecycle-methods';
import * as ts from 'typescript';


export function transpile(buildConfig: BuildConfig, ctx: BuildContext, tsFilePath: string) {
  // within WORKER thread
  const transpileResults: TranspileResults = {
    moduleFiles: {},
    diagnostics: []
  };

  const sys = buildConfig.sys;

  return readFile(sys, tsFilePath).then(tsText => {
    const moduleFile: ModuleFileMeta = {
      tsFilePath: tsFilePath,
      tsText: tsText
    };
    transpileResults.moduleFiles[tsFilePath] = moduleFile;
    ctx.moduleFiles[tsFilePath] = moduleFile;

    return transpileFile(buildConfig, ctx, moduleFile, transpileResults);

  }).catch(err => {
    transpileResults.diagnostics.push({
      msg: err,
      type: 'error',
      stack: err.stack
    });

  }).then(() => {
    return transpileResults;
  });
}


function transpileFile(buildConfig: BuildConfig, ctx: BuildContext, moduleFile: ModuleFileMeta, transpileResults: TranspileResults) {
  const sys = buildConfig.sys;
  const tsCompilerOptions = createTsCompilerConfigs(buildConfig);
  const moduleStylesToProcess: ModuleFileMeta[] = [];

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
      return filePath === moduleFile.tsFilePath;
    },

    readFile: (tsFilePath) => {
      let moduleFile = ctx.moduleFiles[tsFilePath];

      if (!moduleFile) {
        // file not in-memory yet
        moduleFile = {
          tsFilePath: tsFilePath,
          // sync file read required :(
          tsText: sys.fs.readFileSync(tsFilePath, 'utf-8')
        };

        transpileResults.moduleFiles[tsFilePath] = moduleFile;
        ctx.moduleFiles[tsFilePath] = moduleFile;
      }

      return moduleFile.tsText;
    },

    writeFile: (jsFilePath: string, jsText: string, writeByteOrderMark: boolean, onError: any, sourceFiles: ts.SourceFile[]): void => {
      sourceFiles.forEach(tsSourceFile => {
        let module = ctx.moduleFiles[tsSourceFile.fileName];

        if (module) {
          moduleFile.jsFilePath = jsFilePath;
          moduleFile.jsText = jsText;

        } else {
          module = ctx.moduleFiles[tsSourceFile.fileName] = {
            tsFilePath: tsSourceFile.fileName,
            jsFilePath: jsFilePath,
            jsText: jsText
          };
        }

        transpileResults.moduleFiles[tsSourceFile.fileName] = module;

        moduleStylesToProcess.push(module);
      });
      writeByteOrderMark; onError;
    }
  };

  const program = ts.createProgram([moduleFile.tsFilePath], tsCompilerOptions, tsHost);

  const result = program.emit(undefined, tsHost.writeFile, undefined, false, {
    before: [
      componentClass(transpileResults.moduleFiles, transpileResults.diagnostics),
      removeImports(),
      updateLifecycleMethods()
    ],
    after: [
      jsxToVNode(transpileResults.moduleFiles)
    ]
  });

  result.diagnostics.forEach(d => {
    const diagnostic: Diagnostic = {
      msg: d.messageText.toString(),
      type: 'error',
      filePath: d.file && d.file.fileName,
      start: d.start,
      length: d.length,
      category: d.category,
      code: d.code
    };
    transpileResults.diagnostics.push(diagnostic);
  });

  return Promise.all(moduleStylesToProcess.map(moduleFile => {
    return processIncludedStyles(sys, transpileResults.diagnostics, moduleFile);
  }));
}


function processIncludedStyles(sys: StencilSystem, diagnostics: Diagnostic[], moduleFile: ModuleFileMeta) {
  if (!moduleFile.cmpMeta || !moduleFile.cmpMeta.styleMeta) {
    return Promise.resolve([]);
  }

  const promises: Promise<any>[] = [];

  const modeNames = Object.keys(moduleFile.cmpMeta.styleMeta);
  modeNames.forEach(modeName => {
    const modeMeta = moduleFile.cmpMeta.styleMeta[modeName];

    if (modeMeta.styleUrls) {
      modeMeta.styleUrls.forEach(styleUrl => {
        const ext = sys.path.extname(styleUrl).toLowerCase();

        if (ext === '.scss' || ext === '.sass') {
          const scssFileName = sys.path.basename(styleUrl);
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

    const sassConfig = {
      file: scssFilePath
    };

    moduleFile.includedSassFiles = moduleFile.includedSassFiles || [];

    if (moduleFile.includedSassFiles.indexOf(scssFilePath) === -1) {
      moduleFile.includedSassFiles.push(scssFilePath);
    }

    sys.sass.render(sassConfig, (err, result) => {
      if (err) {
        diagnostics.push({
          msg: err.message,
          filePath: err.file,
          type: 'error'
        });

      } else if (result.stats && result.stats.includedFiles) {
        result.stats.includedFiles.forEach((includedFile: string) => {
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
