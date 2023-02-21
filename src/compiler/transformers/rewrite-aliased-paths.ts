import { normalizePath } from '@utils';
import { dirname, relative } from 'path';
import ts from 'typescript';

import { retrieveTsModifiers } from './transform-utils';

/**
 * Transform module import paths aliased with `paths` in `tsconfig.json` to
 * relative imported in `.d.ts` files.
 *
 * @param transformCtx a TypeScript transformation context
 * @returns a TypeScript transformer
 */
export function rewriteAliasedDTSImportPaths(
  transformCtx: ts.TransformationContext
): ts.Transformer<ts.Bundle | ts.SourceFile> {
  const compilerHost = ts.createCompilerHost(transformCtx.getCompilerOptions());

  return (tsBundleOrSourceFile) => {
    const fileName = ts.isBundle(tsBundleOrSourceFile)
      ? tsBundleOrSourceFile.getSourceFile().fileName
      : tsBundleOrSourceFile.fileName;

    return ts.visitEachChild(tsBundleOrSourceFile, visit(compilerHost, transformCtx, fileName), transformCtx);
  };
}

/**
 * Transform modules aliased with `paths` in `tsconfig.json` to relative
 * imported in source files.
 *
 * @param transformCtx a TypeScript transformation context
 * @returns a TypeScript transformer
 */
export function rewriteAliasedSourceFileImportPaths(
  transformCtx: ts.TransformationContext
): ts.Transformer<ts.SourceFile> {
  const compilerHost = ts.createCompilerHost(transformCtx.getCompilerOptions());

  return (tsSourceFile) => {
    return ts.visitEachChild(tsSourceFile, visit(compilerHost, transformCtx, tsSourceFile.fileName), transformCtx);
  };
}

/**
 * Visitor function used when rewriting aliased paths in both source files and
 * `.d.ts` output.
 *
 * @param compilerHost a TS compiler host
 * @param transformCtx a TS transformation context
 * @param sourceFilePath the path to the source file being visited
 * @returns a visitor which takes a node and optionally transforms imports
 */
function visit(compilerHost: ts.CompilerHost, transformCtx: ts.TransformationContext, sourceFilePath: string) {
  return (node: ts.Node): ts.VisitResult<ts.Node> => {
    if (!ts.isImportDeclaration(node)) {
      return node;
    }
    return rewriteAliasedImport(compilerHost, transformCtx, sourceFilePath, node);
  };
}

/**
 * This will rewrite the module identifier for a {@link ts.ImportDeclaration}
 * node to turn identifiers which are configured using the `paths` parameter in
 * `tsconfig.json` from whatever name they are bound to a relative path from the
 * importer to the importee.
 *
 * We need to handle this ourselves because while the TypeScript team supports
 * using the `paths` configuration to allow location-independent imports across
 * a project (i.e. importing a module without having to use its relative path
 * from the importing module) the TypeScript compiler has no built-in support
 * for resolving these identifiers to the actual modules they point to in the
 * `.js` and `.d.ts` files that it emits.
 *
 * So, for instance, if you have this set in `paths`:
 *
 * ```json
 * "paths": {
 *   "@utils": ["src/utils/index.ts""],
 * }
 * ```
 *
 * Then you'll be able to import it anywhere in your project:
 *
 * ```ts
 * // src/importing.ts
 * import { myUtil } from '@utils';
 * ```
 *
 * but unfortunately, in the compiled output you'll still have:
 *
 * ```js
 * // dist/importing.js
 * import { myUtil } from "@utils";
 * ```
 *
 * instead of what you _most likely_ want, which is:
 *
 * ```js
 * // dist/importing.js
 * import { myUtil } from "./utils";
 * ```
 *
 * The TypeScript team have stated pretty unequivocally that they will not
 * automatically resolve these identifiers to relative paths in output code
 * {@see https://github.com/microsoft/TypeScript/issues/10866} and have
 * said that resolving these module identifiers is the responsibility of module
 * bundling and build tools.
 *
 * So that means we've got to do it!
 *
 * This function does so by getting the resolved file path to any module which
 * is not 1) not external (i.e. not a dependency) and 2) is not already a
 * relative, file-path based import. It then replaces the module identifier
 * with the relative path from the importer to the importee.
 *
 * @param compilerHost a TS compiler host
 * @param transformCtx a TS transformation context
 * @param sourceFilePath the path to the source file being visited
 * @param node a TypeScript import declaration node
 * @returns a visitor which takes a node and optionally transforms imports
 */
function rewriteAliasedImport(
  compilerHost: ts.CompilerHost,
  transformCtx: ts.TransformationContext,
  sourceFilePath: string,
  node: ts.ImportDeclaration
): ts.ImportDeclaration {
  // this most likely won't be the case, but we'll leave it to TypeScript to
  // error in the case that the user does something like `import foo from 3;`
  if (!ts.isStringLiteral(node.moduleSpecifier)) {
    return node;
  }

  let importPath = node.moduleSpecifier.text;

  // We will ignore transforming any paths that are already relative paths or
  // imports from external modules/packages
  if (importPath.startsWith('.')) {
    return node;
  }

  const module = ts.resolveModuleName(importPath, sourceFilePath, transformCtx.getCompilerOptions(), compilerHost);

  const hasResolvedFileName = module.resolvedModule?.resolvedFileName != null;
  const isModuleFromNodeModules = module.resolvedModule?.isExternalLibraryImport === true;
  const shouldTranspileImportPath = hasResolvedFileName && !isModuleFromNodeModules;

  if (!shouldTranspileImportPath) {
    return node;
  }

  // Create a regular expression that will be used to remove the last file extension
  // from the import path
  const extensionRegex = new RegExp(
    Object.values(ts.Extension)
      .map((extension) => `${extension}$`)
      .join('|')
  );

  const resolvePathInDestination = module.resolvedModule.resolvedFileName;
  // get the normalized relative path from the importer to the importee
  importPath = normalizePath(relative(dirname(sourceFilePath), resolvePathInDestination).replace(extensionRegex, ''));

  return transformCtx.factory.updateImportDeclaration(
    node,
    retrieveTsModifiers(node),
    node.importClause,
    transformCtx.factory.createStringLiteral(importPath),
    node.assertClause
  );
}
