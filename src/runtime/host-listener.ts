import * as d from '@declarations';
import { BUILD } from '@build-conditionals';
import { getDoc, getWin, supportsListenerOptions } from '@platform';
import { LISTENER_FLAGS } from '@utils';

export const addEventListeners = (elm: d.HostElement, hostRef: d.HostRef, listeners: d.ComponentRuntimeHostListener[]) => {
  const removeFns = listeners.map(([flags, name, method]) => {
    const target = (BUILD.hostListenerTarget ? getHostListenerTarget(elm, flags) : elm);
    const handler = hostListenerProxy(hostRef, method);
    const opts = hostListenerOpts(flags);
    target.addEventListener(name, handler, opts);
    return () => target.removeEventListener(name, handler, opts);
  });
  return () => removeFns.forEach(fn => fn());
};

const hostListenerProxy = (hostRef: d.HostRef, methodName: string) => {
  return (ev: Event) => {
    if (BUILD.lazyLoad || BUILD.hydrateServerSide) {
      if (hostRef.$lazyInstance$) {
        // instance is ready, let's call it's member method for this event
        return hostRef.$lazyInstance$[methodName](ev);
      } else {
        return hostRef.$onReadyPromise$.then(() => hostRef.$lazyInstance$[methodName](ev));
      }
    } else {
      return (hostRef.$hostElement$ as any)[methodName](ev);
    }
  };
};


const getHostListenerTarget = (elm: Element, flags: number): EventTarget => {
  if (BUILD.hostListenerTargetDocument && flags & LISTENER_FLAGS.TargetDocument) return getDoc(elm);
  if (BUILD.hostListenerTargetWindow && flags & LISTENER_FLAGS.TargetWindow) return getWin(elm);
  if (BUILD.hostListenerTargetBody && flags & LISTENER_FLAGS.TargetBody) return getDoc(elm).body;
  if (BUILD.hostListenerTargetParent && flags & LISTENER_FLAGS.TargetParent) return elm.parentElement;
  return elm;
};


const hostListenerOpts = (flags: number) =>
  supportsListenerOptions ?
    {
      'passive': (flags & LISTENER_FLAGS.Passive) !== 0,
      'capture': (flags & LISTENER_FLAGS.Capture) !== 0,
    }
  : (flags & LISTENER_FLAGS.Capture) !== 0;
