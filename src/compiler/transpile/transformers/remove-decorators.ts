import * as ts from 'typescript';

// same as the "declare" variables in the root index.ts file
const DECORATORS_TO_REMOVE = [
  'Element',
  'Event',
  'Listen',
  'Method',
  'Prop',
  'PropDidChange',
  'PropWillChange',
  'State'
];

/**
 * Remove all decorators that are for metadata purposes
 */
export function removeDecorators(): ts.TransformerFactory<ts.SourceFile> {

  return (transformContext) => {

    function visit(node: ts.Node): ts.VisitResult<ts.Node> {
      switch (node.kind) {
        case ts.SyntaxKind.ClassDeclaration:
          if (!isComponentClass(node as ts.ClassDeclaration)) {
            return node;
          }
          return visitComponentClass(node as ts.ClassDeclaration);
        default:
          return ts.visitEachChild(node, visit, transformContext);
      }
    }

    return (tsSourceFile) => {
      return visit(tsSourceFile) as ts.SourceFile;
    };
  };
}

/**
 * Check if class has component decorator
 * @param classNode
 */
function isComponentClass(classNode: ts.ClassDeclaration) {
  const componentDecoratorIndex = classNode.decorators.findIndex(dec =>
   (ts.isCallExpression(dec.expression) && dec.expression.expression.getText() === name)
  );
  return (componentDecoratorIndex !== -1);
}

/**
 * Visit the component class and remove decorators
 * @param classNode
 */
function visitComponentClass(classNode: ts.ClassDeclaration): ts.ClassDeclaration {
  classNode.decorators = removeDecoratorByName(classNode.decorators, 'Component');

  classNode.members.forEach((member) => {
    if (Array.isArray(member.decorators)) {
      DECORATORS_TO_REMOVE.forEach((name) => {
        member.decorators = removeDecoratorByName(member.decorators, name);
      });
    }
  });

  return classNode;
}

/**
 * Remove a decorator from the an array by name
 * @param decorators array of decorators
 * @param name name to remove
 */
function removeDecoratorByName(decorators: ts.NodeArray<ts.Decorator>, name: string): ts.NodeArray<ts.Decorator> {
  const componentDecoratorIndex = decorators.findIndex(dec =>
   (ts.isCallExpression(dec.expression) && dec.expression.expression.getText() === name)
  );

  if (componentDecoratorIndex === -1) {
    return decorators;
  }

  return ts.createNodeArray(decorators.slice().splice(componentDecoratorIndex, 1));
}
