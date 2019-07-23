import { CLASS_DECORATORS_TO_REMOVE, MEMBER_DECORATORS_TO_REMOVE } from './decorators-to-static/decorator-utils';
import { removeDecorators } from './transform-utils';
import ts from 'typescript';
import { updateStencilCoreImport } from './update-stencil-core-import';


export const removeStencilDecorators = (): ts.TransformerFactory<ts.SourceFile> => {

  return transformCtx => {

    const visit = (node: ts.Node): ts.VisitResult<ts.Node> => {
      if (ts.isClassDeclaration(node)) {
        return visitComponentClass(node);
      }
      return ts.visitEachChild(node, visit, transformCtx);
    };
    return (tsSourceFile) => visit(tsSourceFile) as ts.SourceFile;
  };
};


const visitComponentClass = (classNode: ts.ClassDeclaration): ts.ClassDeclaration => {
  removeDecorators(classNode, CLASS_DECORATORS_TO_REMOVE);

  classNode.members.forEach((member) => {
    if (Array.isArray(member.decorators)) {
      removeDecorators(member, MEMBER_DECORATORS_TO_REMOVE);
    }
  });

  return classNode;
};


export const removeStencilImports = (): ts.TransformerFactory<ts.SourceFile> => {

  return transformCtx => {

    return tsSourceFile => {
      const visitNode = (node: ts.Node): any => {
        if (node.kind === ts.SyntaxKind.ImportDeclaration) {
          return updateStencilCoreImport(node as ts.ImportDeclaration, '@stencil/core');
        }

        return ts.visitEachChild(node, visitNode, transformCtx);
      };

      return ts.visitEachChild(tsSourceFile, visitNode, transformCtx);
    };
  };
};
