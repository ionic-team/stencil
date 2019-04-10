import * as d from '../declarations';
import { BUILD } from '@build-conditionals';


const hostRefs: WeakMap<d.RuntimeRef, d.HostRef> = /*@__PURE__*/new WeakMap();

export const getHostRef = (ref: d.RuntimeRef) =>
  hostRefs.get(ref);

export const registerInstance = (lazyInstance: any, hostRef: d.HostRef) =>
  hostRefs.set(hostRef.$lazyInstance$ = lazyInstance, hostRef);

export const registerHost = (elm: d.HostElement) => {
  // TODO: it's so ugly, but minifies really well
  if (BUILD.lazyLoad) {

    const hostRef: d.HostRef = {
      $stateFlags$: 0,
      $hostElement$: elm
    };
    hostRef.$onReadyPromise$ = new Promise(r => hostRef.$onReadyResolve$ = r);
    if (BUILD.prop || BUILD.state) {
      hostRef.$instanceValues$ = new Map();
    }
    return hostRefs.set(elm, hostRef);

  } else {
    const hostRef: d.HostRef = {
      $stateFlags$: 0,
    };
    if (BUILD.prop || BUILD.state) {
      hostRef.$instanceValues$ = new Map();
    }
    return hostRefs.set(elm, hostRef);
  }
};

export const isMemberInElement = (elm: any, memberName: string) => memberName in elm;
