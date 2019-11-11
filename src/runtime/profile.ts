import { BUILD } from '@build-conditionals';
import { getHostRef, win } from '@platform';
import * as d from '../declarations';
import { HOST_FLAGS } from '@utils';

let i = 0;

export const STENCIL_DEV_MODE = ['%c[STENCIL-DEV-MODE]', 'color:#4c47ff;font-weight: bold'];
export const createTime = (fnName: string, tagName = '') => {
  if (BUILD.profile) {
    const key = `st:${fnName}:${tagName}:${i++}`;
    // Start
    performance.mark(key);

    // End
    return () => performance.measure(`[Stencil] ${fnName}() <${tagName}>`, key);
  } else {
    return () => { return; };
  }
};

export const uniqueTime = (key: string, measureText: string) => {
  if (BUILD.profile) {
    if (performance.getEntriesByName(key).length === 0) {
      performance.mark(key);
    }
    return () => {
      if (performance.getEntriesByName(measureText).length === 0) {
        performance.measure(measureText, key);
      }
    };
  } else {
    return () => { return; };
  }
};

const inspect = (ref: any) => {
  const hostRef = getHostRef(ref);
  if (!hostRef) {
    return undefined;
  }
  const flags = hostRef.$flags$;
  const hostElement = hostRef.$hostElement$ as d.HostElement;
  return {
    renderCount: hostRef.$renderCount$,
    flags: {
      hasRendered: !!(flags & HOST_FLAGS.hasRendered),
      hasConnected: !!(flags & HOST_FLAGS.hasConnected),
      isWaitingForChildren: !!(flags & HOST_FLAGS.isWaitingForChildren),
      isConstructingInstance: !!(flags & HOST_FLAGS.isConstructingInstance),
      isQueuedForUpdate: !!(flags & HOST_FLAGS.isQueuedForUpdate),
      hasInitializedComponent: !!(flags & HOST_FLAGS.hasInitializedComponent),
      hasLoadedComponent: !!(flags & HOST_FLAGS.hasLoadedComponent),
      isWatchReady: !!(flags & HOST_FLAGS.isWatchReady),
      isListenReady: !!(flags & HOST_FLAGS.isListenReady),
      needsRerender: !!(flags & HOST_FLAGS.needsRerender),
    },
    instanceValues: hostRef.$instanceValues$,
    ancestorComponent: hostRef.$ancestorComponent$,
    hostElement,
    lazyInstance: hostRef.$lazyInstance$,
    vnode: hostRef.$vnode$,
    modeName: hostRef.$modeName$,
    onReadyPromise: hostRef.$onReadyPromise$,
    onReadyResolve: hostRef.$onReadyResolve$,
    onInstancePromise: hostRef.$onInstancePromise$,
    onInstanceResolve: hostRef.$onInstanceResolve$,
    onRenderResolve: hostRef.$onRenderResolve$,
    queuedListeners: hostRef.$queuedListeners$,
    rmListeners: hostRef.$rmListeners$,
    ['s-id']: hostElement['s-id'],
    ['s-cr']: hostElement['s-cr'],
    ['s-lr']: hostElement['s-lr'],
    ['s-p']: hostElement['s-p'],
    ['s-rc']: hostElement['s-rc'],
    ['s-sc']: hostElement['s-sc'],
  };
};

export const installDevTools = () => {
  if (BUILD.devTools) {
    const stencil = (win as any).stencil = (win as any).stencil || {};
    const originalInspect = stencil.inspect;

    stencil.inspect = (ref: any) => {
      let result = inspect(ref);
      if (!result && typeof originalInspect === 'function') {
        result = originalInspect(ref);
      }
      return result;
    };
  }
};
