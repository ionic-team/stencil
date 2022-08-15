import { dirname, relative } from 'path';
import ts from 'typescript';
import type * as d from '../../declarations';

export const mapImportsToPathAliases = ({ tsCompilerOptions }: d.Config): ts.TransformerFactory<ts.SourceFile> => {
  return (transformCtx) => {
    let dirPath: string;
    let sourceFile: string;

    const compilerHost = ts.createCompilerHost(tsCompilerOptions);

    const visit = (node: ts.Node): ts.VisitResult<ts.Node> => {
      if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
        let importPath = node.moduleSpecifier.text;

        if (!importPath.startsWith('.')) {
          const module = ts.resolveModuleName(importPath, sourceFile, tsCompilerOptions, compilerHost);

          if (
            module.resolvedModule?.isExternalLibraryImport === false &&
            module.resolvedModule?.resolvedFileName != null
          ) {
            importPath = relative(dirPath, module.resolvedModule.resolvedFileName).replace(
              module.resolvedModule.extension,
              ''
            );
          }
        }

        return transformCtx.factory.updateImportDeclaration(
          node,
          node.decorators,
          node.modifiers,
          node.importClause,
          transformCtx.factory.createStringLiteral(importPath),
          node.assertClause
        );
      }

      return ts.visitEachChild(node, visit, transformCtx);
    };

    return (tsSourceFile) => {
      dirPath = dirname(tsSourceFile.fileName);
      sourceFile = tsSourceFile.fileName;

      return ts.visitEachChild(tsSourceFile, visit, transformCtx);
    };
  };
};
