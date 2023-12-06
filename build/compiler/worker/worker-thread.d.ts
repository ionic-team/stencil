import type * as d from '../../declarations';
/**
 * Instantiate a worker context which synchronously calls the methods that are
 * defined on it (as opposed to dispatching them to a worker in another thread
 * via a worker controller). We want to do this in two cases:
 *
 * 1. we're in the main thread and not using any workers at all (i.e. the value
 *    for {@link d.Config['maxConcurrentWorkers']} is set to `1`) or
 * 2. we're already in a worker thread, so we want to call the method directly
 *    instead of dispatching.
 *
 * @param sys a compiler system appropriate for our current environment
 * @returns a worker context which directly calls the supported methods
 */
export declare const createWorkerContext: (sys: d.CompilerSystem) => d.CompilerWorkerContext;
/**
 * Create a handler for the IPC messages ({@link d.MsgToWorker}) that a worker
 * thread receives from the main thread. For each message that we receive we
 * need to call a specific method on {@link d.CompilerWorkerContext} and then
 * return the result
 *
 * @param sys a compiler system which wil be used to create a worker context
 * @returns a message handler capable of digesting and executing tasks
 * described by {@link d.MsgToWorker} object
 */
export declare const createWorkerMessageHandler: (sys: d.CompilerSystem) => d.WorkerMsgHandler;
