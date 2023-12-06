import type * as d from '../../declarations';
export declare class NodeResolveModule {
    private resolveModuleCache;
    resolveModule(fromDir: string, moduleId: string, opts?: d.ResolveModuleOptions): string;
    resolveTypesModule(fromDir: string, moduleId: string, cacheKey: string): string;
    resolveModuleManually(fromDir: string, moduleId: string, cacheKey: string): string;
}
