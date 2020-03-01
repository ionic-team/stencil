import * as d from '@stencil/core/internal';
import { addHostEventListeners } from '@runtime';
import { hostRefs } from './testing-constants';


export const getHostRef = (elm: d.RuntimeRef) => {
  return hostRefs.get(elm);
};

export const registerInstance = (lazyInstance: any, hostRef: d.HostRef) => {
  if (lazyInstance == null || lazyInstance.constructor == null) {
    throw new Error(`Invalid component constructor`);
  }

  if (hostRef == null) {
    console.warn('Use newSpecPage() to instanciate component instances.');
    const Cstr = lazyInstance.constructor as d.ComponentTestingConstructor;
    const tagName = (Cstr.COMPILER_META && Cstr.COMPILER_META.tagName) ? Cstr.COMPILER_META.tagName : 'div';
    const elm = document.createElement(tagName);
    registerHost(elm, { $flags$: 0, $tagName$: tagName });
    hostRef = getHostRef(elm);
  }

  hostRef.$lazyInstance$ = lazyInstance;
  return hostRefs.set(lazyInstance, hostRef);
};

export const registerHost = (elm: d.HostElement, cmpMeta: d.ComponentRuntimeMeta) => {
  const hostRef: d.HostRef = {
    $flags$: 0,
    $hostElement$: elm,
    $cmpMeta$: cmpMeta,
    $instanceValues$: new Map(),
    $renderCount$: 0
  };
  hostRef.$onInstancePromise$ = new Promise(r => hostRef.$onInstanceResolve$ = r);
  hostRef.$onReadyPromise$ = new Promise(r => hostRef.$onReadyResolve$ = r);
  elm['s-p'] = [];
  elm['s-rc'] = [];
  addHostEventListeners(elm, hostRef, cmpMeta.$listeners$, false);
  hostRefs.set(elm, hostRef);
};
