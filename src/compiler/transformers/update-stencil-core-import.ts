import ts from 'typescript';
import { STENCIL_CORE_ID } from '../bundle/entry-alias-ids';

export const updateStencilCoreImports = (updatedCoreImportPath: string): ts.TransformerFactory<ts.SourceFile> => {
  return () => {
    return (tsSourceFile) => {
      if (STENCIL_CORE_ID === updatedCoreImportPath) {
        return tsSourceFile;
      }

      let madeChanges = false;
      const newStatements: ts.Statement[] = [];

      tsSourceFile.statements.forEach((s) => {
        if (ts.isImportDeclaration(s)) {
          if (s.moduleSpecifier != null && ts.isStringLiteral(s.moduleSpecifier)) {
            if (s.moduleSpecifier.text === STENCIL_CORE_ID) {
              if (
                s.importClause &&
                s.importClause.namedBindings &&
                s.importClause.namedBindings.kind === ts.SyntaxKind.NamedImports
              ) {
                const origImports = s.importClause.namedBindings.elements;

                const keepImports = origImports.map((e) => e.getText()).filter((name) => KEEP_IMPORTS.has(name));

                if (keepImports.length > 0) {
                  const newImport = ts.updateImportDeclaration(
                    s,
                    undefined,
                    undefined,
                    ts.createImportClause(
                      undefined,
                      ts.createNamedImports(
                        keepImports.map((name) => ts.createImportSpecifier(undefined, ts.createIdentifier(name)))
                      )
                    ),
                    ts.createStringLiteral(updatedCoreImportPath)
                  );
                  newStatements.push(newImport);
                }
              }
              madeChanges = true;
              return;
            }
          }
        }
        newStatements.push(s);
      });

      if (madeChanges) {
        return ts.updateSourceFileNode(
          tsSourceFile,
          newStatements,
          tsSourceFile.isDeclarationFile,
          tsSourceFile.referencedFiles,
          tsSourceFile.typeReferenceDirectives,
          tsSourceFile.hasNoDefaultLib,
          tsSourceFile.libReferenceDirectives
        );
      }

      return tsSourceFile;
    };
  };
};

const KEEP_IMPORTS = new Set([
  'h',
  'setMode',
  'getMode',
  'setPlatformHelpers',
  'Build',
  'Env',
  'Host',
  'Fragment',
  'getAssetPath',
  'writeTask',
  'readTask',
  'getElement',
  'forceUpdate',
  'getRenderingRef',
  'forceModeUpdate',
  'setErrorHandler',
]);
