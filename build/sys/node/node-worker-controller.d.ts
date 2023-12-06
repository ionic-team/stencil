/// <reference types="node" />
/// <reference types="node" />
import { EventEmitter } from 'events';
import type * as d from '../../declarations';
import { NodeWorkerMain } from './node-worker-main';
/**
 * A custom EventEmitter which provides centralizes dispatching and control for
 * node.js workers ({@link NodeWorkerMain} instances)
 */
export declare class NodeWorkerController extends EventEmitter implements d.WorkerMainController {
    forkModulePath: string;
    workerIds: number;
    stencilId: number;
    isEnding: boolean;
    taskQueue: d.CompilerWorkerTask[];
    workers: NodeWorkerMain[];
    maxWorkers: number;
    useForkedWorkers: boolean;
    mainThreadRunner: {
        [fnName: string]: (...args: any[]) => Promise<any>;
    };
    /**
     * Create a node.js-specific worker controller, which controls and
     * coordinates distributing tasks to a series of child processes (tracked by
     * {@link NodeWorkerMain} instances). These child processes are node
     * processes executing a special worker script (`src/sys/node/worker.ts`)
     * which listens for {@link d.MsgToWorker} messages and runs certain tasks in
     * response.
     *
     * @param forkModulePath the path to the module which k
     * @param maxConcurrentWorkers the max number of worker threads to spin up
     */
    constructor(forkModulePath: string, maxConcurrentWorkers: number);
    onError(err: NodeJS.ErrnoException, workerId: number): void;
    onExit(workerId: number): void;
    startWorkers(): void;
    startWorker(): void;
    stopWorker(workerId: number): void;
    processTaskQueue(): void;
    send(...args: any[]): Promise<any>;
    handler(name: string): (...args: any[]) => Promise<any>;
    cancelTasks(): void;
    destroy(): void;
}
export declare function getNextWorker(workers: NodeWorkerMain[]): NodeWorkerMain;
