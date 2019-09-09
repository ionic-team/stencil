import * as d from '../declarations';
import { BUILD } from '@build-conditionals';


const hostRefs: WeakMap<d.RuntimeRef, d.HostRef> = /*@__PURE__*/new WeakMap();

export const getHostRef = (ref: d.RuntimeRef) =>
  hostRefs.get(ref);

export const registerInstance = (lazyInstance: any, hostRef: d.HostRef) =>
  hostRefs.set(hostRef.$lazyInstance$ = lazyInstance, hostRef);

export const registerHost = (elm: d.HostElement) => {
  if (BUILD.lazyLoad) {
    const hostRef: d.HostRef = {
      $flags$: 0,
      $hostElement$: elm,
      $instanceValues$: new Map()
    };
    hostRef.$onReadyPromise$ = new Promise(r => hostRef.$onReadyResolve$ = r);
    return hostRefs.set(elm, hostRef);
  } else {

    return hostRefs.set(elm, {
      $flags$: 0,
      $instanceValues$: new Map()
    });
  }
};
