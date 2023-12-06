import ts from 'typescript';
import type * as d from '../../declarations';
export declare const runTsProgram: (config: d.ValidatedConfig, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, tsBuilder: ts.BuilderProgram) => Promise<boolean>;
/**
 * Calculate a relative path for a `.d.ts` file, giving the location within
 * the typedef output directory where we'd like to write it to disk.
 *
 * The correct relative path for a `.d.ts` file is basically given by the
 * relative location of the _source_ file associated with the `.d.ts` file
 * within the Stencil project's source directory.
 *
 * Thus, in order to calculate this, we take the path to the source file, the
 * emit path calculated by typescript (which is going to be right next to the
 * emit location for the JavaScript that the compiler emits for the source file)
 * and we do a pairwise walk up the two paths, assembling path components as
 * we go, until the source file path is equal to the configured source
 * directory. Then the path components from the `emitDtsPath` can be reversed
 * and re-assembled into a suitable relative path.
 *
 * @param config a Stencil configuration object
 * @param srcPath the path to the source file for the `.d.ts` file of interest
 * @param emitDtsPath the emit path for the `.d.ts` file calculated by
 * TypeScript
 * @returns a relative path to a suitable location where the typedef file can be
 * written
 */
export declare const getRelativeDts: (config: d.ValidatedConfig, srcPath: string, emitDtsPath: string) => string;
