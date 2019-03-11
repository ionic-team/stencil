import * as d from '../../declarations';
import ts from 'typescript';


export function removeCollectionImports(compilerCtx: d.CompilerCtx): ts.TransformerFactory<ts.SourceFile> {
  /*

    // remove side effect collection imports like:
    import 'ionicons';

    // do not remove collection imports with importClauses:
    import * as asdf 'ionicons';
    import { asdf } '@ionic/core';

  */

  return transformCtx => {

    function visitImport(importNode: ts.ImportDeclaration) {
      if (!importNode.importClause && importNode.moduleSpecifier && ts.isStringLiteral(importNode.moduleSpecifier)) {
        // must not have an import clause
        // must have a module specifier and
        // the module specifier must be a string literal
        const moduleImport = importNode.moduleSpecifier.text;

        // test if this side effect import is a collection
        const isCollectionImport = compilerCtx.collections.some(c => {
          return c.collectionName === moduleImport;
        });

        if (isCollectionImport) {
          // turns out this is a side effect import is a collection,
          // we actually don't want to include this in the JS output
          // we've already gather the types we needed, kthxbai
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
          return ts.visitEachChild(node, visit, transformCtx);
      }
    }

    return (tsSourceFile) => {
      return visit(tsSourceFile) as ts.SourceFile;
    };
  };
}
