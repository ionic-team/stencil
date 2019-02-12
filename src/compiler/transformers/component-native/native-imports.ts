import { addImports } from '../transform-utils';
import ts from 'typescript';
import { COMMON_IMPORTS, REGISTER_HOST } from '../exports';


export function addNativeImports(transformCtx: ts.TransformationContext, tsSourceFile: ts.SourceFile) {
  const importFns = [
    ...COMMON_IMPORTS,
    'connectedCallback',
    `registerHost as ${REGISTER_HOST}`,
  ];

  return addImports(transformCtx, tsSourceFile, importFns, '@stencil/core/app');
}
