import type * as d from '../../../declarations';
import { GET_ELEMENT, RUNTIME_APIS, addCoreRuntimeApi } from '../core-runtime-apis';
import ts from 'typescript';

export const addLazyElementGetter = (
  classMembers: ts.ClassElement[],
  moduleFile: d.Module,
  cmp: d.ComponentCompilerMeta
) => {
  // @Element() element;
  // is transformed into:
  // get element() { return __stencil_getElement(this); }
  if (cmp.elementRef) {
    addCoreRuntimeApi(moduleFile, RUNTIME_APIS.getElement);

    classMembers.push(
      ts.createGetAccessor(
        undefined,
        undefined,
        cmp.elementRef,
        [],
        undefined,
        ts.createBlock([ts.createReturn(ts.createCall(ts.createIdentifier(GET_ELEMENT), undefined, [ts.createThis()]))])
      )
    );
  }
};
