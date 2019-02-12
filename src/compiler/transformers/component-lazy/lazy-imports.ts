import { addImports } from '../transform-utils';
import ts from 'typescript';
import { COMMON_IMPORTS, REGISTER_INSTANCE } from '../exports';


export function addLazyImports(transformCtx: ts.TransformationContext, tsSourceFile: ts.SourceFile) {
  const importFns = [
    ...COMMON_IMPORTS,

    `registerInstance as ${REGISTER_INSTANCE}`,
  ];

  return addImports(transformCtx, tsSourceFile, importFns, '@stencil/core/app');
}
