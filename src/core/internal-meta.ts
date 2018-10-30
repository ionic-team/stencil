import * as d from '../declarations';

export function getInternalMeta(plt: d.PlatformApi, element: d.HostElement): d.InternalMeta {
  return plt.metaHostMap.get(element) || newInternalMeta(element, undefined);
}

export function newInternalMeta(element: d.HostElement, cmpMeta: d.ComponentMeta): d.InternalMeta  {
  return {
    hasConnected: false,
    hasListeners: false,
    isCmpLoaded: false,
    isCmpReady: false,
    isDisconnected: false,
    isQueuedForUpdate: false,
    ancestorHostElement: undefined,
    hostSnapshot: undefined,
    instance: undefined,
    vnode: undefined,
    values: new Map(),
    onReadyCallbacks: [],
    queuedEvents: [],
    element,
    cmpMeta,
  };
}
