import ts from 'typescript';


export const updateStencilCoreImports = (updatedCoreImportPath: string): ts.TransformerFactory<ts.SourceFile> => {

  return transformCtx => {

    function visit(tsSourceFile: ts.SourceFile, node: ts.Node): ts.VisitResult<ts.Node> {
      if (ts.isImportDeclaration(node)) {
        return updateStencilCoreImport(node, updatedCoreImportPath);
      }

      return ts.visitEachChild(node, node => visit(tsSourceFile, node), transformCtx);
    }

    return tsSourceFile => {
      return visit(tsSourceFile, tsSourceFile) as ts.SourceFile;
    };
  };
};


export const updateStencilCoreImport = (importNode: ts.ImportDeclaration, updatedCoreImportPath: string) => {
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
            ts.createStringLiteral(updatedCoreImportPath)
          );
        }
      }
      return null;
    }
  }
  return importNode;
};

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
