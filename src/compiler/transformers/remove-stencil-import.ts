import ts from 'typescript';


export function removeStencilImport(importNode: ts.ImportDeclaration) {
  if (importNode.moduleSpecifier != null && ts.isStringLiteral(importNode.moduleSpecifier)) {
    if (importNode.moduleSpecifier.text === '@stencil/core') {
      if (importNode.importClause && importNode.importClause.namedBindings && importNode.importClause.namedBindings.kind === ts.SyntaxKind.NamedImports) {
        const origImports = importNode.importClause.namedBindings.elements;
        const keepImports = origImports
          .map(e => e.getText())
          .filter(name => KEEP_IMPORTS.has(name));

        if (keepImports.length > 0) {
          return ts.updateImportDeclaration(
            importNode,
            undefined,
            undefined,
            ts.createImportClause(undefined, ts.createNamedImports(
              keepImports.map(name => ts.createImportSpecifier(
                undefined,
                ts.createIdentifier(name)
              ))
            )),
            importNode.moduleSpecifier
          );
        }
      }
      return null;
    }
  }
  return importNode;
}

const KEEP_IMPORTS = new Set([
  'h',
  'setMode',
  'getMode',
  'Build',
  'Host',
  'getAssetPath',
  'writeTask',
  'readTask',
  'getElement'
]);
