import type * as d from '../declarations';
/**
 * Given a {@link d.RuntimeRef} retrieve the corresponding {@link d.HostRef}
 *
 * @param ref the runtime ref of interest
 * @returns the Host reference (if found) or undefined
 */
export declare const getHostRef: (ref: d.RuntimeRef) => d.HostRef | undefined;
/**
 * Register a lazy instance with the {@link hostRefs} object so it's
 * corresponding {@link d.HostRef} can be retrieved later.
 *
 * @param lazyInstance the lazy instance of interest
 * @param hostRef that instances `HostRef` object
 * @returns a reference to the host ref WeakMap
 */
export declare const registerInstance: (lazyInstance: any, hostRef: d.HostRef) => WeakMap<d.RuntimeRef, d.HostRef>;
/**
 * Register a host element for a Stencil component, setting up various metadata
 * and callbacks based on {@link BUILD} flags as well as the component's runtime
 * metadata.
 *
 * @param hostElement the host element to register
 * @param cmpMeta runtime metadata for that component
 * @returns a reference to the host ref WeakMap
 */
export declare const registerHost: (hostElement: d.HostElement, cmpMeta: d.ComponentRuntimeMeta) => WeakMap<d.RuntimeRef, d.HostRef>;
export declare const isMemberInElement: (elm: any, memberName: string) => boolean;
