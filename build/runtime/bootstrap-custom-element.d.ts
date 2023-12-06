import type * as d from '../declarations';
export declare const defineCustomElement: (Cstr: any, compactMeta: d.ComponentRuntimeMetaCompact) => void;
export declare const proxyCustomElement: (Cstr: any, compactMeta: d.ComponentRuntimeMetaCompact) => d.ComponentConstructor;
export declare const forceModeUpdate: (elm: d.RenderNode) => void;
