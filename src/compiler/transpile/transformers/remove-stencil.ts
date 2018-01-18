import * as ts from 'typescript';


export function removeStencil(): ts.TransformerFactory<ts.SourceFile> {

  return (transformContext) => {

    function visitImport(importNode: ts.ImportDeclaration) {
      if (importNode.moduleSpecifier &&
          ts.isStringLiteral(importNode.moduleSpecifier) &&
          importNode.moduleSpecifier.text === '@stencil/core') {
        return null;
      }

      return importNode;
    }


    function visit(node: ts.Node): ts.VisitResult<ts.Node> {
      switch (node.kind) {
        case ts.SyntaxKind.ImportDeclaration:
          return visitImport(node as ts.ImportDeclaration);
        default:
          return ts.visitEachChild(node, visit, transformContext);
      }
    }

    return (tsSourceFile) => {
      return visit(tsSourceFile) as ts.SourceFile;
    };
  };
}
