import ts from 'typescript';
import type * as d from '../../../declarations';
export declare const validateTsConfig: (config: d.ValidatedConfig, sys: d.CompilerSystem, init: d.LoadConfigInit) => Promise<{
    path: string;
    compilerOptions: ts.CompilerOptions;
    files: string[];
    include: string[];
    exclude: string[];
    extends: string;
    diagnostics: d.Diagnostic[];
}>;
/**
 * Determines if the included `src` argument belongs in `includeProp`.
 *
 * This function normalizes the paths found in both arguments, to catch cases where it's called with:
 * ```ts
 * hasSrcDirectoryInclude(['src'], './src'); // should return `true`
 * ```
 *
 * @param includeProp the paths in `include` that should be tested
 * @param src the path to find in `includeProp`
 * @returns true if the provided `src` directory is found, `false` otherwise
 */
export declare const hasSrcDirectoryInclude: (includeProp: string[], src: string) => boolean;
