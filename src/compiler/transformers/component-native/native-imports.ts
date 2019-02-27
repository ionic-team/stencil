import { addImports, getModuleFromSourceFile } from '../transform-utils';
import ts from 'typescript';
import * as d from '@declarations';
import { COMMON_IMPORTS, CONNECTED_CALLBACK, PROXY_COMPONENT, REGISTER_HOST } from '../exports';


export function addNativeImports(transformCtx: ts.TransformationContext, compilerCtx: d.CompilerCtx, tsSourceFile: ts.SourceFile) {
  const importFns = [
    ...COMMON_IMPORTS,
    `proxyComponent as ${PROXY_COMPONENT}`,
    `connectedCallback as ${CONNECTED_CALLBACK}`,
    `registerHost as ${REGISTER_HOST}`,
  ];
  const moduleFile = getModuleFromSourceFile(compilerCtx, tsSourceFile);
  if (moduleFile && moduleFile.isLegacy) {
    importFns.push('h');
  }

  return addImports(transformCtx, tsSourceFile, importFns, '@stencil/core/app');
}
