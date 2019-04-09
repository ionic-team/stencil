import * as d from '../../../declarations';
import { addImports, getModuleFromSourceFile } from '../transform-utils';
import { COMMON_IMPORTS, CONNECTED_CALLBACK, REGISTER_INSTANCE } from '../exports';
import ts from 'typescript';


export function addHydrateImports(transformCtx: ts.TransformationContext, compilerCtx: d.CompilerCtx, tsSourceFile: ts.SourceFile) {
  const importFns = [
    ...COMMON_IMPORTS,
    `connectedCallback as ${CONNECTED_CALLBACK}`,
    `registerInstance as ${REGISTER_INSTANCE}`
  ];

  const moduleFile = getModuleFromSourceFile(compilerCtx, tsSourceFile);
  if (moduleFile && moduleFile.isLegacy) {
    importFns.push('h');
  }

  tsSourceFile = addImports(transformCtx, tsSourceFile, importFns, '@stencil/core');
  tsSourceFile = addImports(transformCtx, tsSourceFile, ['console'], '@stencil/core/console');

  return tsSourceFile;
}
