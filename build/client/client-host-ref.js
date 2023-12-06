import { BUILD } from '@app-data';
import { addHostEventListeners } from '@runtime';
/**
 * A WeakMap mapping runtime component references to their corresponding host reference
 * instances.
 */
const hostRefs = /*@__PURE__*/ new WeakMap();
/**
 * Given a {@link d.RuntimeRef} retrieve the corresponding {@link d.HostRef}
 *
 * @param ref the runtime ref of interest
 * @returns the Host reference (if found) or undefined
 */
export const getHostRef = (ref) => hostRefs.get(ref);
/**
 * Register a lazy instance with the {@link hostRefs} object so it's
 * corresponding {@link d.HostRef} can be retrieved later.
 *
 * @param lazyInstance the lazy instance of interest
 * @param hostRef that instances `HostRef` object
 * @returns a reference to the host ref WeakMap
 */
export const registerInstance = (lazyInstance, hostRef) => hostRefs.set((hostRef.$lazyInstance$ = lazyInstance), hostRef);
/**
 * Register a host element for a Stencil component, setting up various metadata
 * and callbacks based on {@link BUILD} flags as well as the component's runtime
 * metadata.
 *
 * @param hostElement the host element to register
 * @param cmpMeta runtime metadata for that component
 * @returns a reference to the host ref WeakMap
 */
export const registerHost = (hostElement, cmpMeta) => {
    const hostRef = {
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
    addHostEventListeners(hostElement, hostRef, cmpMeta.$listeners$, false);
    return hostRefs.set(hostElement, hostRef);
};
export const isMemberInElement = (elm, memberName) => memberName in elm;
//# sourceMappingURL=client-host-ref.js.map