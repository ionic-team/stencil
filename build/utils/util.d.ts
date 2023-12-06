import type * as d from '../declarations';
/**
 * Create a stylistically-appropriate JS variable name from a filename
 *
 * If the filename has any of the special characters "?", "#", "&" and "=" it
 * will take the string before the left-most instance of one of those
 * characters.
 *
 * @param fileName the filename which serves as starting material
 * @returns a JS variable name based on the filename
 */
export declare const createJsVarName: (fileName: string) => string;
/**
 * Determines if a given file path points to a type declaration file (ending in .d.ts) or not. This function is
 * case-insensitive in its heuristics.
 * @param filePath the path to check
 * @returns `true` if the given `filePath` points to a type declaration file, `false` otherwise
 */
export declare const isDtsFile: (filePath: string) => boolean;
/**
 * Generate the preamble to be placed atop the main file of the build
 * @param config the Stencil configuration file
 * @returns the generated preamble
 */
export declare const generatePreamble: (config: d.ValidatedConfig) => string;
export declare function getTextDocs(docs: d.CompilerJsDoc | undefined | null): string;
/**
 * Adds a doc block to a string
 * @param str the string to add a doc block to
 * @param docs the compiled JS docs
 * @param indentation number of spaces to indent the block with
 * @returns the doc block
 */
export declare function addDocBlock(str: string, docs?: d.CompilerJsDoc, indentation?: number): string;
/**
 * Utility to determine whether a project has a dependency on a package
 * @param buildCtx the current build context to query for a specific package
 * @param depName the name of the dependency/package
 * @returns `true` if the project has a dependency a packaged with the provided name, `false` otherwise
 */
export declare const hasDependency: (buildCtx: d.BuildCtx, depName: string) => boolean;
export declare const readPackageJson: (config: d.ValidatedConfig, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) => Promise<void>;
/**
 * A type that describes the result of parsing a `package.json` file's contents
 */
export type ParsePackageJsonResult = {
    diagnostic: d.Diagnostic | null;
    data: any | null;
    filePath: string;
};
/**
 * Parse a string read from a `package.json` file
 * @param pkgJsonStr the string read from a `package.json` file
 * @param pkgJsonFilePath the path to the already read `package.json` file
 * @returns the results of parsing the provided contents of the `package.json` file
 */
export declare const parsePackageJson: (pkgJsonStr: string, pkgJsonFilePath: string) => ParsePackageJsonResult;
/**
 * Check whether a string is a member of a ReadonlyArray<string>
 *
 * We need a little helper for this because unfortunately `includes` is typed
 * on `ReadonlyArray<T>` as `(el: T): boolean` so a `string` cannot be passed
 * to `includes` on a `ReadonlyArray` 😢 thus we have a little helper function
 * where we do the type coercion just once.
 *
 * see microsoft/TypeScript#31018 for some discussion of this
 *
 * @param readOnlyArray the array we're checking
 * @param maybeMember a value which is possibly a member of the array
 * @returns whether the array contains the member or not
 */
export declare const readOnlyArrayHasStringMember: <T extends string>(readOnlyArray: readonly T[], maybeMember: string | T) => maybeMember is T;
