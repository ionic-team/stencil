import * as d from '../../declarations';
import { loadTypeScriptDiagnostics, normalizePath } from '@utils';
import { removeCollectionImports } from '../transformers/remove-collection-imports';
import { removeStencilDecorators, removeStencilImports } from '../transformers/validate-types-transform';
import { updateStencilTypesImports } from '../types/stencil-types';
import path from 'path';
import ts from 'typescript';


export function validateTypesWorker(workerCtx: d.WorkerContext, emitDtsFiles: boolean, compilerOptions: ts.CompilerOptions, _currentWorkingDir: string, collectionNames: string[], rootTsFiles: string[]) {
  const results: d.ValidateTypesResults = {
    diagnostics: [],
    dirPaths: [],
    filePaths: []
  };

  if (!workerCtx.tsHost) {
    compilerOptions.outDir = undefined;

    const tsHost = ts.createCompilerHost(compilerOptions);

    tsHost.writeFile = (outputFileName: string, data: string, writeByteOrderMark: boolean) => {
      if (!emitDtsFiles) {
        return;
      }

      const filePath = normalizePath(outputFileName);
      if (!filePath.endsWith('.d.ts')) {
        return;
      }

      if (!results.filePaths.includes(filePath)) {
        results.filePaths.push(filePath);
      }

      const dir = normalizePath(path.dirname(filePath));
      if (!results.dirPaths.includes(dir)) {
        results.dirPaths.push(dir);
      }

      if (typeof compilerOptions.declarationDir === 'string') {
        data = updateStencilTypesImports(path, compilerOptions.declarationDir, outputFileName, data);
      }

      ts.sys.writeFile(outputFileName, data, writeByteOrderMark);
    };

    workerCtx.tsHost = tsHost;
  }

  const program = ts.createProgram(rootTsFiles, compilerOptions, workerCtx.tsHost, workerCtx.tsProgram);
  workerCtx.tsProgram = program;

  const compilerCtx: d.CompilerCtx = {
    collections: collectionNames.map(n => {
      return { collectionName: n };
    })
  } as any;

  program.emit(undefined, undefined, undefined, true, {
    before: [
      removeStencilDecorators()
    ],
    after: [
      removeStencilImports(),
      removeCollectionImports(compilerCtx)
    ]
  });

  const tsDiagnostics: ts.Diagnostic[] = [];
  program.getSyntacticDiagnostics().forEach(d => tsDiagnostics.push(d));
  program.getSemanticDiagnostics().forEach(d => tsDiagnostics.push(d));
  program.getOptionsDiagnostics().forEach(d => tsDiagnostics.push(d));

  loadTypeScriptDiagnostics(results.diagnostics, tsDiagnostics);

  return results;
}
