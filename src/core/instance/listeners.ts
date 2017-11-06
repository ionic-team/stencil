import { ComponentInstance, HostElement, PlatformApi } from '../../util/interfaces';
import { noop } from '../../util/helpers';
import { KEY_CODE_MAP } from '../../util/constants';


export function initElementListeners(plt: PlatformApi, elm: HostElement) {
  // so the element was just connected, which means it's in the DOM
  // however, the component instance hasn't been created yet
  // but what if an event it should be listening to get emitted right now??
  // let's add our listeners right now to our element, and if it happens
  // to receive events between now and the instance being created let's
  // queue up all of the event data and fire it off on the instance when it's ready
  const cmpMeta = plt.getComponentMeta(elm);

  if (cmpMeta.listenersMeta) {
    cmpMeta.listenersMeta.forEach(listener => {
      if (!listener.eventDisabled) {
        (elm._listeners = elm._listeners || {})[listener.eventName] = addListener(
          plt,
          elm,
          listener.eventName,
          createListenerCallback(elm, listener.eventMethodName),
          listener.eventCapture,
          listener.eventPassive
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


export function enableEventListener(plt: PlatformApi, instance: ComponentInstance, eventName: string, shouldEnable: boolean, attachTo?: string|Element) {
  if (instance) {
    const elm = instance.__el;
    const cmpMeta = plt.getComponentMeta(elm);
    const listenerMeta = cmpMeta.listenersMeta;

    if (listenerMeta) {
      const deregisterFns = elm._listeners = elm._listeners || {};

      for (var i = 0; i < listenerMeta.length; i++) {
        var listener = listenerMeta[i];

        if (listener.eventName === eventName) {
          var fn = deregisterFns[eventName];

          if (shouldEnable && !fn) {
            var attachToEventName = eventName;
            var element = elm;

            if (typeof attachTo === 'string') {
              attachToEventName = `${attachTo}:${eventName}`;

            } else if (typeof attachTo === 'object') {
              element = attachTo as HostElement;
            }

            deregisterFns[eventName] = addListener(
              plt,
              element,
              attachToEventName,
              createListenerCallback(elm, listener.eventMethodName),
              listener.eventCapture,
              listener.eventPassive
            );

          } else if (!shouldEnable && fn) {
            deregisterFns[eventName]();
            deregisterFns[eventName] = null;
          }

          return true;
        }
      }
    }
  }
  return false;
}


export function addListener(
  plt: PlatformApi,
  elm: Element|HTMLDocument|Window,
  eventName: string,
  listenerCallback: {(ev?: any): any},
  useCapture?: boolean,
  usePassive?: boolean,
  splt?: string[],
  eventListener?: Function
) {
  // depending on the event name, we could actually be attaching
  // this element to something like the document or window
  splt = eventName.split(':');

  if (elm && splt.length > 1) {
    // document:mousemove
    // parent:touchend
    // body:keyup.enter
    elm = plt.domApi.$elementRef(elm, splt[0]);
    eventName = splt[1];
  }

  if (!elm) {
    // something's up, let's not continue and just return a noop()
    return noop;
  }

  eventListener = listenerCallback;

  // test to see if we're looking for an exact keycode
  splt = eventName.split('.');

  if (splt.length > 1) {
    // looks like this listener is also looking for a keycode
    // keyup.enter
    eventName = splt[0];

    eventListener = (ev: any) => {
      // wrap the user's event listener with our own check to test
      // if this keyboard event has the keycode they're looking for
      if (ev.keyCode === KEY_CODE_MAP[splt[1]]) {
        listenerCallback(ev);
      }
    };
  }

  // good to go now, add the event listener
  // and the returned value is a function to remove the same event listener
  return plt.domApi.$addEventListener(elm, eventName, eventListener, useCapture, usePassive);
}


export function detachListeners(elm: HostElement) {
  if (elm._listeners) {
    Object.keys(elm._listeners).forEach(eventName => elm._listeners[eventName]());
    elm._listeners = null;
  }
}
