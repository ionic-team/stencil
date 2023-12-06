import type * as d from '../../declarations';
export declare function hydrateApp(win: Window & typeof globalThis, opts: d.HydrateFactoryOptions, results: d.HydrateResults, afterHydrate: (win: Window, opts: d.HydrateFactoryOptions, results: d.HydrateResults, resolve: (results: d.HydrateResults) => void) => void, resolve: (results: d.HydrateResults) => void): void;
