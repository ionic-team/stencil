import { BUILD } from '@app-data';

import type * as d from '../declarations';

/**
 * A WeakMap mapping runtime component references to their corresponding host reference
 * instances.
 *
 * **Note**: If we're in an HMR context we need to store a reference to this
 * value on `window` in order to maintain the mapping of {@link d.RuntimeRef}
 * to {@link d.HostRef} across HMR updates.
 *
 * This is necessary because when HMR updates for a component are processed by
 * the browser-side dev server client the JS bundle for that component is
 * re-fetched. Since the module containing {@link hostRefs} is included in
 * that bundle, if we do not store a reference to it the new iteration of the
 * component will not have access to the previous hostRef map, leading to a
 * bug where the new version of the component cannot properly initialize.
 */
const hostRefs: WeakMap<d.RuntimeRef, d.HostRef> = /*@__PURE__*/ BUILD.hotModuleReplacement
  ? ((window as any).__STENCIL_HOSTREFS__ ||= new WeakMap())
  : new WeakMap();

/**
 * Given a {@link d.RuntimeRef} retrieve the corresponding {@link d.HostRef}
 *
 * @param ref the runtime ref of interest
 * @returns the Host reference (if found) or undefined
 */
export const getHostRef = (ref: d.RuntimeRef): d.HostRef | undefined => hostRefs.get(ref);

/**
 * Register a lazy instance with the {@link hostRefs} object so it's
 * corresponding {@link d.HostRef} can be retrieved later.
 *
 * @param lazyInstance the lazy instance of interest
 * @param hostRef that instances `HostRef` object
 * @returns a reference to the host ref WeakMap
 */
export const registerInstance = (lazyInstance: any, hostRef: d.HostRef) =>
  hostRefs.set((hostRef.$lazyInstance$ = lazyInstance), hostRef);

/**
 * Register a host element for a Stencil component, setting up various metadata
 * and callbacks based on {@link BUILD} flags as well as the component's runtime
 * metadata.
 *
 * @param hostElement the host element to register
 * @param cmpMeta runtime metadata for that component
 * @returns a reference to the host ref WeakMap
 */
export const registerHost = (hostElement: d.HostElement, cmpMeta: d.ComponentRuntimeMeta) => {
  const hostRef: d.HostRef = {
    $flags$: 0,
    $hostElement$: hostElement,
    $cmpMeta$: cmpMeta,
    $instanceValues$: new Map(),
  };
  if (BUILD.isDev) {
    hostRef.$renderCount$ = 0;
  }
  if (BUILD.method && BUILD.lazyLoad) {
    hostRef.$onInstancePromise$ = new Promise((r) => (hostRef.$onInstanceResolve$ = r));
  }
  if (BUILD.asyncLoading) {
    hostRef.$onReadyPromise$ = new Promise((r) => (hostRef.$onReadyResolve$ = r));
    hostElement['s-p'] = [];
    hostElement['s-rc'] = [];
  }
  return hostRefs.set(hostElement, hostRef);
};

export const isMemberInElement = (elm: any, memberName: string) => memberName in elm;
