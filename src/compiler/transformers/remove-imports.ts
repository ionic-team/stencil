import { BuildContext } from '../interfaces';
import * as ts from 'typescript';

// same as the "declare" variables in the root index.ts file
const IONIC_GLOBALS = ['Component', 'h', 'Ionic', 'Prop', 'Watch'];


export function removeImports(ctx: BuildContext): ts.TransformerFactory<ts.SourceFile> {

  return (transformContext) => {

    function visitImport(importNode: ts.ImportDeclaration) {
      const importSpecifiers: ts.ImportSpecifier[] = [];

      importNode.importClause.namedBindings.forEachChild(nb => {
        if (nb.kind === ts.SyntaxKind.ImportSpecifier) {
          const importSpecifier = nb as ts.ImportSpecifier;

          if (IONIC_GLOBALS.indexOf(importSpecifier.name.text) === -1) {
            importSpecifiers.push(importSpecifier);
          }
        }
      });

      const namedImports = ts.createNamedImports(importSpecifiers);

      const newImportClause = ts.updateImportClause(importNode.importClause, importNode.importClause.name, namedImports);

      return ts.updateImportDeclaration(importNode, importNode.decorators, importNode.modifiers, newImportClause, importNode.moduleSpecifier);
    }

    function visit(node: ts.Node): ts.VisitResult<ts.Node> {
      switch (node.kind) {

        case ts.SyntaxKind.ImportDeclaration:
          return visitImport(node as ts.ImportDeclaration);

        default:
          return ts.visitEachChild(node, (node) => {
            return visit(node);
          }, transformContext);
      }
    }

    return (tsSourceFile) => {
      const fileMeta = ctx.files.get(tsSourceFile.fileName);
      if (fileMeta && fileMeta.hasCmpClass) {
        return visit(tsSourceFile) as ts.SourceFile;
      }

      return tsSourceFile;
    }
  }

}
