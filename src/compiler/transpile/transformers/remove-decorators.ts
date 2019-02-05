import { isComponentClass } from './util';
import ts from 'typescript';

const CLASS_DECORATORS_TO_REMOVE = new Set(['Component']);

// same as the "declare" variables in the root index.ts file
const DECORATORS_TO_REMOVE = new Set([
  'Element',
  'Event',
  'Listen',
  'Method',
  'Prop',
  'PropDidChange',
  'PropWillChange',
  'State',
  'Watch'
]);


/**
 * Remove all decorators that are for metadata purposes
 */
export function removeDecorators(): ts.TransformerFactory<ts.SourceFile> {

  return transformCtx => {

    function visit(node: ts.Node): ts.VisitResult<ts.Node> {
      if (ts.isClassDeclaration(node)) {
        if (isComponentClass(node)) {
          return visitComponentClass(node);
        }
        return node;
      }
      return ts.visitEachChild(node, visit, transformCtx);
    }
    return (tsSourceFile) => visit(tsSourceFile) as ts.SourceFile;
  };
}


/**
 * Visit the component class and remove decorators
 * @param classNode
 */
function visitComponentClass(classNode: ts.ClassDeclaration): ts.ClassDeclaration {
  classNode.decorators = removeDecoratorsByName(classNode.decorators, CLASS_DECORATORS_TO_REMOVE);

  classNode.members.forEach((member) => {
    if (Array.isArray(member.decorators)) {
      member.decorators = removeDecoratorsByName(member.decorators, DECORATORS_TO_REMOVE);
    }
  });

  return classNode;
}

/**
 * Remove a decorator from the an array by name
 * @param decorators array of decorators
 * @param name name to remove
 */
function removeDecoratorsByName(decoratorList: ts.NodeArray<ts.Decorator>, names: Set<string>): ts.NodeArray<ts.Decorator> {
  const updatedDecoratorList = decoratorList.filter(dec => {
    const toRemove = ts.isCallExpression(dec.expression) &&
      ts.isIdentifier(dec.expression.expression) &&
      names.has(dec.expression.expression.text);
    return !toRemove;
  });

  if (updatedDecoratorList.length === 0 && decoratorList.length > 0) {
    return undefined;
  }

  if (updatedDecoratorList.length !== decoratorList.length) {
    return ts.createNodeArray(updatedDecoratorList);
  }

  return decoratorList;
}
