import { result } from '@utils';
import type { CompilerSystem, Diagnostic } from '../declarations';
/**
 * An object containing the {@link CompilerSystem} used to find the configuration file, as well as the location on disk
 * to search for a Stencil configuration
 */
export type FindConfigOptions = {
    sys: CompilerSystem;
    configPath: string;
};
/**
 * The results of attempting to find a Stencil configuration file on disk
 */
export type FindConfigResults = {
    configPath: string;
    rootDir: string;
};
/**
 * Attempt to find a Stencil configuration file on the file system
 * @param opts the options needed to find the configuration file
 * @returns the results of attempting to find a configuration file on disk
 */
export declare const findConfig: (opts: FindConfigOptions) => Promise<result.Result<FindConfigResults, Diagnostic[]>>;
