import * as d from '../declarations';


export function initElementListeners(plt: d.PlatformApi, elm: d.HostElement) {
  // so the element was just connected, which means it's in the DOM
  // however, the component instance hasn't been created yet
  // but what if an event it should be listening to get emitted right now??
  // let's add our listeners right now to our element, and if it happens
  // to receive events between now and the instance being created let's
  // queue up all of the event data and fire it off on the instance when it's ready
  const cmpMeta = plt.getComponentMeta(elm);
  const meta = plt.metaHostMap.get(elm);

  if (cmpMeta.listenersMeta) {
    // we've got listens
    cmpMeta.listenersMeta.forEach(listenMeta => {
      // go through each listener
      if (!listenMeta.eventDisabled) {
        // only add ones that are not already disabled
        plt.domApi.$addEventListener(
          elm,
          listenMeta.eventName,
          createListenerCallback(meta, listenMeta.eventMethodName),
          listenMeta.eventCapture,
          listenMeta.eventPassive
        );
      }
    });
  }
}


export function createListenerCallback(meta: d.InternalMeta, eventMethodName: string) {
  // create the function that gets called when the element receives
  // an event which it should be listening for
  const instance = meta.instance;
  return (ev?: any) => {
    // get the instance if it exists
    if (instance) {
      // instance is ready, let's call it's member method for this event
      instance[eventMethodName](ev);

    } else {
      // instance is not ready!!
      // let's queue up this event data and replay it later
      // when the instance is ready
      meta.queuedEvents.push(ev);
    }
  };
}


export function enableEventListener(plt: d.PlatformApi, instance: d.ComponentInstance, eventName: string, shouldEnable: boolean, attachTo?: string|Element, passive?: boolean) {
  if (instance) {
    // cool, we've got an instance, it's get the element it's on
    const { element, cmpMeta} = plt.metaInstanceMap.get(this);

    if (cmpMeta && cmpMeta.listenersMeta) {
      // alrighty, so this cmp has listener meta

      if (shouldEnable) {
        // we want to enable this event
        // find which listen meta we're talking about
        const listenMeta = cmpMeta.listenersMeta.find(l => l.eventName === eventName);
        if (listenMeta) {
          // found the listen meta, so let's add the listener
          plt.domApi.$addEventListener(
            element,
            eventName,
            (ev: any) => instance[listenMeta.eventMethodName](ev),
            listenMeta.eventCapture,
            (passive === undefined) ? listenMeta.eventPassive : !!passive,
            attachTo
          );
        }

      } else {
        // we're disabling the event listener
        // so let's just remove it entirely
        plt.domApi.$removeEventListener(element, eventName);
      }
    }
  }
}
