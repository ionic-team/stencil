/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import type * as d from '../../declarations';
/**
 * Initialize a worker thread, setting up various machinery for managing
 * communication between the child process (worker) and the main thread.
 *
 * @param process a NodeJS process
 * @param msgHandler a worker message handler, which processes incoming
 * messages
 */
export declare const initNodeWorkerThread: (process: NodeJS.Process, msgHandler: d.WorkerMsgHandler) => void;
