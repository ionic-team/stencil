import { addImports } from '../transform-utils';
import ts from 'typescript';
import { COMMON_IMPORTS, CONNECTED_CALLBACK, REGISTER_HOST } from '../exports';


export function addNativeImports(transformCtx: ts.TransformationContext, tsSourceFile: ts.SourceFile) {
  const importFns = [
    ...COMMON_IMPORTS,
    `connectedCallback as ${CONNECTED_CALLBACK}`,
    `registerHost as ${REGISTER_HOST}`,
  ];

  return addImports(transformCtx, tsSourceFile, importFns, '@stencil/core/app');
}
