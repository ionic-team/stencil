import { BUILD } from '@app-data';
import { reWireGetterSetter } from '@utils/es2022-rewire-class-members';

import type * as d from '../declarations';

/**
 * Given a {@link d.RuntimeRef} remove the corresponding {@link d.HostRef} from
 * the {@link hostRefs} WeakMap.
 *
 * @param ref the runtime ref of interest
 * @returns — true if the element was successfully removed, or false if it was not present.
 */
export const deleteHostRef = (ref: d.RuntimeRef): boolean => {
  if (ref.$hostRef$) {
    delete ref.$hostRef$;
    return true;
  }

  return false;
};

/**
 * Given a {@link d.RuntimeRef} retrieve the corresponding {@link d.HostRef}
 *
 * @param ref the runtime ref of interest
 * @returns the Host reference (if found) or undefined
 */
export const getHostRef = (ref: d.RuntimeRef): d.HostRef | undefined => {
  return ref.$hostRef$;
};

/**
 * Register a lazy instance with the {@link hostRefs} object so it's
 * corresponding {@link d.HostRef} can be retrieved later.
 *
 * @param lazyInstance the lazy instance of interest
 * @param hostRef that instances `HostRef` object
 */
export const registerInstance = (lazyInstance: any, hostRef: d.HostRef) => {
  lazyInstance.$hostRef$ = hostRef;
  hostRef.$lazyInstance$ = lazyInstance;

  if (BUILD.modernPropertyDecls && (BUILD.state || BUILD.prop)) {
    reWireGetterSetter(lazyInstance, hostRef);
  }
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

  const ref = (hostElement.$hostRef$ = hostRef);

  if (!BUILD.lazyLoad && BUILD.modernPropertyDecls && (BUILD.state || BUILD.prop)) {
    reWireGetterSetter(hostElement, hostRef);
  }

  return ref;
};

export const isMemberInElement = (elm: any, memberName: string) => memberName in elm;
