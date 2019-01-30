import ts from 'typescript';
import * as d from '@declarations';

export function registerLazyElementGetter(classMembers: ts.ClassElement[], cmpMeta: d.ComponentCompilerMeta) {
  // @Element() element;
  // is transformed into:
  // get element() { return __stencil_getElement(this); }
  if (cmpMeta.elementRef) {
    classMembers.push(
      ts.createGetAccessor(
        undefined,
        undefined,
        cmpMeta.elementRef,
        [],
        undefined,
        ts.createBlock([
          ts.createReturn(
            ts.createCall(
              ts.createIdentifier('__stencil_getElement'),
              undefined,
              [ts.createThis()]
            )
          )
        ])
      )
    );
  }
}
