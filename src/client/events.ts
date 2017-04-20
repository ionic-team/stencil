import { Component, ComponentMetaListeners, ListenOpts } from '../util/interfaces';
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


export function enableListener(instance: Component, eventName: string, shouldEnable: boolean) {
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
            deregisterFns[eventName] = addEventListener(instance.$el, eventName, instance[methodName].bind(instance), listenerOpts);

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


export function addEventListener(elm: HTMLElement|HTMLDocument|Window, eventName: string, cb: {(ev?: any): void}, opts: ListenOpts) {
  if (elm) {
    if (supportsOpts === null) {
      supportsOpts = checkEventOptsSupport(elm);
    }

    var optsArg: any = (supportsOpts) ? {
          'capture': !!opts.capture,
          'passive': !!opts.passive
        } : !!opts.capture;

    var splt = eventName.split(':');
    if (splt.length > 1) {
      // document:mousemove
      // body:keyup.enter
      eventName = splt[1];

      switch (splt[0]) {
        case 'document':
          elm = (<HTMLElement>elm).ownerDocument;
          break;
        case 'body':
          elm = (<HTMLElement>elm).ownerDocument.body;
          break;
        case 'window':
          elm = (<HTMLElement>elm).ownerDocument.defaultView
          break;
      }
    }

    splt = eventName.split('.');
    if (splt.length > 1) {
      // keyup.enter
      eventName = splt[0];
      var validKeycode: number = null;

      switch (splt[1]) {
        case 'enter':
          validKeycode = KEY_ENTER;
          break;
        case 'escape':
          // fall through
        case 'esc':
          validKeycode = KEY_ESCAPE;
          break;
        case 'space':
          validKeycode = KEY_SPACE;
          break;
        case 'tab':
          validKeycode = KEY_TAB;
          break;
      }

      if (validKeycode !== null) {
        var orgCb = cb;
        cb = function(ev: KeyboardEvent) {
          if (ev.keyCode === validKeycode) {
            orgCb(ev);
          }
        };
      }
    }

    elm.addEventListener(eventName, cb, optsArg);

    return function removeListener() {
      if (elm) {
        elm.removeEventListener(eventName, cb, optsArg);
      }
    };
  }

  return noop;
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


export function emitEvent(doc: HTMLDocument, instance: Component, eventName: string, data?: any) {
  if (instance && instance.$el) {
    const ev = doc.createEvent('CustomEvent');
    ev.initCustomEvent(eventName, true, true, data);
    instance.$el.dispatchEvent(ev);
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
    elm.addEventListener('opttest', null, opts);
  } catch (e) {}

  return hasEventOptionsSupport;
}

// const KEY_LEFT = 37;
// const KEY_UP = 38;
// const KEY_RIGHT = 39;
// const KEY_DOWN = 40;
const KEY_ENTER = 13;
const KEY_ESCAPE = 27;
const KEY_SPACE = 32;
const KEY_TAB = 9;
