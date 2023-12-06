import type * as d from '../declarations';
/**
 * Initialize a Stencil component given a reference to its host element, its
 * runtime bookkeeping data structure, runtime metadata about the component,
 * and (optionally) an HMR version ID.
 *
 * @param elm a host element
 * @param hostRef the element's runtime bookkeeping object
 * @param cmpMeta runtime metadata for the Stencil component
 * @param hmrVersionId an (optional) HMR version ID
 */
export declare const initializeComponent: (elm: d.HostElement, hostRef: d.HostRef, cmpMeta: d.ComponentRuntimeMeta, hmrVersionId?: string) => Promise<void>;
export declare const fireConnectedCallback: (instance: any) => void;
