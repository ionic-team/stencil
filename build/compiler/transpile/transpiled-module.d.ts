import ts from 'typescript';
import type * as d from '../../declarations';
/**
 * Helper function for retrieving a Stencil {@link Module} from the provided compiler context
 * @param compilerCtx the compiler context to retrieve the `Module` from
 * @param filePath the path of the file corresponding to the `Module` to lookup
 * @returns the `Module`, or `undefined` if one cannot be found
 */
export declare const getModule: (compilerCtx: d.CompilerCtx, filePath: string) => d.Module | undefined;
/**
 * Creates a {@link Module} entity with reasonable defaults
 * @param staticSourceFile the TypeScript representation of the source file. This may not be the original
 * representation of the file, but instead a new `SourceFile` created using the TypeScript API
 * @param staticSourceFileText the text from the `SourceFile`. This text may originate from the original representation
 * of the file.
 * @param emitFilepath the path of the JavaScript file that should be emitted after transpilation
 * @returns the created `Module`
 */
export declare const createModule: (staticSourceFile: ts.SourceFile, staticSourceFileText: string, emitFilepath: string) => d.Module;
