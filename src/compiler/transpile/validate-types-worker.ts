import * as d from '../../declarations';
import { loadTypeScriptDiagnostics } from '../../util/logger/logger-typescript';
import { removeCollectionImports } from './transformers/remove-collection-imports';
import { removeDecorators } from './transformers/remove-decorators';
import { removeStencilImports } from './transformers/remove-stencil-imports';

import * as path from 'path';
import * as ts from 'typescript';
import { normalizePath } from '../util';


export function validateTypesWorker(workerCtx: d.WorkerContext, emitDtsFiles: boolean, compilerOptions: ts.CompilerOptions, currentWorkingDir: string, collectionNames: string[], rootTsFiles: string[]) {
  const results: d.ValidateTypesResults = {
    diagnostics: [],
    dirPaths: [],
    filePaths: []
  };

  const config: d.Config = {
    cwd: currentWorkingDir,
    sys: {
      path: path
    } as any
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
  };

  program.emit(undefined, undefined, undefined, true, {
    before: [
      removeDecorators()
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

  loadTypeScriptDiagnostics(config, results.diagnostics, tsDiagnostics);

  return results;
}
