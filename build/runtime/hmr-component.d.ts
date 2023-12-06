import type * as d from '../declarations';
/**
 * Kick off hot-module-replacement for a component. In order to replace the
 * component in-place we:
 *
 * 1. get a reference to the {@link d.HostRef} for the element
 * 2. reset the element's runtime flags
 * 3. re-run the initialization logic for the element (via
 *    {@link initializeComponent})
 *
 * @param hostElement the host element for the component which we want to start
 * doing HMR
 * @param cmpMeta runtime metadata for the component
 * @param hmrVersionId the current HMR version ID
 */
export declare const hmrStart: (hostElement: d.HostElement, cmpMeta: d.ComponentRuntimeMeta, hmrVersionId: string) => void;
