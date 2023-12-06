/// <reference types="node" />
/// <reference types="node" />
import * as cp from 'child_process';
import { EventEmitter } from 'events';
import type * as d from '../../declarations';
/**
 * A class that holds a reference to a node worker sub-process within the main
 * thread so that messages may be passed to it.
 */
export declare class NodeWorkerMain extends EventEmitter {
    id: number;
    /**
     * A handle for the OS process that is running our worker code
     */
    childProcess: cp.ChildProcess;
    tasks: Map<number, d.CompilerWorkerTask>;
    exitCode: number;
    processQueue: boolean;
    sendQueue: d.MsgToWorker<any>[];
    stopped: boolean;
    successfulMessage: boolean;
    totalTasksAssigned: number;
    /**
     * Create an object for holding and interacting with a reference to a worker
     * child-process.
     *
     * @param id a unique ID
     * @param forkModulePath the path to the module which should be run by the
     * child process
     */
    constructor(id: number, forkModulePath: string);
    fork(forkModulePath: string): void;
    run(task: d.CompilerWorkerTask): void;
    sendToWorker<T extends d.WorkerContextMethod>(msg: d.MsgToWorker<T>): void;
    receiveFromWorker<T extends d.WorkerContextMethod>(msgFromWorker: d.MsgFromWorker<T>): void;
    stop(): void;
}
