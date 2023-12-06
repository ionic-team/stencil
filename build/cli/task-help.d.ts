import type * as d from '../declarations';
import { ConfigFlags } from './config-flags';
/**
 * Entrypoint for the Help task, providing Stencil usage context to the user
 * @param flags configuration flags provided to Stencil when a task was call (either this task or a task that invokes
 * telemetry)
 * @param logger a logging implementation to log the results out to the user
 * @param sys the abstraction for interfacing with the operating system
 */
export declare const taskHelp: (flags: ConfigFlags, logger: d.Logger, sys: d.CompilerSystem) => Promise<void>;
