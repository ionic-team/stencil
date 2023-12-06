import type * as d from '@stencil/core/declarations';
/**
 * Create a worker context given a Stencil config. If
 * {@link d.Config['maxConcurrentWorkers']} is set to an appropriate value this
 * will be a worker context that dispatches work to other threads, and if not it
 * will be a single-threaded worker context.
 *
 * @param config the current stencil config
 * @returns a worker context
 */
export declare const createSysWorker: (config: d.ValidatedConfig) => d.CompilerWorkerContext;
