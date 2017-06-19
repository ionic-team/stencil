import { Component, HostElement, ListenMeta, ListenOptions, PlatformApi, QueueApi } from '../../util/interfaces';
import { getElementReference, noop } from '../../util/helpers';
import { KEY_CODE_MAP } from '../../util/constants';


let supportsOpts: boolean = null;


export function attachListeners(queue: QueueApi, listeners: ListenMeta[], elm: HostElement, instance: Component) {
  if (listeners) {
    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i];
      if (listener.eventEnabled !== false) {
        elm._listeners = elm._listeners || {};
        elm._listeners[listener.eventName] = addEventListener(queue, elm, listener.eventName, (<any>instance)[listener.eventMethod].bind(instance), listener);
      }
    }
  }
}


export function enableListener(plt: PlatformApi, queue: QueueApi, elm: HostElement, instance: Component, eventName: string, shouldEnable: boolean, attachTo?: string) {
  if (instance) {
    const listenerMeta = plt.getComponentMeta(elm).listenersMeta;

    if (listenerMeta) {
      const deregisterFns = elm._listeners = elm._listeners || {};

      for (var i = 0; i < listenerMeta.length; i++) {
        var listener = listenerMeta[i];

        if (listener.eventName === eventName) {

          if (shouldEnable && !deregisterFns[eventName]) {
            var attachToEventName = attachTo ? `${attachTo}:${eventName}` : eventName;
            deregisterFns[eventName] = addEventListener(queue, instance.$el, attachToEventName, (<any>instance)[listener.eventMethod].bind(instance), listener);

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


export function addEventListener(queue: QueueApi, elm: HTMLElement|HTMLDocument|Window, eventName: string, userEventListener: {(ev?: any): any}, opts: ListenOptions) {
  if (!elm) {
    return noop;
  }

  var splt = eventName.split(':');
  if (splt.length > 1) {
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

  if (supportsOpts === null) {
    supportsOpts = checkEventOptsSupport(elm);
  }

  const eventListenerOpts: any = (supportsOpts) ? {
        'capture': !!(opts && opts.capture),
        'passive': !!(opts && opts.passive)
      } : !!(opts && opts.capture);

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
