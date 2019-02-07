import { removeStencilImport } from './remove-stencil-import';
import { } from './transform-utils';
import ts from 'typescript';

const CLASS_DECORATORS_TO_REMOVE = new Set(['Component']);
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


export function removeStencilDecorators(): ts.TransformerFactory<ts.SourceFile> {

  return transformCtx => {

    function visit(node: ts.Node): ts.VisitResult<ts.Node> {
      if (ts.isClassDeclaration(node)) {
        return visitComponentClass(node);
      }
      return ts.visitEachChild(node, visit, transformCtx);
    }
    return (tsSourceFile) => visit(tsSourceFile) as ts.SourceFile;
  };
}


function visitComponentClass(classNode: ts.ClassDeclaration): ts.ClassDeclaration {
  classNode.decorators = removeDecoratorsByName(classNode.decorators, CLASS_DECORATORS_TO_REMOVE);

  classNode.members.forEach((member) => {
    if (Array.isArray(member.decorators)) {
      member.decorators = removeDecoratorsByName(member.decorators, DECORATORS_TO_REMOVE);
    }
  });

  return classNode;
}


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


export function removeStencilImports(): ts.TransformerFactory<ts.SourceFile> {

  return transformCtx => {

    return tsSourceFile => {
      function visitNode(node: ts.Node): any {
        if (node.kind === ts.SyntaxKind.ImportDeclaration) {
          return removeStencilImport(node as ts.ImportDeclaration);
        }

        return ts.visitEachChild(node, visitNode, transformCtx);
      }

      return ts.visitEachChild(tsSourceFile, visitNode, transformCtx);
    };
  };
}
