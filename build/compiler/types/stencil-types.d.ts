import type * as d from '../../declarations';
import { FsWriteResults } from '../sys/in-memory-fs';
/**
 * Update a type declaration file's import declarations using the module `@stencil/core`
 * @param typesDir the directory where type declaration files are expected to exist
 * @param dtsFilePath the path of the type declaration file being updated, used to derive the correct import declaration
 * module
 * @param dtsContent the content of a type declaration file to update
 * @returns the updated type declaration file contents
 */
export declare const updateStencilTypesImports: (typesDir: string, dtsFilePath: string, dtsContent: string) => string;
/**
 * Utility for ensuring that naming collisions do not appear in type declaration files for a component's class members
 * decorated with @Prop, @Event, and @Method
 * @param typeReferences all type names used by a component class member
 * @param typeImportData locally/imported/globally used type names, which may be used to prevent naming collisions
 * @param sourceFilePath the path to the source file of a component using the type being inspected
 * @param initialType the name of the type that may be updated
 * @returns the updated type name, which may be the same as the initial type name provided as an argument to this
 * function
 */
export declare const updateTypeIdentifierNames: (typeReferences: d.ComponentCompilerTypeReferences, typeImportData: d.TypesImportData, sourceFilePath: string, initialType: string) => string;
/**
 * Writes Stencil core typings file to disk for a dist-* output target
 * @param config the Stencil configuration associated with the project being compiled
 * @param compilerCtx the current compiler context
 * @returns the results of writing one or more type declaration files to disk
 */
export declare const copyStencilCoreDts: (config: d.ValidatedConfig, compilerCtx: d.CompilerCtx) => Promise<ReadonlyArray<FsWriteResults>>;
