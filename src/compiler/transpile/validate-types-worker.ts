import * as d from '@declarations';
import { loadTypeScriptDiagnostics, normalizePath } from '@utils';
import { removeCollectionImports } from './transformers/remove-collection-imports';
import { removeDecorators } from './transformers/remove-decorators';
import { removeStencilImports } from './transformers/remove-stencil-imports';
import { updateStencilTypesImports } from '../distribution/stencil-types';
import path from 'path';
import ts from 'typescript';


export function validateTypesWorker(workerCtx: d.WorkerContext, emitDtsFiles: boolean, compilerOptions: ts.CompilerOptions, currentWorkingDir: string, collectionNames: string[], rootTsFiles: string[]) {
  const results: d.ValidateTypesResults = {
    diagnostics: [],
    dirPaths: [],
    filePaths: []
  };

  const config: d.Config = {
    cwd: currentWorkingDir
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
        data = updateStencilTypesImports(compilerOptions.declarationDir, outputFileName, data);
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

  loadTypeScriptDiagnostics(results.diagnostics, tsDiagnostics);

  results.diagnostics.forEach(diagnostic => {
    if (diagnostic.absFilePath) {
      diagnostic.relFilePath = path.relative(config.cwd, diagnostic.absFilePath);
      if (!diagnostic.relFilePath.includes('/')) {
        diagnostic.relFilePath = './' + diagnostic.relFilePath;
      }
    }
  });

  return results;
}
