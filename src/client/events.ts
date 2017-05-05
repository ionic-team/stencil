import { Component, ComponentMetaListeners, ListenOpts } from '../util/interfaces';
import { getElementReference, getKeyCodeByName } from '../util/helpers';
import { noop } from '../util/helpers';


let supportsOpts: boolean = null;


export function attachListeners(listenerMetaOpts: ComponentMetaListeners, instance: Component) {
  const methodNames = Object.keys(listenerMetaOpts);

  for (var i = 0; i < methodNames.length; i++) {
    var methodName = methodNames[i];
    var listenerOpts = listenerMetaOpts[methodName];
    if (listenerOpts.enabled !== false) {
      instance.$listeners = instance.$listeners || {};
      instance.$listeners[listenerOpts.eventName] = addEventListener(instance.$el, listenerOpts.eventName, instance[methodName].bind(instance), listenerOpts);
    }
  }
}


export function enableListener(instance: Component, eventName: string, shouldEnable: boolean, listenOn?: string) {
  if (instance && instance.$meta) {
    const listenerMetaOpts = instance.$meta.listeners;

    if (listenerMetaOpts) {
      const deregisterFns = instance.$listeners = instance.$listeners || {};
      const methodNames = Object.keys(listenerMetaOpts);

      for (var i = 0; i < methodNames.length; i++) {
        var methodName = methodNames[i];
        var listenerOpts = listenerMetaOpts[methodName];

        if (listenerOpts.eventName === eventName) {

          if (shouldEnable && !deregisterFns[eventName]) {
            var listenOnEventName = listenOn ? `${listenOn}:${eventName}` : eventName;
            deregisterFns[eventName] = addEventListener(instance.$el, listenOnEventName, instance[methodName].bind(instance), listenerOpts);

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


export function addEventListener(elm: HTMLElement|HTMLDocument|Window, eventName: string, cb: {(ev?: any): void}, opts: ListenOpts = {}) {
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
  if (splt.length > 1) {
    // keyup.enter
    eventName = splt[0];
    var validKeycode = getKeyCodeByName(splt[1]);

    if (validKeycode !== null) {
      var orgCb = cb;
      cb = function(ev: KeyboardEvent) {
        if (ev.keyCode === validKeycode) {
          orgCb(ev);
        }
      };
    }
  }

  elm.addEventListener(eventName, cb, eventListenerOpts);

  return function removeListener() {
    if (elm) {
      elm.removeEventListener(eventName, cb, eventListenerOpts);
    }
  };
}


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
