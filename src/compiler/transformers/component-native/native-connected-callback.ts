import ts from 'typescript';

import type * as d from '../../../declarations';

export const addNativeConnectedCallback = (classMembers: ts.ClassElement[], cmp: d.ComponentCompilerMeta) => {
  // function call to stencil's exported connectedCallback(elm, plt)

  // TODO: fast path
  if (cmp.isPlain && cmp.hasRenderFn) {
    const fnCall = ts.factory.createExpressionStatement(
      ts.factory.createAssignment(
        ts.factory.createPropertyAccessExpression(ts.factory.createThis(), 'textContent'),
        ts.factory.createCallExpression(
          ts.factory.createPropertyAccessExpression(ts.factory.createThis(), 'render'),
          undefined,
          undefined
        )
      )
    );
    const connectedCallback = classMembers.find((classMember) => {
      return ts.isMethodDeclaration(classMember) && (classMember.name as any).escapedText === 'connectedCallback';
    }) as ts.MethodDeclaration;

    if (connectedCallback != null) {
      // class already has a connectedCallback(), so update it
      const callbackMethod = ts.factory.createMethodDeclaration(
        undefined,
        undefined,
        'connectedCallback',
        undefined,
        undefined,
        [],
        undefined,
        ts.factory.createBlock([fnCall, ...connectedCallback.body.statements], true)
      );
      const index = classMembers.indexOf(connectedCallback);
      classMembers[index] = callbackMethod;
    } else {
      // class doesn't have a connectedCallback(), so add it
      const callbackMethod = ts.factory.createMethodDeclaration(
        undefined,
        undefined,
        'connectedCallback',
        undefined,
        undefined,
        [],
        undefined,
        ts.factory.createBlock([fnCall], true)
      );
      classMembers.push(callbackMethod);
    }
  }
};
