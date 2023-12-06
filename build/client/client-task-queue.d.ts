import type * as d from '../declarations';
export declare const nextTick: (cb: () => void) => Promise<void>;
export declare const readTask: (cb: d.RafCallback) => void;
export declare const writeTask: (cb: d.RafCallback) => void;
