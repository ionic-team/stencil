import type { CliInitOptions, CompilerSystem, Config, Logger, TaskCommand } from '@stencil/core/internal';
import type { ConfigFlags } from './config-flags';

/**
 * Runs the CLI with the given options. This is used by Stencil's default `bin/stencil` file,
 * but can be used externally too.
 */
export declare function run(init: CliInitOptions): Promise<void>;

/**
 * Run individual CLI tasks.
 * @param coreCompiler The core Stencil compiler to be used. The `run()` method handles loading the core compiler, however, `runTask()` must be passed it.
 * @param config Assumes the config has already been validated and has the "sys" and "logger" properties.
 * @param task The task command to run, such as `build`.
 */
export declare function runTask(coreCompiler: any, config: Config, task: TaskCommand): Promise<void>;

// TODO(STENCIL-509): remove the _sys parameter here (for v3)
export declare function parseFlags(args: string[], _sys?: CompilerSystem): ConfigFlags;

export { CompilerSystem, Config, ConfigFlags, Logger, TaskCommand };
