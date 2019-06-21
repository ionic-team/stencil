import * as d from '../../../declarations';
import ts from 'typescript';
import { GET_ELEMENT } from '../exports';


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
              ts.createIdentifier(GET_ELEMENT),
              undefined,
              [ts.createThis()]
            )
          )
        ])
      )
    );
  }
}
