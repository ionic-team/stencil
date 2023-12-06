import type * as d from '../declarations';
export declare const formatLazyBundleRuntimeMeta: (bundleId: any, cmps: d.ComponentCompilerMeta[]) => d.LazyBundleRuntimeData;
/**
 * Transform metadata about a component from the compiler to a compact form for
 * use at runtime.
 *
 * @param compilerMeta component metadata gathered during compilation
 * @param includeMethods include methods in the component's members or not
 * @returns a compact format for component metadata, intended for runtime use
 */
export declare const formatComponentRuntimeMeta: (compilerMeta: d.ComponentCompilerMeta, includeMethods: boolean) => d.ComponentRuntimeMetaCompact;
export declare const stringifyRuntimeData: (data: any) => string;
