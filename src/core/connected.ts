import * as d from '../declarations';
import { initHostSnapshot } from './host-snapshot';
import { initElementListeners } from './listeners';


export function connectedCallback(plt: d.PlatformApi, cmpMeta: d.ComponentMeta, elm: d.HostElement, perf: Performance) {
  if (_BUILD_.listener) {
    // initialize our event listeners on the host element
    // we do this now so that we can listening to events that may
    // have fired even before the instance is ready
    if (!plt.hasListenersMap.has(elm)) {
      // it's possible we've already connected
      // then disconnected
      // and the same element is reconnected again
      plt.hasListenersMap.set(elm, true);
      initElementListeners(plt, elm);
    }
  }

  // this element just connected, which may be re-connecting
  // ensure we remove it from our map of disconnected
  plt.isDisconnectedMap.delete(elm);

  if (!plt.hasConnectedMap.has(elm)) {
    if (!elm['s-id']) {
      // assign a unique id to this host element
      // it's possible this was already given an element id
      elm['s-id'] = plt.nextId();
    }

    if (_BUILD_.profile) {
      perf.mark(`connected_start:${elm.nodeName.toLowerCase()}:${elm['s-id']}`);
    }

    plt.hasConnectedComponent = true;
    plt.processingCmp.add(elm);

    // first time we've connected
    plt.hasConnectedMap.set(elm, true);

    // register this component as an actively
    // loading child to its parent component
    registerWithParentComponent(plt, elm);

    // add to the queue to load the bundle
    // it's important to have an async tick in here so we can
    // ensure the "mode" attribute has been added to the element
    // place in high priority since it's not much work and we need
    // to know as fast as possible, but still an async tick in between
    plt.queue.tick(() => {
      // start loading this component mode's bundle
      // if it's already loaded then the callback will be synchronous
      plt.hostSnapshotMap.set(elm, initHostSnapshot(plt.domApi, cmpMeta, elm));

      if (_BUILD_.profile) {
        perf.mark(`connected_end:${elm.nodeName.toLowerCase()}:${elm['s-id']}`);
        perf.measure(`connected:${elm.nodeName.toLowerCase()}:${elm['s-id']}`, `connected_start:${elm.nodeName.toLowerCase()}:${elm['s-id']}`, `connected_end:${elm.nodeName.toLowerCase()}:${elm['s-id']}`);
      }

      plt.requestBundle(cmpMeta, elm);
    });
  }
}


export function registerWithParentComponent(plt: d.PlatformApi, elm: d.HostElement, ancestorHostElement?: d.HostElement) {
  // find the first ancestor host element (if there is one) and register
  // this element as one of the actively loading child elements for its ancestor
  ancestorHostElement = elm;

  while (ancestorHostElement = plt.domApi.$parentElement(ancestorHostElement)) {
    // climb up the ancestors looking for the first registered component
    if (plt.isDefinedComponent(ancestorHostElement)) {
      // we found this elements the first ancestor host element
      // if the ancestor already loaded then do nothing, it's too late
      if (!plt.isCmpReady.has(elm)) {

        // keep a reference to this element's ancestor host element
        // elm._ancestorHostElement = ancestorHostElement;
        plt.ancestorHostElementMap.set(elm, ancestorHostElement);

        // ensure there is an array to contain a reference to each of the child elements
        // and set this element as one of the ancestor's child elements it should wait on
        (ancestorHostElement['s-ld'] = ancestorHostElement['s-ld'] || []).push(elm);
      }
      break;
    }
  }
}
