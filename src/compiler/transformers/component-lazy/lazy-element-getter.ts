import * as d from '@declarations';
import ts from 'typescript';


export function addLazyElementGetter(classMembers: ts.ClassElement[], cmp: d.ComponentCompilerMeta) {
  // @Element() element;
  // is transformed into:
  // get element() { return __stencil_getElement(this); }
  if (cmp.elementRef) {
    classMembers.push(
      ts.createGetAccessor(
        undefined,
        undefined,
        cmp.elementRef,
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
