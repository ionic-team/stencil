import type * as d from '@stencil/core/internal';
/**
 * Reset the various data structures related to the testing rendering pipeline
 */
export declare function resetTaskQueue(): void;
/**
 * Pushes the provided callback onto the {@link queuedTicks} data structure
 * @param cb the callback to add to `queuedTicks`
 */
export declare const nextTick: (cb: Function) => void;
/**
 * Execute the callbacks in {@link queuedTicks} on the next NodeJS tick.
 *
 * Callbacks are invoked in the order that they appear in `queuedTasks` at the time this function is invoked.
 * Async callbacks are not `await`ed.
 *
 * Any callbacks that are added to `queuedTasks` while this function is running are scheduled to be flushed on the
 * next tick.
 */
export declare function flushTicks(): Promise<void>;
/**
 * Push a RequestAnimationFrame callback onto the {@link queuedWriteTasks} data structure
 * @param cb the callback to push onto `queuedWriteTasks`
 */
export declare function writeTask(cb: d.RafCallback): void;
/**
 * Push a RequestAnimationFrame callback onto the {@link queuedReadTasks} data structure
 * @param cb the callback to push onto `queuedReadTasks`
 */
export declare function readTask(cb: d.RafCallback): void;
/**
 * Flush the {@link queuedReadTasks} and {@link queuedWriteTasks} data structures on the next NodeJS process tick.
 *
 * The read task queue is drained first, followed by the write task queue.
 * For each queue:
 * - Each task is processed in the order it is found in its respective data structure at the time `queuedReadTasks` and
 * `queuedWriteTasks` are read (note: these queues are not read at the same time).
 * - When a task queue is processed, it is marked as empty before acting on the entries in the queue.
 * - Items added to either queue after it has been read for processing will be handled on the subsequent tick.
 * - Async items will be `await`ed
 */
export declare function flushQueue(): Promise<void>;
export declare function flushAll(): Promise<void>;
/**
 * Add a component module to the global {@link queuedLoadModules} data structure
 * @param cmpMeta the component compiler metadata of the component to eventually load
 * @param _hostRef an unused parameter for a Stencil HostRef instance
 * @param _hmrVersionId an unused parameter denoting the current hot-module reloading version
 * @returns A promise that loads the component onto `queuedLoadModules`
 */
export declare function loadModule(cmpMeta: d.ComponentRuntimeMeta, _hostRef: d.HostRef, _hmrVersionId?: string): Promise<any>;
export declare function flushLoadModule(bundleId?: string): Promise<void>;
