import * as d from '../../../declarations';
import ts from 'typescript';


export const addNativeConnectedCallback = (classMembers: ts.ClassElement[], cmp: d.ComponentCompilerMeta) => {
  // function call to stencil's exported connectedCallback(elm, plt)

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
      return (ts.isMethodDeclaration(classMember) && (classMember.name as any).escapedText === 'connectedCallback');
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
        'connectedCallback', undefined, undefined, undefined, undefined,
        ts.createBlock(prependBody, true)
      );
      classMembers.push(callbackMethod);
    }
  }
};
