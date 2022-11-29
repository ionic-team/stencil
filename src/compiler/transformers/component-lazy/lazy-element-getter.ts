import ts from 'typescript';

import type * as d from '../../../declarations';
import { addCoreRuntimeApi, GET_ELEMENT, RUNTIME_APIS } from '../core-runtime-apis';

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
      ts.factory.createGetAccessorDeclaration(
        undefined,
        cmp.elementRef,
        [],
        undefined,
        ts.factory.createBlock([
          ts.factory.createReturnStatement(
            ts.factory.createCallExpression(ts.factory.createIdentifier(GET_ELEMENT), undefined, [
              ts.factory.createThis(),
            ])
          ),
        ])
      )
    );
  }
};
