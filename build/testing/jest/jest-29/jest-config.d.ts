import type { Config } from '@jest/types';
import type * as d from '@stencil/core/internal';
/**
 * Builds the `argv` to be used when programmatically invoking the Jest CLI
 * @param config the Stencil config to use while generating Jest CLI arguments
 * @returns the arguments to pass to the Jest CLI, wrapped in an object
 */
export declare function buildJestArgv(config: d.ValidatedConfig): Config.Argv;
/**
 * Generate a Jest run configuration to be used as a part of the `argv` passed to the Jest CLI when it is invoked
 * programmatically
 * @param config the Stencil config to use while generating Jest CLI arguments
 * @returns the Jest Config to attach to the `argv` argument
 */
export declare function buildJestConfig(config: d.ValidatedConfig): string;
export declare function getProjectListFromCLIArgs(config: d.ValidatedConfig, argv: Config.Argv): string[];
