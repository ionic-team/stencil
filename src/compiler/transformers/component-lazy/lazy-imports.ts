import { addImports } from '../transform-utils';
import ts from 'typescript';


export function addLazyImports(transformCtx: ts.TransformationContext, tsSourceFile: ts.SourceFile) {
  const importFns = [
    'createEvent as __stencil_createEvent',
    'getConnect as __stencil_getConnect',
    'getContext as __stencil_getContext',
    'getElement as __stencil_getElement',
    'h',
    'registerInstance as __stencil_registerInstance',
    'registerStyle as __stencil_registerStyle'
  ];

  return addImports(transformCtx, tsSourceFile, importFns, '@stencil/core/app');
}
