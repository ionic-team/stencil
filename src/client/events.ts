import { Component, ListenMeta, ListenOptions, QueueApi } from '../util/interfaces';
import { getElementReference, noop } from '../util/helpers';
import { KEY_CODE_MAP } from '../util/constants';


let supportsOpts: boolean = null;


export function attachListeners(queue: QueueApi, listeners: ListenMeta[], instance: Component) {
  for (var i = 0; i < listeners.length; i++) {
    var listener = listeners[i];
    if (listener.enabled !== false) {
      instance.$listeners = instance.$listeners || {};
      instance.$listeners[listener.eventName] = addEventListener(queue, instance.$el, listener.eventName, instance[listener.methodName].bind(instance), listener);
    }
  }
}


export function enableListener(queue: QueueApi, instance: Component, eventName: string, shouldEnable: boolean, attachTo?: string) {
  if (instance && instance.$meta) {
    const listeners = instance.$meta.listeners;

    if (listeners) {
      const deregisterFns = instance.$listeners = instance.$listeners || {};

      for (var i = 0; i < listeners.length; i++) {
        var listener = listeners[i];

        if (listener.eventName === eventName) {

          if (shouldEnable && !deregisterFns[eventName]) {
            var attachToEventName = attachTo ? `${attachTo}:${eventName}` : eventName;
            deregisterFns[eventName] = addEventListener(queue, instance.$el, attachToEventName, instance[listener.methodName].bind(instance), listener);

          } else if (!shouldEnable && deregisterFns[eventName]) {
            deregisterFns[eventName]();
            delete instance.$listeners[eventName];
          }

          return;
        }
      }
    }
  }
}


export function addEventListener(queue: QueueApi, elm: HTMLElement|HTMLDocument|Window, eventName: string, userEventListener: {(ev?: any): void}, opts: ListenOptions = {}) {
  if (!elm) {
    return noop;
  }

  if (supportsOpts === null) {
    supportsOpts = checkEventOptsSupport(elm);
  }

  var eventListenerOpts: any = (supportsOpts) ? {
        'capture': !!opts.capture,
        'passive': !!opts.passive
      } : !!opts.capture;

  var splt = eventName.split(':');
  if (splt.length > 1) {
    // document:mousemove
    // parent:touchend
    // body:keyup.enter
    elm = getElementReference(elm, splt[0]);
    eventName = splt[1];
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
      // so it's very important to flush the queue now
      // so that the app reflects whatever they just did
      // basically don't let requestIdleCallback delay the important
      queue.flush();
    }
  };

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


export function detachListeners(instance: Component) {
  const deregisterFns = instance.$listeners;

  if (deregisterFns) {
    const eventNames = Object.keys(deregisterFns);

    for (var i = 0; i < eventNames.length; i++) {
      deregisterFns[eventNames[i]]();
    }

    instance.$listeners = null;
  }
}


function checkEventOptsSupport(elm: any) {
  let hasEventOptionsSupport = false;

  try {
    var opts = Object.defineProperty({}, 'passive', {
      get: function() {
        hasEventOptionsSupport = true;
      }
    });
    elm.addEventListener('test', null, opts);
  } catch (e) {}

  return hasEventOptionsSupport;
}
