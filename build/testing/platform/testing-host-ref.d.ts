import type * as d from '@stencil/core/internal';
/**
 * Retrieve the data structure tracking the component by its runtime reference
 * @param elm the reference to the element
 * @returns the corresponding Stencil reference data structure, or undefined if one cannot be found
 */
export declare const getHostRef: (elm: d.RuntimeRef | undefined) => d.HostRef | undefined;
/**
 * Add the provided `hostRef` instance to the global {@link hostRefs} map, using the provided `lazyInstance` as a key.
 * @param lazyInstance a Stencil component instance
 * @param hostRef an optional reference to Stencil's tracking data for the component. If none is provided, one will be created.
 * @returns the updated `hostRefs` data structure
 * @throws if the provided `lazyInstance` coerces to `null`, or if the `lazyInstance` does not have a `constructor`
 * property
 */
export declare const registerInstance: (lazyInstance: any, hostRef: d.HostRef | null | undefined) => Map<d.RuntimeRef, d.HostRef>;
/**
 * Create a new {@link d.HostRef} instance to the global {@link hostRefs} map, using the provided `elm` as a key.
 * @param elm an HTMLElement instance associated with the Stencil component
 * @param cmpMeta the component compiler metadata associated with the component
 */
export declare const registerHost: (elm: d.HostElement, cmpMeta: d.ComponentRuntimeMeta) => void;
