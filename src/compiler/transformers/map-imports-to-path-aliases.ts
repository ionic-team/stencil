import { normalizePath } from '@utils';
import { dirname, relative } from 'path';
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
 * @param destinationFilePath The location on disk the file will be written to.
 * @param outputTarget The configuration for the collection output target.
 * @returns A factory for creating a {@link ts.Transformer}.
 */
export const mapImportsToPathAliases = (
  config: d.ValidatedConfig,
  destinationFilePath: string,
  outputTarget: d.OutputTargetDistCollection
): ts.TransformerFactory<ts.SourceFile> => {
  return (transformCtx) => {
    const compilerHost = ts.createCompilerHost(config.tsCompilerOptions);

    const visit =
      (sourceFile: string) =>
      (node: ts.Node): ts.VisitResult<ts.Node> => {
        // Only transform paths when the `transformAliasedImportPaths` flag is
        // set on the output target config
        //
        // We should only attempt to transform standard module imports:
        // - import * as ts from 'typescript';
        // - import { Foo, Bar } from 'baz';
        // - import { Foo as Bar } from 'baz';
        // - import Foo from 'bar';
        // We should NOT transform other import declaration types:
        // - import a = Foo.Bar
        if (
          outputTarget.transformAliasedImportPaths &&
          ts.isImportDeclaration(node) &&
          ts.isStringLiteral(node.moduleSpecifier)
        ) {
          let importPath = node.moduleSpecifier.text;

          // We will ignore transforming any paths that are already relative paths or
          // imports from external modules/packages
          if (!importPath.startsWith('.')) {
            const module = ts.resolveModuleName(importPath, sourceFile, config.tsCompilerOptions, compilerHost);

            const hasResolvedFileName = module.resolvedModule?.resolvedFileName != null;
            const isModuleFromNodeModules = module.resolvedModule?.isExternalLibraryImport === true;
            const shouldTranspileImportPath = hasResolvedFileName && !isModuleFromNodeModules;

            if (shouldTranspileImportPath) {
              // Create a regular expression that will be used to remove the last file extension
              // from the import path
              const extensionRegex = new RegExp(
                Object.values(ts.Extension)
                  .map((extension) => `${extension}$`)
                  .join('|')
              );

              // In order to make sure the relative path works when the destination depth is different than the source
              // file structure depth, we need to determine where the resolved file exists relative to the destination directory
              const resolvePathInDestination = module.resolvedModule.resolvedFileName.replace(
                config.srcDir,
                outputTarget.collectionDir
              );

              importPath = normalizePath(
                relative(dirname(destinationFilePath), resolvePathInDestination).replace(extensionRegex, '')
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

        return ts.visitEachChild(node, visit(sourceFile), transformCtx);
      };

    return (tsSourceFile) => {
      return ts.visitEachChild(tsSourceFile, visit(tsSourceFile.fileName), transformCtx);
    };
  };
};
