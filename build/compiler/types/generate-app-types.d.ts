import type * as d from '../../declarations';
/**
 * Generates and writes a `components.d.ts` file to disk. This file may be written to the `src` directory of a project,
 * or be written to a directory that is meant to be distributed (e.g. the output directory of `dist-custom-elements`).
 * @param config the Stencil configuration associated with the project being compiled
 * @param compilerCtx the current compiler context
 * @param buildCtx the context associated with the current build
 * @param destination the relative directory in the filesystem to write the type declaration file to
 * @returns `true` if the type declaration file written to disk has changed, `false` otherwise
 */
export declare const generateAppTypes: (config: d.ValidatedConfig, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, destination: string) => Promise<boolean>;
