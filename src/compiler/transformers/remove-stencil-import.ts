import ts from 'typescript';


export function removeStencilImport(importNode: ts.ImportDeclaration) {
  if (importNode.moduleSpecifier != null && ts.isStringLiteral(importNode.moduleSpecifier)) {
    if (importNode.moduleSpecifier.text === '@stencil/core') {
      if (importNode.importClause && importNode.importClause.namedBindings && importNode.importClause.namedBindings.kind === ts.SyntaxKind.NamedImports) {
        const origImports = importNode.importClause.namedBindings.elements;
        const keepImports = origImports
          .map(e => e.getText())
          .filter(name => KEEP_IMPORTS.includes(name));

        if (origImports.length === keepImports.length) {
          return importNode;

        } else if (keepImports.length > 0) {
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
            ts.createLiteral('@stencil/core/app')
          );
        }
      }
      return null;
    }
  }
  return importNode;
}

export const KEEP_IMPORTS = [
  'h',
  'setMode',
  'getMode'
];
