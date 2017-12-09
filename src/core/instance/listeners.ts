import { ComponentInstance, HostElement, PlatformApi } from '../../util/interfaces';


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
          createListenerCallback(elm, listenMeta.eventMethodName),
          listenMeta.eventCapture,
          listenMeta.eventPassive
        );
      }
    });
  }
}


export function createListenerCallback(elm: HostElement, eventMethodName: string) {
  // create the function that gets called when the element receives
  // an event which it should be listening for
  return (ev?: any) => {
    if (elm._instance) {
      // instance is ready, let's call it's member method for this event
      elm._instance[eventMethodName](ev);

    } else {
      // instance is not ready!!
      // let's queue up this event data and replay it later
      // when the instance is ready
      (elm._queuedEvents = elm._queuedEvents || []).push(eventMethodName, ev);
    }
  };
}


export function enableEventListener(plt: PlatformApi, instance: ComponentInstance, eventName: string, shouldEnable: boolean, attachTo?: string|Element) {
  if (instance) {
    // cool, we've got an instance, it's get the element it's on
    const elm = instance.__el;
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
            listenMeta.eventCapture,
            listenMeta.eventPassive,
            attachTo
          );
        }

      } else {
        // we're disabling the event listener
        // so let's just remove it entirely
        plt.domApi.$removeEventListener(elm, eventName);
      }
    }
  }
}


export function replayQueuedEventsOnInstance(elm: HostElement, i?: number) {
  // the element has an instance now and
  // we already added the event listeners to the element
  const queuedEvents = elm._queuedEvents;

  if (queuedEvents) {
    // events may have already fired before the instance was even ready
    // now that the instance is ready, let's replay all of the events that
    // we queued up earlier that were originally meant for the instance
    for (i = 0; i < queuedEvents.length; i += 2) {
      // data was added in sets of two
      // first item the eventMethodName
      // second item is the event data
      // take a look at initElementListener()
      elm._instance[queuedEvents[i]](queuedEvents[i + 1]);
    }

    // no longer need this data, be gone with you
    elm._queuedEvents = null;
  }
}
