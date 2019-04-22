import { addImports, getModuleFromSourceFile } from '../transform-utils';
import ts from 'typescript';
import * as d from '../../../declarations';
import { ATTACH_SHADOW, COMMON_IMPORTS, REGISTER_HOST } from '../exports';


export function addNativeImports(transformCtx: ts.TransformationContext, compilerCtx: d.CompilerCtx, tsSourceFile: ts.SourceFile) {
  const importFns = [
    ...COMMON_IMPORTS,
    `attachShadow as ${ATTACH_SHADOW}`,
    `registerHost as ${REGISTER_HOST}`,
  ];
  const moduleFile = getModuleFromSourceFile(compilerCtx, tsSourceFile);
  if (moduleFile && moduleFile.isLegacy) {
    importFns.push('h');
  }

  return addImports(transformCtx, tsSourceFile, importFns, '@stencil/core');
}
