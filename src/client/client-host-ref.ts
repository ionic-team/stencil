import * as d from '@declarations';


const hostRefs: WeakMap<d.RuntimeRef, d.HostRef> = new WeakMap();

export const getHostRef = (ref: d.RuntimeRef) =>
  hostRefs.get(ref);

export const registerInstance = (lazyInstance: any, hostRef: d.HostRef) =>
  hostRefs.set(hostRef.lazyInstance = lazyInstance, hostRef);

export const registerHost = (elm: d.HostElement) =>
  hostRefs.set(elm, {
    stateFlags: 0,
    hostElement: elm,
    instanceValues: new Map(),
  });
