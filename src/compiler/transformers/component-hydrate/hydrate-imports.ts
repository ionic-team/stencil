import { addImports } from '../transform-utils';
import ts from 'typescript';
import { COMMON_IMPORTS, CONNECTED_CALLBACK, REGISTER_INSTANCE } from '../exports';


export function addHydrateImports(transformCtx: ts.TransformationContext, tsSourceFile: ts.SourceFile) {
  const importFns = [
    ...COMMON_IMPORTS,
    `connectedCallback as ${CONNECTED_CALLBACK}`,
    `registerInstance as ${REGISTER_INSTANCE}`,
  ];

  return addImports(transformCtx, tsSourceFile, importFns, '@stencil/core/app');
}
