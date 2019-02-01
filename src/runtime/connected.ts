import * as d from '@declarations';
import { activelyProcessingCmps, getHostRef, tick } from '@platform';
import { BUILD } from '@build-conditionals';
import { getHostListenerTarget, hostListenerOpts, hostListenerProxy } from './host-listener';
import { initialLoad } from './initial-load';
import { LISTENER_FLAGS } from '@utils';


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
      cmpMeta.cmpHostListeners.forEach(([flags, name, method]) => {
        if ((flags & LISTENER_FLAGS.Disabled) === 0) {
          if (BUILD.lazyLoad) {
            (hostRef.queuedReceivedHostEvents || (hostRef.queuedReceivedHostEvents = []));
          }
          (BUILD.hostListenerTarget ? getHostListenerTarget(elm, flags) : elm).addEventListener(name, hostListenerProxy(hostRef, method), hostListenerOpts(flags));
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
