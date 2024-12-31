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
 * A WeakSet used to store references to host elements and lazy instances.
 * Keys of `hostRefs` are either:
 *   - an instance of HTMLElement
 *   - an instance of `d.HostRef`
 *   - an instance of the component class
 */
const hostRefKeys: (d.HostRef | HTMLElement | d.HostElement)[] = [];

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
export const registerInstance = (lazyInstance: any, hostRef: d.HostRef) => {
  hostRef.$lazyInstance$ = lazyInstance;
  hostRefKeys.push(lazyInstance);
  return hostRefs.set(lazyInstance, hostRef);
};

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
  hostRefKeys.push(hostElement);
  return hostRefs.set(hostElement, hostRef);
};

export const isMemberInElement = (elm: any, memberName: string) => memberName in elm;

/**
 * Check if a node is attached to the DOM
 * @param node an element or document
 * @returns true if the node is attached to the DOM
 */
function isNodeAttached(node: Node) {
  return node === document || node === document.documentElement || document.contains(node);
}

export const hostRefCleanup = () => {
  /**
   * Get array of all keys that should be removed
   */
  const keysToRemove = [];

  /**
   * Iterate through your `hostRefKeys` and determine if the key should be removed.
   * We consider a key to be removed if:
   */
  for (const key of hostRefKeys) {
    // You need to maintain these keys separately
    /**
     * it is an instance of an HTMLElement and
     * it is not attached to the DOM anymore
     */
    if (key instanceof Node && !isNodeAttached(key)) {
      keysToRemove.push(key);
    }

    /**
     * it is an instance of a `d.HostRef` and
     * its host or ancestor element is not attached to the DOM anymore
     */
    const elem = hostRefs.get(key as d.HostElement);
    if (
      elem &&
      ((elem.$hostElement$ && !isNodeAttached(elem.$hostElement$)) ||
        (elem.$ancestorComponent$ && !isNodeAttached(elem.$ancestorComponent$)))
    ) {
      keysToRemove.push(key);
    }
  }

  /**
   * Remove all detached nodes from `hostRefs` and `hostRefKeys`
   */
  for (const key of keysToRemove) {
    hostRefs.delete(key);
    hostRefKeys.splice(hostRefKeys.indexOf(key), 1);
  }
};
