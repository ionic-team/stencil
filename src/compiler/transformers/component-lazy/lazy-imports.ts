import { addImports, getModuleFromSourceFile } from '../transform-utils';
import ts from 'typescript';
import * as d from '@declarations';
import { COMMON_IMPORTS, REGISTER_INSTANCE } from '../exports';


export function addLazyImports(transformCtx: ts.TransformationContext, compilerCtx: d.CompilerCtx, tsSourceFile: ts.SourceFile) {
  const importFns = [
    ...COMMON_IMPORTS,

    `registerInstance as ${REGISTER_INSTANCE}`,
  ];
  const moduleFile = getModuleFromSourceFile(compilerCtx, tsSourceFile);
  if (moduleFile && moduleFile.isLegacy) {
    importFns.push('h');
  }

  return addImports(transformCtx, tsSourceFile, importFns, '@stencil/core/app');
}
