import type * as d from '../../declarations';
export declare const optimizeCriticalPath: (doc: Document, criticalBundlers: string[], outputTarget: d.OutputTargetWww) => void;
export declare const injectModulePreloads: (doc: Document, paths: string[]) => void;
