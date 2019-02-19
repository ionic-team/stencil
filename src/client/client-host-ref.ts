import * as d from '@declarations';
import { BUILD } from '@build-conditionals';


const hostRefs: WeakMap<d.RuntimeRef, d.HostRef> = new WeakMap();

export const getHostRef = (ref: d.RuntimeRef) =>
  hostRefs.get(ref);

export const registerInstance = (lazyInstance: any, elmData: d.HostRef) =>
  hostRefs.set(elmData.lazyInstance = lazyInstance, elmData);

export const registerHost = (elm: d.HostElement) => {
  const hostRef: d.HostRef = {
    stateFlags: 0,
  };
  if (BUILD.lazyLoad) {
    hostRef.hostElement = elm;
  }
  if (BUILD.prop || BUILD.state) {
    hostRef.instanceValues = new Map();
  }
  return hostRefs.set(elm, hostRef);
};
