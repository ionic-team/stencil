import ts from 'typescript';

import type * as d from '../../../declarations';
import { addCoreRuntimeApi, GET_ELEMENT, RUNTIME_APIS } from '../core-runtime-apis';

export const addLazyElementGetter = (
  classMembers: ts.ClassElement[],
  moduleFile: d.Module,
  cmp: d.ComponentCompilerMeta,
) => {
  // @Element() element;
  // is transformed into:
  // get element() { return __stencil_getElement(this); }
  if (cmp.elementRef) {
    addCoreRuntimeApi(moduleFile, RUNTIME_APIS.getElement);

    // Create the getter that will be used in the transformed class declaration
    const getter = ts.factory.createGetAccessorDeclaration(
      undefined,
      cmp.elementRef,
      [],
      undefined,
      ts.factory.createBlock([
        ts.factory.createReturnStatement(
          ts.factory.createCallExpression(ts.factory.createIdentifier(GET_ELEMENT), undefined, [
            ts.factory.createThis(),
          ]),
        ),
      ]),
    );

    // Find the index in the class members array that correlates with the element
    // ref identifier we have
    const index = classMembers.findIndex(
      (member) =>
        member.kind === ts.SyntaxKind.PropertyDeclaration && (member.name as any)?.escapedText === cmp.elementRef,
    );

    // Index should never not be a valid integer, but we'll be safe just in case.
    // If the index is valid, we'll overwrite the existing class member with the getter
    // so we don't create multiple members with the same identifier
    if (index >= 0) {
      classMembers[index] = getter;
    } else {
      classMembers.push(getter);
    }
  }
};
