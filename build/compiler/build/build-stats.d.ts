import { result } from '@utils';
import type * as d from '../../declarations';
/**
 * Generates the Build Stats from the buildCtx. Writes any files to the file system.
 * @param config the project build configuration
 * @param buildCtx An instance of the build which holds the details about the build
 * @returns CompilerBuildStats or an Object including diagnostics.
 */
export declare function generateBuildStats(config: d.ValidatedConfig, buildCtx: d.BuildCtx): result.Result<d.CompilerBuildStats, {
    diagnostics: d.Diagnostic[];
}>;
/**
 * Writes the files from the stats config to the file system
 * @param config the project build configuration
 * @param data the information to write out to disk (as specified by each stats output target specified in the provided
 * config)
 */
export declare function writeBuildStats(config: d.ValidatedConfig, data: result.Result<d.CompilerBuildStats, {
    diagnostics: d.Diagnostic[];
}>): Promise<void>;
