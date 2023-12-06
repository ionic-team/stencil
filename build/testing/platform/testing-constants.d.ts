import type * as d from '@stencil/core/internal';
import { QueuedLoadModule } from './load-module';
export declare const styles: d.StyleMap;
export declare const modeResolutionChain: d.ResolutionHandler[];
/**
 * A mapping of custom element tags (e.g. `my-component`) to their constructor
 */
export declare const cstrs: Map<string, d.ComponentTestingConstructor>;
/**
 * A collection of callbacks to run on a NodeJS process 'tick'
 */
export declare const queuedTicks: Function[];
export declare const queuedWriteTasks: d.RafCallback[];
export declare const queuedReadTasks: d.RafCallback[];
export declare const moduleLoaded: Map<string, d.ComponentTestingConstructor>;
export declare const queuedLoadModules: QueuedLoadModule[];
/**
 * A collection of errors that were detected to surface during the rendering process
 */
export declare const caughtErrors: Error[];
/**
 * A mapping of runtime references to HTML elements to the data structure Stencil uses to track the element alongside
 * additional metadata
 */
export declare const hostRefs: Map<d.RuntimeRef, d.HostRef>;
