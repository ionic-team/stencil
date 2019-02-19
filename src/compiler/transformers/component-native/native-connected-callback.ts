import ts from 'typescript';
import * as d from '@declarations';
import { CONNECTED_CALLBACK } from '../exports';


export function addNativeConnectedCallback(classMembers: ts.ClassElement[], build: d.Build) {
  // function call to stencil's exported connectedCallback(elm, plt)
  const methodName = 'connectedCallback';

  let fnCall: ts.Expression;
  if (!build.updatable && !build.lifecycle && !build.lifecycle && build.allRenderFn) {
    fnCall = ts.createAssignment(
      ts.createPropertyAccess(
        ts.createThis(),
        'textContent'
      ),
      ts.createCall(
        ts.createPropertyAccess(
          ts.createThis(),
          'render'
        ),
        undefined,
        undefined
      )
    );
  } else {
    fnCall = ts.createCall(
      ts.createIdentifier(CONNECTED_CALLBACK),
      undefined,
      [
        ts.createThis()
      ]
    );
  }

  const connectedCallback = classMembers.find(classMember => {
    return (classMember.kind === ts.SyntaxKind.MethodDeclaration && (classMember.name as any).escapedText === methodName);
  }) as ts.MethodDeclaration;

  if (connectedCallback != null) {
    // class already has a connectedCallback(), so update it
    connectedCallback.body = ts.updateBlock(connectedCallback.body, [
      ts.createExpressionStatement(fnCall),
      ...connectedCallback.body.statements
    ]);

  } else {
    // class doesn't have a connectedCallback(), so add it
    const body = ts.createBlock([
      ts.createExpressionStatement(fnCall)
    ], true);

    const callbackMethod = ts.createMethod(undefined, undefined, undefined,
      methodName, undefined, undefined, undefined, undefined,
      body
    );
    classMembers.push(callbackMethod);
  }
}
