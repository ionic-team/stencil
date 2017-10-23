import { ComponentInstance, HostElement, PlatformApi } from '../../util/interfaces';
import { getElementReference, noop } from '../../util/helpers';
import { KEY_CODE_MAP } from '../../util/constants';


export function initElementListeners(plt: PlatformApi, elm: HostElement) {
  // so the element was just connected, which means it's in the DOM
  // however, the component instance hasn't been created yet
  // but what if an event it should be listening to get emitted right now??
  // let's add our listeners right now to our element, and if it happens
  // to receive events between now and the instance being created let's
  // queue up all of the event data and fire it off on the instance when it's ready
  const cmpMeta = plt.getComponentMeta(elm);
  const listeners = cmpMeta.listenersMeta;

  if (listeners) {
    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i];
      if (listener.eventDisabled) continue;

      (elm._listeners = elm._listeners || {})[listener.eventName] = addEventListener(
        plt,
        elm,
        listener.eventName,
        createListenerCallback(elm, listener.eventMethodName),
        listener.eventCapture,
        listener.eventPassive
      );
    }
  }
}


export function createListenerCallback(elm: HostElement, eventMethodName: string) {
  // create the function that gets called when the element receives
  // an event which it should be listening for
  return function onEvent(ev?: any) {
    if (elm.$instance) {
      // instance is ready, let's call it's member method for this event
      elm.$instance[eventMethodName](ev);

    } else {
      // instance is not ready!!
      // let's queue up this event data and replay it later
      // when the instance is ready
      (elm._queuedEvents = elm._queuedEvents || []).push(eventMethodName, ev);
    }
  };
}


export function replayQueuedEventsOnInstance(elm: HostElement) {
  // the element has an instance now and
  // we already added the event listeners to the element
  const queuedEvents = elm._queuedEvents;

  if (queuedEvents) {
    // events may have already fired before the instance was even ready
    // now that the instance is ready, let's replay all of the events that
    // we queued up earlier that were originally meant for the instance
    for (var i = 0; i < queuedEvents.length; i += 2) {
      // data was added in sets of two
      // first item the eventMethodName
      // second item is the event data
      // take a look at initElementListener()
      elm.$instance[queuedEvents[i]](queuedEvents[i + 1]);
    }

    // no longer need this data, be gone with you
    delete elm._queuedEvents;
  }
}


export function enableEventListener(plt: PlatformApi, instance: ComponentInstance, eventName: string, shouldEnable: boolean, attachTo?: string) {
  if (instance) {
    const elm = instance.__el;
    const cmpMeta = plt.getComponentMeta(elm);
    const listenerMeta = cmpMeta.listenersMeta;

    if (listenerMeta) {
      const deregisterFns = elm._listeners = elm._listeners || {};

      for (var i = 0; i < listenerMeta.length; i++) {
        var listener = listenerMeta[i];

        if (listener.eventName === eventName) {

          if (shouldEnable && !deregisterFns[eventName]) {
            var attachToEventName = attachTo ? `${attachTo}:${eventName}` : eventName;
            deregisterFns[eventName] = addEventListener(
              plt,
              elm,
              attachToEventName,
              createListenerCallback(elm, listener.eventMethodName),
              listener.eventCapture,
              listener.eventPassive
            );

          } else if (!shouldEnable && deregisterFns[eventName]) {
            deregisterFns[eventName]();
            delete elm._listeners[eventName];
          }

          return;
        }
      }
    }
  }
}


export function addEventListener(
  plt: PlatformApi,
  elm: Element|HTMLDocument|Window,
  eventName: string,
  listenerCallback: {(ev?: any): any},
  useCapture?: boolean,
  usePassive?: boolean
) {
  // depending on the event name, we could actually be
  // attaching this element to something like the document or window
  let splt = eventName.split(':');
  let testKeyCode = 0;

  // get our event listener options
  // mainly this is used to set passive events if this browser supports it
  const eventListenerOpts = plt.getEventOptions(useCapture, usePassive);

  if (elm && splt.length > 1) {
    // document:mousemove
    // parent:touchend
    // body:keyup.enter
    elm = getElementReference(elm, splt[0]);
    eventName = splt[1];
  }

  if (!elm) {
    // something's up, let's not continue and just return a noop()
    return noop;
  }

  // test to see if we're looking for an exact keycode
  splt = eventName.split('.');

  if (splt.length > 1) {
    // looks like this listener is also looking for a keycode
    // keyup.enter
    eventName = splt[0];
    testKeyCode = KEY_CODE_MAP[splt[1]];
  }

  // create the our internal event listener callback we'll be firing off
  // within it is the user's event listener callback and some other goodies
  function eventListener(ev: any) {
    if (testKeyCode > 0 && ev.keyCode !== testKeyCode) {
      // we're looking for a specific keycode
      // but the one we were given wasn't the right keycode
      return;
    }

    // fire the user's component event listener callback
    // if the instance isn't ready yet, this listener is already
    // set to handle that and re-queue the update when it is ready
    listenerCallback(ev);

    if ((elm as HostElement).$instance) {
      // only queue an update if this element itself is a host element
      // and only queue an update if host element's instance is ready
      // once its instance has been created, it'll then queue the update again
      // queue it up for an update which then runs a re-render
      (elm as HostElement)._queueUpdate();
    }
  }

  // ok, good to go, let's add the actual listener to the dom element
  elm.addEventListener(eventName, eventListener, eventListenerOpts);

  // return a function which is used to remove this very same listener
  return function removeListener() {
    elm && elm.removeEventListener(eventName, eventListener, eventListenerOpts);
  };
}


export function detachListeners(elm: HostElement) {
  const deregisterFns = elm._listeners;

  if (deregisterFns) {
    const eventNames = Object.keys(deregisterFns);

    for (var i = 0; i < eventNames.length; i++) {
      deregisterFns[eventNames[i]]();
    }

    elm._listeners = null;
  }
}
