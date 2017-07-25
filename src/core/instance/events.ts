import { ComponentInstance, EventEmitterData, EventMeta, HostElement, ListenMeta, ListenOptions, PlatformApi } from '../../util/interfaces';
import { getElementReference, noop } from '../../util/helpers';
import { KEY_CODE_MAP } from '../../util/constants';


export function attachListeners(plt: PlatformApi, listeners: ListenMeta[], elm: HostElement, instance: ComponentInstance) {
  if (listeners) {
    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i];
      if (listener.eventEnabled !== false) {
        (elm._listeners = elm._listeners || {})[listener.eventName] = addEventListener(
          plt,
          elm,
          listener.eventName,
          (<any>instance)[listener.eventMethodName].bind(instance),
          listener
        );
      }
    }
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
            deregisterFns[eventName] = addEventListener(plt, elm, attachToEventName, (<any>instance)[listener.eventMethodName].bind(instance), listener);

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


export function addEventListener(plt: PlatformApi, elm: HTMLElement|HTMLDocument|Window, eventName: string, userEventListener: {(ev?: any): any}, opts: ListenOptions) {
  var splt = eventName.split(':');
  if (elm && splt.length > 1) {
    // document:mousemove
    // parent:touchend
    // body:keyup.enter
    elm = getElementReference(elm, splt[0]);
    eventName = splt[1];
  }

  if (!elm) {
    return noop;
  }

  splt = eventName.split('.');
  let testKeyCode = 0;

  if (splt.length > 1) {
    // keyup.enter
    eventName = splt[0];
    testKeyCode = KEY_CODE_MAP[splt[1]];
  }

  const eventListener = (ev: any) => {
    if (testKeyCode > 0 && ev.keyCode !== testKeyCode) {
      // we're looking for a specific keycode but this wasn't it
      return;
    }

    // fire the component's event listener callback
    userEventListener(ev);

    // test if this is the user's interaction
    if (isUserInteraction(eventName)) {
      // so turns out that it's very important to flush the queue now
      // this way the app immediately reflects whatever the user just did
      plt.queue.flush();
    }
  };

  const eventListenerOpts = plt.getEventOptions(opts);

  elm.addEventListener(eventName, eventListener, eventListenerOpts);

  return function removeListener() {
    if (elm) {
      elm.removeEventListener(eventName, eventListener, eventListenerOpts);
    }
  };
}


function isUserInteraction(eventName: string) {
  for (var i = 0; i < USER_INTERACTIONS.length; i++) {
    if (eventName.indexOf(USER_INTERACTIONS[i]) > -1) {
      return true;
    }
  }
  return false;
}


const USER_INTERACTIONS = ['touch', 'mouse', 'pointer', 'key', 'focus', 'blur', 'drag'];


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


export function initComponentEvents(plt: PlatformApi, componentEvents: EventMeta[], instance: ComponentInstance) {
  if (componentEvents) {
    componentEvents.forEach(eventMeta => {

      instance[eventMeta.eventMethodName] = {
        emit: function eventEmitter(data: any) {
          const eventData: EventEmitterData = {
            bubbles: eventMeta.eventBubbles,
            composed: eventMeta.eventComposed,
            cancelable: eventMeta.eventCancelable,
            detail: data
          };
          plt.emitEvent(instance.__el, eventMeta.eventName, eventData);
        }
      };

    });
  }
}
