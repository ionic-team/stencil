import * as d from '../declarations';
import { BUILD } from '@app-data';
import { doc, plt, supportsListenerOptions, win } from '@platform';
import { HOST_FLAGS, LISTENER_FLAGS } from '@utils';


export const addHostEventListeners = (elm: d.HostElement, hostRef: d.HostRef, listeners: d.ComponentRuntimeHostListener[]) => {
  if (BUILD.hostListener && listeners) {
    // initialize our event listeners on the host element
    // we do this now so that we can listen to events that may
    // have fired even before the instance is ready
    const removeFns = listeners.map(([flags, name, method]) => {
      const target = (BUILD.hostListenerTarget ? getHostListenerTarget(elm, flags) : elm);
      const handler = hostListenerProxy(hostRef, method);
      const opts = hostListenerOpts(flags);
      plt.ael(target, name, handler, opts);
      return () => plt.rel(target, name, handler, opts);
    });
    hostRef.$rmListeners$ = () => removeFns.forEach(fn => fn());
  }
};

const hostListenerProxy = (hostRef: d.HostRef, methodName: string) =>
  (ev: Event) => {
    if (BUILD.lazyLoad) {
      if (hostRef.$flags$ & HOST_FLAGS.isListenReady) {
        // instance is ready, let's call it's member method for this event
        hostRef.$lazyInstance$[methodName](ev);
      } else {
        (hostRef.$queuedListeners$ = (hostRef.$queuedListeners$ || [])).push([methodName, ev]);
      }
    } else {
      (hostRef.$hostElement$ as any)[methodName](ev);
    }
  };

const getHostListenerTarget = (elm: Element, flags: number): EventTarget => {
  if (BUILD.hostListenerTargetDocument && flags & LISTENER_FLAGS.TargetDocument) return doc;
  if (BUILD.hostListenerTargetWindow && flags & LISTENER_FLAGS.TargetWindow) return win;
  if (BUILD.hostListenerTargetBody && flags & LISTENER_FLAGS.TargetBody) return doc.body;
  if (BUILD.hostListenerTargetParent && flags & LISTENER_FLAGS.TargetParent) return elm.parentElement;
  return elm;
};

const hostListenerOpts = (flags: number) =>
  supportsListenerOptions ?
    ({
      'passive': (flags & LISTENER_FLAGS.Passive) !== 0,
      'capture': (flags & LISTENER_FLAGS.Capture) !== 0,
    })
  : (flags & LISTENER_FLAGS.Capture) !== 0;
