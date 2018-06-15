import * as d from '../../declarations';
import { loadTypeScriptDiagnostics } from '../../util/logger/logger-typescript';
import { removeCollectionImports } from './transformers/remove-collection-imports';
import { removeDecorators } from './transformers/remove-decorators';
import { removeStencilImports } from './transformers/remove-stencil-imports';

import * as path from 'path';
import * as ts from 'typescript';


export function validateTypesWorker(workerCtx: d.WorkerContext, emitDtsFiles: boolean, compilerOptions: ts.CompilerOptions, currentWorkingDir: string, collectionNames: string[], rootTsFiles: string[]) {
  const diagnostics: d.Diagnostic[] = [];

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
      if (!outputFileName.endsWith('.d.ts')) {
        return;
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

  loadTypeScriptDiagnostics(config, diagnostics, tsDiagnostics);

  return diagnostics;
}
