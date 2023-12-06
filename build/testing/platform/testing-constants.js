export const styles = new Map();
export const modeResolutionChain = [];
/**
 * A mapping of custom element tags (e.g. `my-component`) to their constructor
 */
export const cstrs = new Map();
/**
 * A collection of callbacks to run on a NodeJS process 'tick'
 */
export const queuedTicks = [];
export const queuedWriteTasks = [];
export const queuedReadTasks = [];
export const moduleLoaded = new Map();
export const queuedLoadModules = [];
/**
 * A collection of errors that were detected to surface during the rendering process
 */
export const caughtErrors = [];
/**
 * A mapping of runtime references to HTML elements to the data structure Stencil uses to track the element alongside
 * additional metadata
 */
export const hostRefs = new Map();
//# sourceMappingURL=testing-constants.js.map