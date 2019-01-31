import * as d from '@declarations';


export const hostRefs: WeakMap<d.RuntimeRef, d.HostRef> = new WeakMap();

export const getHostRef = (ref: d.RuntimeRef) =>
  hostRefs.get(ref);

export const registerInstance = (lazyInstance: any, elmData: d.HostRef) =>
  hostRefs.set(elmData.lazyInstance = lazyInstance, elmData);

export const registerHost = (elm: d.HostElement) =>
  hostRefs.set(elm, {
    hostElement: elm,
    instanceValues: new Map(),
  });
