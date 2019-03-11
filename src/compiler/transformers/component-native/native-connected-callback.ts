import ts from 'typescript';
import * as d from '../../../declarations';
// import { formatHostListeners } from '../../app-core/format-component-runtime-meta';
// import { convertValueToLiteral } from '../transform-utils';


export function addNativeConnectedCallback(classMembers: ts.ClassElement[], cmp: d.ComponentCompilerMeta, _build: d.Build) {
  // function call to stencil's exported connectedCallback(elm, plt)
  const methodName = 'connectedCallback';

  // TODO: fast path
  if (cmp.isPlain && cmp.hasRenderFn) {
    const fnCall = ts.createExpressionStatement(ts.createAssignment(
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
    ));
    const connectedCallback = classMembers.find(classMember => {
      return (ts.isMethodDeclaration(classMember) && (classMember.name as any).escapedText === methodName);
    }) as ts.MethodDeclaration;

    const prependBody = [
      fnCall,
    ];
    if (connectedCallback != null) {
      // class already has a connectedCallback(), so update it
      connectedCallback.body = ts.updateBlock(connectedCallback.body, [
        ...prependBody,
        ...connectedCallback.body.statements
      ]);

    } else {
      // class doesn't have a connectedCallback(), so add it
      const callbackMethod = ts.createMethod(
        undefined,
        undefined,
        undefined,
        methodName, undefined, undefined, undefined, undefined,
        ts.createBlock(prependBody, true)
      );
      classMembers.push(callbackMethod);
    }
  }
}

// function connectedCallbackStatement() {
//   // connectedCallback(this)
//   return ts.createExpressionStatement(
//     ts.createCall(
//       ts.createIdentifier(CONNECTED_CALLBACK),
//       undefined,
//       [ ts.createThis() ]
//     )
//   );
// }

// function setListenersStatements(cmp: d.ComponentCompilerMeta) {
//   if (cmp.listeners.length === 0) {
//     return [];
//   }
//   return [ts.createExpressionStatement(
//     ts.createCall(
//       ts.createIdentifier('__stencil_setListeners'),
//       undefined,
//       [
//         ts.createThis(),
//         convertValueToLiteral(formatHostListeners(cmp))
//       ]
//     )
//   )];
// }
