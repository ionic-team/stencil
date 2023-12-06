import ts from 'typescript';
/**
 * Transform module import paths aliased with `paths` in `tsconfig.json` to
 * relative imported in `.d.ts` files.
 *
 * @param transformCtx a TypeScript transformation context
 * @returns a TypeScript transformer
 */
export declare function rewriteAliasedDTSImportPaths(transformCtx: ts.TransformationContext): ts.Transformer<ts.Bundle | ts.SourceFile>;
/**
 * Transform modules aliased with `paths` in `tsconfig.json` to relative
 * imported in source files.
 *
 * @param transformCtx a TypeScript transformation context
 * @returns a TypeScript transformer
 */
export declare function rewriteAliasedSourceFileImportPaths(transformCtx: ts.TransformationContext): ts.Transformer<ts.SourceFile>;
