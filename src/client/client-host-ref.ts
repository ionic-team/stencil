import * as d from '../declarations';
import { addHostEventListeners } from '@runtime';
import { BUILD } from '@app-data';

const hostRefs: WeakMap<d.RuntimeRef, d.HostRef> = /*@__PURE__*/ new WeakMap();

export const getHostRef = (ref: d.RuntimeRef) => hostRefs.get(ref);

export const registerInstance = (lazyInstance: any, hostRef: d.HostRef) => hostRefs.set((hostRef.$lazyInstance$ = lazyInstance), hostRef);

export const registerHost = (elm: d.HostElement, cmpMeta: d.ComponentRuntimeMeta) => {
  const hostRef: d.HostRef = {
    $flags$: 0,
    $hostElement$: elm,
    $cmpMeta$: cmpMeta,
    $instanceValues$: new Map(),
  };
  if (BUILD.isDev) {
    hostRef.$renderCount$ = 0;
  }
  if (BUILD.method && BUILD.lazyLoad) {
    hostRef.$onInstancePromise$ = new Promise(r => (hostRef.$onInstanceResolve$ = r));
  }
  if (BUILD.asyncLoading) {
    hostRef.$onReadyPromise$ = new Promise(r => (hostRef.$onReadyResolve$ = r));
    elm['s-p'] = [];
    elm['s-rc'] = [];
  }
  addHostEventListeners(elm, hostRef, cmpMeta.$listeners$, false);
  return hostRefs.set(elm, hostRef);
};

export const isMemberInElement = (elm: any, memberName: string) => memberName in elm;
