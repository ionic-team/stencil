import ts from 'typescript';


export function removeStencilImport(importNode: ts.ImportDeclaration) {
  if (importNode.moduleSpecifier && ts.isStringLiteral(importNode.moduleSpecifier)) {
    const importPath = importNode.moduleSpecifier.text;
    if (importPath === '@stencil/core') {
      return null;
    }
  }
  return importNode;
}
