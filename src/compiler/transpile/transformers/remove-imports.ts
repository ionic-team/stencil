import * as ts from 'typescript';


// same as the "declare" variables in the root index.ts file
const REMOVE_GLOBALS = [
  'Component',
  'Element',
  'Event',
  'h',
  'Listen',
  'Method',
  'Prop',
  'PropDidChange',
  'PropWillChange',
  'State',
  'Watch'
];


export function removeImports(): ts.TransformerFactory<ts.SourceFile> {

  return (transformContext) => {

    function visitImport(importNode: ts.ImportDeclaration) {
      if (!importNode.importClause || typeof importNode.importClause.namedBindings === 'undefined') {
        return ts.visitEachChild(importNode, visit, transformContext);
      }

      const importSpecifiers: ts.ImportSpecifier[] = [];
      let hasKeeperImport = false;

      importNode.importClause.namedBindings.forEachChild(nb => {
        if (nb.kind === ts.SyntaxKind.ImportSpecifier) {
          const importSpecifier = nb as ts.ImportSpecifier;

          if (!isStencilDecorator(importNode, importSpecifier)) {
            importSpecifiers.push(importSpecifier);
          }

        } else {
          hasKeeperImport = true;
        }
      });

      if (importSpecifiers.length === 0 && !hasKeeperImport) {
        // no named imports left, so let's remove the import statement entirely
        return null;
      }

      const namedImports = ts.createNamedImports(importSpecifiers);
      const newImportClause = ts.updateImportClause(importNode.importClause, importNode.importClause.name, namedImports);

      return ts.updateImportDeclaration(importNode, importNode.decorators, importNode.modifiers, newImportClause, importNode.moduleSpecifier);
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


function isStencilDecorator(importNode: ts.ImportDeclaration, importSpecifier: ts.ImportSpecifier) {
  if (importNode.moduleSpecifier) {
    const importPath = importNode.moduleSpecifier.getText().replace(/\'|\"|\`/g, '');

    if (importPath === '@stencil/core') {
      return (REMOVE_GLOBALS.indexOf(importSpecifier.name.text) > -1);
    }
  }

  return false;
}
