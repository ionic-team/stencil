import type * as d from '../declarations';
export declare const cmpModules: Map<string, {
    [exportName: string]: d.ComponentConstructor;
}>;
export declare const loadModule: (cmpMeta: d.ComponentRuntimeMeta, hostRef: d.HostRef, hmrVersionId?: string) => Promise<d.ComponentConstructor> | d.ComponentConstructor;
