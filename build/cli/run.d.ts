import type * as d from '../declarations';
import { CoreCompiler } from './load-compiler';
export declare const run: (init: d.CliInitOptions) => Promise<void>;
/**
 * Run a specified task
 *
 * @param coreCompiler an instance of a minimal, bootstrap compiler for running the specified task
 * @param config a configuration for the Stencil project to apply to the task run
 * @param task the task to run
 * @param sys the {@link CompilerSystem} for interacting with the operating system
 * @public
 * @returns a void promise
 */
export declare const runTask: (coreCompiler: CoreCompiler, config: d.Config, task: d.TaskCommand, sys: d.CompilerSystem) => Promise<void>;
