import * as d from '@declarations';
import { activelyProcessingCmps, getHostRef, plt, tick } from '@platform';
import { BUILD } from '@build-conditionals';
import { initialLoad } from './initial-load';


export const connectedCallback = (elm: d.HostElement, cmpMeta?: d.ComponentRuntimeMeta, hostRef?: d.HostRef, ancestorHostElement?: d.HostElement) => {
  // connectedCallback

  if (!BUILD.lazyLoad) {
    cmpMeta = (elm.constructor as d.ComponentConstructor).cmpMeta;
  }

  if (BUILD.updatable || BUILD.member || BUILD.lifecycle || BUILD.hostListener) {
    hostRef = getHostRef(elm);

    if (BUILD.hostListener && cmpMeta.cmpHostListeners) {
      // initialize our event listeners on the host element
      // we do this now so that we can listening to events that may
      // have fired even before the instance is ready
      cmpMeta.cmpHostListeners.forEach(hostListener => {
        if (!hostListener[2]) {
          (hostRef.hostListenerEventToMethodMap || (hostRef.hostListenerEventToMethodMap = new Map()))
            .set(hostListener[0], hostListener[1]);

          elm.addEventListener(hostListener[0], hostListenerProxy, listenerOpts(hostListener));
        }
      });
    }

    if (!hostRef.hasConnected) {
      // first time this element has connected
      hostRef.hasConnected = true;

      if (BUILD.exposeAppOnReady) {
        activelyProcessingCmps.add(elm);
      }

      if (BUILD.lifecycle) {
        // register this component as an actively
        // loading child to its parent component
        // find the first ancestor host element (if there is one) and register
        // this element as one of the actively loading child elements for its ancestor
        ancestorHostElement = elm;

        while ((ancestorHostElement = ancestorHostElement.parentNode as any)) {
          // climb up the ancestors looking for the first registered component
          if (ancestorHostElement['s-init']) {
            // we found this elements the first ancestor host element
            // if the ancestor already loaded then do nothing, it's too late
            if (!ancestorHostElement['s-rn']) {

              // keep a reference to this element's ancestor host element
              hostRef.ancestorHostElement = ancestorHostElement;

              // ensure there is an array to contain a reference to each of the child elements
              // and set this element as one of the ancestor's child elements it should wait on
              (ancestorHostElement['s-al'] = ancestorHostElement['s-al'] || new Set()).add(elm);
            }
            break;
          }
        }
      }

      if (BUILD.taskQueue) {
        // connectedCallback, taskQueue, initialLoad
        tick.then(() => initialLoad(elm, hostRef, cmpMeta));

      } else {
        initialLoad(elm, hostRef, cmpMeta);
      }
    }

  } else {
    // connectedCallback, initialLoad
    initialLoad(elm, getHostRef(elm), cmpMeta);
  }
};


function hostListenerProxy(this: d.HostElement, ev: Event) {
  const hostRef = getHostRef(this);
  const hostListenerMethodName = hostRef.hostListenerEventToMethodMap.get(ev.type);

  if (BUILD.lazyLoad) {
    if (hostRef.lazyInstance) {
      // instance is ready, let's call it's member method for this event
      return hostRef.lazyInstance[hostListenerMethodName](ev);
    }

  } else {
    return (this as any)[hostListenerMethodName](ev);
  }

  (hostRef.queuedReceivedHostEvents || (hostRef.queuedReceivedHostEvents = []))
    .push(hostListenerMethodName, ev);
}


const listenerOpts = (hostListener: d.ComponentRuntimeHostListener) =>
  plt.supportsListenerOptions ?
    {
      'passive': !!hostListener[3],
      'capture': !!hostListener[4],
    }
  : !!hostListener[4];
