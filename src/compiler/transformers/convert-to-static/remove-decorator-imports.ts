import ts from 'typescript';


export function removeDecoratorImports(): ts.TransformerFactory<ts.SourceFile> {

  return (transformContext) => {

    function visitImport(importNode: ts.ImportDeclaration) {
      if (isStencilCoreImport(importNode)) {

        if (importNode.importClause && importNode.importClause.namedBindings && (importNode.importClause.namedBindings as ts.NamedImports).elements) {
          const elements = (importNode.importClause.namedBindings as ts.NamedImports).elements;

          (importNode.importClause.namedBindings as ts.NamedImports).elements = elements.filter(importElm => {
            const text = importElm.getText();
            return text === 'h';
          }) as any;
        }

        if ((importNode.importClause.namedBindings as ts.NamedImports).elements.length === 0) {
          return null;
        }
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


function isStencilCoreImport(importNode: ts.ImportDeclaration) {
  return importNode.moduleSpecifier &&
    ts.isStringLiteral(importNode.moduleSpecifier) &&
    importNode.moduleSpecifier.text === '@stencil/core';
}
