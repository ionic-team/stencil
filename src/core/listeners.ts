import { ComponentInstance, HostElement, PlatformApi } from '../declarations';


export function initElementListeners(plt: PlatformApi, elm: HostElement) {
  // so the element was just connected, which means it's in the DOM
  // however, the component instance hasn't been created yet
  // but what if an event it should be listening to get emitted right now??
  // let's add our listeners right now to our element, and if it happens
  // to receive events between now and the instance being created let's
  // queue up all of the event data and fire it off on the instance when it's ready
  const cmpMeta = plt.getComponentMeta(elm);

  if (cmpMeta.listenersMeta) {
    // we've got listens
    cmpMeta.listenersMeta.forEach(listenMeta => {
      // go through each listener
      if (!listenMeta.eventDisabled) {
        // only add ones that are not already disabled
        plt.domApi.$addEventListener(
          elm,
          listenMeta.eventName,
          createListenerCallback(plt, elm, listenMeta.eventMethodName),
          1,
          listenMeta.eventCapture,
          listenMeta.eventPassive
        );
      }
    });
  }
}


export function createListenerCallback(plt: PlatformApi, elm: HostElement, eventMethodName: string, val?: any) {
  // create the function that gets called when the element receives
  // an event which it should be listening for
  return (ev?: any) => {
    // get the instance if it exists
    val = plt.instanceMap.get(elm);
    if (val) {
      // instance is ready, let's call it's member method for this event
      val[eventMethodName](ev);

    } else {
      // instance is not ready!!
      // let's queue up this event data and replay it later
      // when the instance is ready
      val = (plt.queuedEvents.get(elm) || []);
      val.push(eventMethodName, ev);
      plt.queuedEvents.set(elm, val);
    }
  };
}


export function enableEventListener(plt: PlatformApi, instance: ComponentInstance, eventName: string, shouldEnable: boolean, attachTo?: string|Element, passive?: boolean) {
  if (instance) {
    // cool, we've got an instance, it's get the element it's on
    const elm = plt.hostElementMap.get(instance);
    const cmpMeta = plt.getComponentMeta(elm);

    if (cmpMeta && cmpMeta.listenersMeta) {
      // alrighty, so this cmp has listener meta

      if (shouldEnable) {
        // we want to enable this event
        // find which listen meta we're talking about
        const listenMeta = cmpMeta.listenersMeta.find(l => l.eventName === eventName);
        if (listenMeta) {
          // found the listen meta, so let's add the listener
          plt.domApi.$addEventListener(
            elm,
            eventName,
            (ev: any) => instance[listenMeta.eventMethodName](ev),
            1,
            listenMeta.eventCapture,
            (passive === undefined) ? listenMeta.eventPassive : !!passive,
            attachTo
          );
        }

      } else {
        // we're disabling the event listener
        // so let's just remove it entirely
        plt.domApi.$removeEventListener(elm, eventName, 1);
      }
    }
  }
}
