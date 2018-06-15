import * as d from '../../declarations';
import addComponentMetadata from './transformers/add-component-metadata';
import { BuildContext } from '../build/build-ctx';
import { gatherMetadata } from './datacollection/gather-metadata';
import { loadTypeScriptDiagnostics } from '../../util/logger/logger-typescript';
import { normalizePath } from '../util';
import { removeCollectionImports } from './transformers/remove-collection-imports';
import { removeDecorators } from './transformers/remove-decorators';
import { removeStencilImports } from './transformers/remove-stencil-imports';
import * as ts from 'typescript';


/**
 * This is only used during TESTING
 */
export function transpileModuleForTesting(config: d.Config, options: ts.CompilerOptions, sourceFilePath: string, input: string) {
  const compilerCtx: d.CompilerCtx = {
    collections: [],
    moduleFiles: {},
    resolvedCollections: []
  };
  const buildCtx = new BuildContext(config, compilerCtx, null);

  sourceFilePath = normalizePath(sourceFilePath);

  const results: d.TranspileResults = {
    sourceFilePath: sourceFilePath,
    code: null,
    diagnostics: [],
    cmpMeta: null
  };

  options.isolatedModules = true;
  // transpileModule does not write anything to disk so there is no need to verify that there are no conflicts between input and output paths.
  options.suppressOutputPathCheck = true;
  // Filename can be non-ts file.
  options.allowNonTsExtensions = true;
  // We are not returning a sourceFile for lib file when asked by the program,
  // so pass --noLib to avoid reporting a file not found error.
  options.noLib = true;
  // Clear out other settings that would not be used in transpiling this module
  options.lib = undefined;
  options.types = undefined;
  options.noEmit = undefined;
  options.noEmitOnError = undefined;
  options.paths = undefined;
  options.rootDirs = undefined;
  options.declaration = undefined;
  options.declarationDir = undefined;
  options.out = undefined;
  options.outFile = undefined;
  // We are not doing a full typecheck, we are not resolving the whole context,
  // so pass --noResolve to avoid reporting missing file errors.
  options.noResolve = true;

  // if jsx is specified then treat file as .tsx
  const inputFileName = sourceFilePath || (options.jsx ? `module.tsx` : `module.ts`);

  const sourceFile = ts.createSourceFile(inputFileName, input, options.target);

  // Create a compilerHost object to allow the compiler to read and write files
  const compilerHost = {
    getSourceFile: (fileName: string) => fileName === normalizePath(inputFileName) ? sourceFile : undefined,
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
    fileExists: (fileName: string) => fileName === inputFileName,
    readFile: () => '',
    directoryExists: () => true,
    getDirectories: () => [] as string[]
  };

  const program = ts.createProgram([inputFileName], options, compilerHost);
  const typeChecker = program.getTypeChecker();

  // Emit
  program.emit(undefined, undefined, undefined, false, {
    before: [
      gatherMetadata(config, compilerCtx, buildCtx, typeChecker),
      removeDecorators(),
      addComponentMetadata(compilerCtx.moduleFiles)
    ],
    after: [
      removeStencilImports(),
      removeCollectionImports(compilerCtx)
    ]
  });

  const tsDiagnostics = program.getOptionsDiagnostics().concat(program.getSyntacticDiagnostics());

  loadTypeScriptDiagnostics(config, buildCtx.diagnostics, tsDiagnostics);

  results.diagnostics.push(...buildCtx.diagnostics);

  const moduleFile = compilerCtx.moduleFiles[results.sourceFilePath];

  results.cmpMeta = moduleFile ? moduleFile.cmpMeta : null;

  return results;
}
