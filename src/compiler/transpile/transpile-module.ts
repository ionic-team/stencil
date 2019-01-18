import * as d from '@declarations';
// import addComponentMetadata from './transformers/add-component-metadata';
import { BuildContext } from '../build/build-ctx';
import { loadTypeScriptDiagnostics, noop, normalizePath } from '@utils';
// import { removeCollectionImports } from './transformers/remove-collection-imports';
// import { removeDecorators } from './transformers/remove-decorators';
// import { removeStencilImports } from './transformers/remove-stencil-imports';
import { validateConfig } from '../config/validate-config';
import ts from 'typescript';


/**
 * Mainly used as the typescript preprocessor for unit tests
 */
export function transpileModule(config: d.Config, input: string, opts: ts.CompilerOptions = {}, sourceFilePath?: string) {
  config = validateConfig(config);

  if (typeof sourceFilePath === 'string') {
    sourceFilePath = normalizePath(sourceFilePath);
  } else {
    sourceFilePath = (opts.jsx ? `module.tsx` : `module.ts`);
  }

  const results: d.TranspileResults = {
    sourceFilePath: sourceFilePath,
    code: null,
    map: null,
    diagnostics: [],
    cmpMeta: null
  };

  const compilerCtx: any = {
    collections: [],
    resolvedCollections: new Set(),
    events: {
      emit: noop,
      subscribe: noop,
      unsubscribe: noop,
      unsubscribeAll: noop
    }
  };
  const buildCtx = new BuildContext(config, compilerCtx);

  if (sourceFilePath.endsWith('.tsx')) {
    // ensure we're setup for JSX in typescript
    opts.jsx = ts.JsxEmit.React;
    opts.jsxFactory = 'h';
  }

  const sourceFile = ts.createSourceFile(sourceFilePath, input, opts.target);

  // Create a compilerHost object to allow the compiler to read and write files
  const compilerHost = {
    getSourceFile: (fileName: string) => normalizePath(fileName) === normalizePath(sourceFilePath) ? sourceFile : undefined,
    writeFile: function (name: string, text: string) {
      if (name.endsWith('.map')) {
        results.map = text;
      } else {
        results.code = text;
      }
    },
    getDefaultLibFileName: () => `lib.d.ts`,
    useCaseSensitiveFileNames: () => false,
    getCanonicalFileName: (fileName: string) => fileName,
    getCurrentDirectory: () => '',
    getNewLine: () => ts.sys.newLine,
    fileExists: (fileName: string) => normalizePath(fileName) === normalizePath(sourceFilePath),
    readFile: () => '',
    directoryExists: () => true,
    getDirectories: () => [] as string[]
  };

  const program = ts.createProgram([sourceFilePath], opts, compilerHost);
  // const typeChecker = program.getTypeChecker();

  // Emit
  program.emit(undefined, undefined, undefined, false, {
    before: [
      // gatherMetadata(config, compilerCtx, buildCtx, typeChecker),
      // removeDecorators(),
      // addComponentMetadata(compilerCtx.moduleFiles)
    ],
    after: [
      // removeStencilImports(),
      // removeCollectionImports(compilerCtx)
    ]
  });

  const tsDiagnostics = [...program.getSyntacticDiagnostics()];

  if (config.validateTypes) {
    tsDiagnostics.push(...program.getOptionsDiagnostics());
  }

  loadTypeScriptDiagnostics(config, buildCtx.diagnostics, tsDiagnostics);

  results.diagnostics.push(...buildCtx.diagnostics);

  const moduleFile: any = null; // compilerCtx.moduleFiles[results.sourceFilePath];

  results.cmpMeta = moduleFile ? moduleFile.cmpMeta : null;

  return results;
}
