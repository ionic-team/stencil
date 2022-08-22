import { normalize, relative } from 'path';
import ts from 'typescript';
import type * as d from '../../declarations';

/**
 * This method is responsible for replacing user-defined import path aliases ({@link https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping})
 * with generated relative import paths during the transformation step of the TS compilation process.
 * This action is taken to prevent issues with import paths not being transpiled at build time resulting in
 * unknown imports in output code for some output targets (`dist-collection` for instance). Output targets that do not run through a bundler
 * are unable to resolve imports using the aliased path names and TS intentionally does not replace resolved paths as a part of
 * their compiler ({@link https://github.com/microsoft/TypeScript/issues/10866})
 *
 * @param config The Stencil configuration object.
 * @returns A factory for creating a {@link ts.Transformer}.
 */
export const mapImportsToPathAliases = (config: d.Config): ts.TransformerFactory<ts.SourceFile> => {
  return (transformCtx) => {
    let sourceFile: string;

    const compilerHost = ts.createCompilerHost(config.tsCompilerOptions);

    const visit = (node: ts.Node): ts.VisitResult<ts.Node> => {
      if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
        let importPath = node.moduleSpecifier.text;

        // We will ignore transforming any paths that are already relative paths or
        // imports from external modules/packages
        if (!importPath.startsWith('.')) {
          const module = ts.resolveModuleName(importPath, sourceFile, config.tsCompilerOptions, compilerHost);

          if (
            module.resolvedModule?.isExternalLibraryImport === false &&
            module.resolvedModule?.resolvedFileName != null
          ) {
            importPath = normalize(
              relative(sourceFile, module.resolvedModule.resolvedFileName).replace(module.resolvedModule.extension, '')
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
      sourceFile = tsSourceFile.fileName;

      return ts.visitEachChild(tsSourceFile, visit, transformCtx);
    };
  };
};
