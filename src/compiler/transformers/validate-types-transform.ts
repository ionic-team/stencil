import { removeStencilImport, MEMBER_DECORATORS_TO_REMOVE, CLASS_DECORATORS_TO_REMOVE } from './remove-stencil-import';
import { removeDecorators } from './transform-utils';
import ts from 'typescript';

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
  removeDecorators(classNode, CLASS_DECORATORS_TO_REMOVE);

  classNode.members.forEach((member) => {
    if (Array.isArray(member.decorators)) {
      removeDecorators(member, MEMBER_DECORATORS_TO_REMOVE);
    }
  });

  return classNode;
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
