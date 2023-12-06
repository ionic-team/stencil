import type * as d from '../declarations';
import { ConfigFlags } from './config-flags';
/**
 * Entrypoint for the Telemetry task
 * @param flags configuration flags provided to Stencil when a task was called (either this task or a task that invokes
 * telemetry)
 * @param sys the abstraction for interfacing with the operating system
 * @param logger a logging implementation to log the results out to the user
 */
export declare const taskTelemetry: (flags: ConfigFlags, sys: d.CompilerSystem, logger: d.Logger) => Promise<void>;
