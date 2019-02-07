import ts from 'typescript';


export function removeStencilImport(importNode: ts.ImportDeclaration) {
  if (importNode.moduleSpecifier != null && ts.isStringLiteral(importNode.moduleSpecifier)) {
    if (importNode.moduleSpecifier.text === '@stencil/core') {
      return null;
    }
  }
  return importNode;
}
