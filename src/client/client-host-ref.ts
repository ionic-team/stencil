import * as d from '../declarations';
import { BUILD } from '@build-conditionals';


const hostRefs: WeakMap<d.RuntimeRef, d.HostRef> = /*@__PURE__*/new WeakMap();

export const getHostRef = (ref: d.RuntimeRef) =>
  hostRefs.get(ref);

export const registerInstance = (lazyInstance: any, hostRef: d.HostRef) =>
  hostRefs.set(hostRef.$lazyInstance$ = lazyInstance, hostRef);

export const registerHost = (elm: d.HostElement) => {
  const hostRef: d.HostRef = {
    $flags$: 0,
    $hostElement$: elm,
    $instanceValues$: new Map()
  };
  if (BUILD.isDev) {
    hostRef.$renderCount$ = 0;
  }
  if (BUILD.method && BUILD.lazyLoad) {
    hostRef.$onInstancePromise$ = new Promise(r => hostRef.$onInstanceResolve$ = r);
  }
  if (BUILD.asyncLoading) {
    hostRef.$onReadyPromise$ = new Promise(r => hostRef.$onReadyResolve$ = r);
    elm['s-p'] = [];
    elm['s-rc'] = [];
  }
  return hostRefs.set(elm, hostRef);
};
export const isMemberInElement = (elm: any, memberName: string) => memberName in elm;
