import ts from 'typescript';
import type * as d from '../../declarations';
import { ValidatedConfig } from '../../declarations';
/**
 * Add a type reference to the library if it has not already been added. This
 * function then returns the unique identifier for that type so a reference to
 * it can be stored.
 *
 * @param type the type we want to add
 * @param typeName the type's name
 * @param checker a {@link ts.TypeChecker} instance
 * @param pathToTypeModule the path to the home module of the type
 * @returns the unique ID for the type in question
 */
export declare function addToLibrary(type: ts.Type, typeName: string, checker: ts.TypeChecker, pathToTypeModule: string): string;
/**
 * This returns a reference to the cached {@link d.JsonDocsTypeLibrary} which
 * lives in this module.
 *
 * @returns a reference to the type library
 */
export declare function getTypeLibrary(): d.JsonDocsTypeLibrary;
/**
 * Helper function that, given a file containing interfaces to document, will
 * add all the types exported from that file to the type library.
 *
 * This will exclude any types that are marked 'private' via JSDoc.
 *
 * @param config a validated user-supplied configuration
 * @param filePath the path to the file of interest (must be resolvable from
 * `process.cwd()`)
 */
export declare function addFileToLibrary(config: ValidatedConfig, filePath: string): void;
/**
 * Given a `ts.SourceFile` representing an importer module and an import path
 * representing the path to another module, return the {@link ts.SourceFile}
 * corresponding to the imported module.
 *
 * @param importer the source file which imports the module of interest
 * @param importPath the import path to the module of interest
 * @param options typescript compiler options
 * @param compilerHost a {@link ts.CompilerHost}
 * @param program a {@link ts.Program}
 * @returns a {@link ts.SourceFile} for the imported module or `undefined` if
 * it can't be resolved
 */
export declare function getHomeModule(importer: ts.SourceFile, importPath: string, options: ts.CompilerOptions, compilerHost: ts.CompilerHost, program: ts.Program): ts.SourceFile | undefined;
/**
 * Given the name of a type, attempt to find the type declaration in the
 * {@link ts.SourceFile} where it is declared.
 *
 * @param module the home module for the type of interest
 * @param typeName the name of the type of interest
 * @returns a type declaration for the type of interest or `undefined` if it
 * cannot be found
 */
export declare function findTypeWithName(module: ts.SourceFile, typeName: string): TypeDeclLike | undefined;
/**
 * Get the original name for a given type, dereferencing if it's an alias for
 * another type.
 *
 * @param identifier an identifier for the type whose 'true name' we're after
 * @param checker a {@link ts.TypeChecker} instance
 * @returns the type's original, un-aliased name (if successful) or `undefined`
 * if not
 */
export declare function getOriginalTypeName(identifier: ts.Node, checker: ts.TypeChecker): string | undefined;
/**
 * The 'type declaration like' syntax node types
 */
type TypeDeclLike = ts.InterfaceDeclaration | ts.TypeAliasDeclaration | ts.EnumDeclaration;
export {};
