import ts from 'typescript';

import type * as d from '../../declarations';
import { createImportStatement, createRequireStatement } from './transform-utils';

export const addImports = (
  transformOpts: d.TransformOptions,
  tsSourceFile: ts.SourceFile,
  importFnNames: string[],
  importPath: string
) => {
  if (importFnNames.length === 0) {
    return tsSourceFile;
  }

  if (transformOpts.module === 'cjs') {
    // CommonJS require()
    const newRequire = createRequireStatement(importFnNames, importPath);
    const statements = tsSourceFile.statements.slice();
    statements.splice(2, 0, newRequire);
    return ts.factory.updateSourceFile(tsSourceFile, statements);
  }

  // ESM Imports
  const newImport = createImportStatement(importFnNames, importPath);
  const statements = tsSourceFile.statements.slice();
  statements.unshift(newImport);
  return ts.factory.updateSourceFile(tsSourceFile, statements);
};
