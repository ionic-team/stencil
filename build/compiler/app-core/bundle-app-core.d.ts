import type { OutputOptions, RollupBuild } from 'rollup';
import type * as d from '../../declarations';
/**
 * Generate rollup output based on a rollup build and a series of options.
 *
 * @param build a rollup build
 * @param options output options for rollup
 * @param config a user-supplied configuration object
 * @param entryModules a list of entry modules, for checking which chunks
 * contain components
 * @returns a Promise wrapping either build results or `null`
 */
export declare const generateRollupOutput: (build: RollupBuild, options: OutputOptions, config: d.ValidatedConfig, entryModules: d.EntryModule[]) => Promise<d.RollupResult[] | null>;
