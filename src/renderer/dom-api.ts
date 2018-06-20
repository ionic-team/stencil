import { AppGlobal, DomApi, EventEmitterData } from '../declarations';
import { Build } from '../util/build-conditionals';
import { KEY_CODE_MAP, NODE_TYPE } from '../util/constants';
import { toLowerCase } from '../util/helpers';


export function createDomApi(App: AppGlobal, win: any, doc: Document): DomApi {
  // using the $ prefix so that closure is
  // cool with property renaming each of these

  if (!App.ael) {
    App.ael = (elm, eventName, cb, opts) => elm.addEventListener(eventName, cb, opts);
    App.rel = (elm, eventName, cb, opts) => elm.removeEventListener(eventName, cb, opts);
  }

  const unregisterListenerFns = new WeakMap<Node, ElementUnregisterListeners>();

  const domApi: DomApi = {

    $documentElement: doc.documentElement,

    $head: doc.head,

    $body: doc.body,

    $supportsEventOptions: false,

    $nodeType: (node: any) =>
      node.nodeType,

    $createElement: (tagName: any) =>
      doc.createElement(tagName),

    $createElementNS: (namespace: string, tagName: string) =>
      doc.createElementNS(namespace, tagName),

    $createTextNode: (text: string) => doc.createTextNode(text),

    $createComment: (data: string) => doc.createComment(data),

    $insertBefore: (parentNode: Node, childNode: Node, referenceNode: Node) =>
      parentNode.insertBefore(childNode, referenceNode),

    // https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/remove
    // and it's polyfilled in es5 builds
    $remove: (node: Node) => (node as any).remove(),

    $appendChild: (parentNode: Node, childNode: Node) =>
      parentNode.appendChild(childNode),

    $childNodes: (node: Node) =>
      node.childNodes,

    $parentNode: (node: Node) =>
      node.parentNode,

    $nextSibling: (node: Node) =>
      node.nextSibling,

    $previousSibling: (node: Node) =>
      node.previousSibling,

    $tagName: (elm: Element) =>
      toLowerCase(elm.nodeName),

    $getTextContent: (node: any) =>
      node.textContent,

    $setTextContent: (node: Node, text: string) =>
      node.textContent = text,

    $getAttribute: (elm: Element, key: string) =>
      elm.getAttribute(key),

    $setAttribute: (elm: Element, key: string, val: string) =>
      elm.setAttribute(key, val),

    $setAttributeNS: (elm, namespaceURI: string, qualifiedName: string, val: string) =>
      elm.setAttributeNS(namespaceURI, qualifiedName, val),

    $removeAttribute: (elm, key) =>
      elm.removeAttribute(key),

    $hasAttribute: (elm: Element, key) =>
      elm.hasAttribute(key),

    $getMode: (elm: Element) =>
      elm.getAttribute('mode') || (App.Context || {}).mode,

    $elementRef: (elm: any, referenceName: string) => {
      if (referenceName === 'child') {
        return elm.firstElementChild;
      }
      if (referenceName === 'parent') {
        return domApi.$parentElement(elm);
      }
      if (referenceName === 'body') {
        return domApi.$body;
      }
      if (referenceName === 'document') {
        return doc;
      }
      if (referenceName === 'window') {
        return win;
      }
      return elm;
    },

    $addEventListener: (assignerElm, eventName, listenerCallback, useCapture, usePassive, attachTo, eventListenerOpts?: any, splt?: string[]) => {
      // remember the original name before we possibly change it
      const assignersEventName = eventName;
      let attachToElm = assignerElm;

      // get the existing unregister listeners for
      // this element from the unregister listeners weakmap
      let assignersUnregListeners = unregisterListenerFns.get(assignerElm);

      if (assignersUnregListeners && assignersUnregListeners[assignersEventName]) {
        // removed any existing listeners for this event for the assigner element
        // this element already has this listener, so let's unregister it now
        assignersUnregListeners[assignersEventName]();
      }

      if (typeof attachTo === 'string') {
        // attachTo is a string, and is probably something like
        // "parent", "window", or "document"
        // and the eventName would be like "mouseover" or "mousemove"
        attachToElm = domApi.$elementRef(assignerElm, attachTo);

      } else if (typeof attachTo === 'object') {
        // we were passed in an actual element to attach to
        attachToElm = attachTo;

      } else {
        // depending on the event name, we could actually be attaching
        // this element to something like the document or window
        splt = eventName.split(':');

        if (splt.length > 1) {
          // document:mousemove
          // parent:touchend
          // body:keyup.enter
          attachToElm = domApi.$elementRef(assignerElm, splt[0]);
          eventName = splt[1];
        }
      }

      if (!attachToElm) {
        // somehow we're referencing an element that doesn't exist
        // let's not continue
        return;
      }

      let eventListener = listenerCallback;

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

      // create the actual event listener options to use
      // this browser may not support event options
      eventListenerOpts = domApi.$supportsEventOptions ? {
        capture: !!useCapture,
        passive: !!usePassive
      } : !!useCapture;

      // ok, good to go, let's add the actual listener to the dom element
      App.ael(attachToElm, eventName, eventListener, eventListenerOpts);

      if (!assignersUnregListeners) {
        // we don't already have a collection, let's create it
        unregisterListenerFns.set(assignerElm, assignersUnregListeners = {});
      }

      // add the unregister listener to this element's collection
      assignersUnregListeners[assignersEventName] = () => {
        // looks like it's time to say goodbye
        attachToElm && App.rel(attachToElm, eventName, eventListener, eventListenerOpts);
        assignersUnregListeners[assignersEventName] = null;
      };
    },

    $removeEventListener: (elm, eventName) => {
      // get the unregister listener functions for this element
      const assignersUnregListeners = unregisterListenerFns.get(elm);

      if (assignersUnregListeners) {
        // this element has unregister listeners
        if (eventName) {
          // passed in one specific event name to remove
          assignersUnregListeners[eventName] && assignersUnregListeners[eventName]();

        } else {
          // remove all event listeners
          Object.keys(assignersUnregListeners).forEach(assignersEventName => {
            assignersUnregListeners[assignersEventName] && assignersUnregListeners[assignersEventName]();
          });
        }
      }
    }

  };


  if (Build.shadowDom) {
    domApi.$attachShadow = (elm, shadowRootInit) => elm.attachShadow(shadowRootInit);

    domApi.$supportsShadowDom = !!domApi.$documentElement.attachShadow;

    if (Build.isDev) {
      if ((win as Window).location.search.indexOf('shadow=false') > 0) {
        // by adding ?shadow=false it'll force the slot polyfill
        // only add this check when in dev mode
        domApi.$supportsShadowDom = false;
      }
    }
  }

  if (Build.es5) {
    if (typeof win.CustomEvent !== 'function') {
      // CustomEvent polyfill
      win.CustomEvent = (event: any, data: EventEmitterData, evt?: any) => {
        evt = doc.createEvent('CustomEvent');
        evt.initCustomEvent(event, data.bubbles, data.cancelable, data.detail);
        return evt;
      };
      win.CustomEvent.prototype = win.Event.prototype;
    }
  }
  domApi.$dispatchEvent = (elm, eventName, data) => elm && elm.dispatchEvent(new win.CustomEvent(eventName, data));

  if (Build.event || Build.listener) {
    // test if this browser supports event options or not
    try {
      (win as Window).addEventListener('e', null,
        Object.defineProperty({}, 'passive', {
          get: () => domApi.$supportsEventOptions = true
        })
      );
    } catch (e) {}
  }

  domApi.$parentElement = (elm: Node, parentNode?: any): any =>
    // if the parent node is a document fragment (shadow root)
    // then use the "host" property on it
    // otherwise use the parent node
    ((parentNode = domApi.$parentNode(elm)) && domApi.$nodeType(parentNode) === NODE_TYPE.DocumentFragment) ? parentNode.host : parentNode;

  return domApi;
}

interface ElementUnregisterListeners {
  [referenceName: string]: Function;
}
