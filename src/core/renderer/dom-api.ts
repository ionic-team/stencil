import { Build } from '../../util/build-conditionals';
import { DomApi, EventEmitterData } from '../../util/interfaces';
import { NODE_TYPE } from '../../util/constants';
import { toLowerCase } from '../../util/helpers';


export function createDomApi(win: any, doc: Document, WindowCustomEvent?: any): DomApi {
  // using the $ prefix so that closure is
  // cool with property renaming each of these


  const domApi: DomApi = {

    $documentElement: doc.documentElement,

    $head: doc.head,

    $body: doc.body,

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

    $removeChild: (parentNode: Node, childNode: Node) =>
      parentNode.removeChild(childNode),

    $appendChild: (parentNode: Node, childNode: Node) =>
      parentNode.appendChild(childNode),

    $childNodes: (node: Node) =>
      node.childNodes,

    $parentNode: (node: Node) =>
      node.parentNode,

    $nextSibling: (node: Node) =>
      node.nextSibling,

    $tagName: (elm: Element) =>
      toLowerCase(elm.tagName),

    $getTextContent: (node: any) =>
      node.textContent,

    $setTextContent: (node: Node, text: string) =>
      node.textContent = text,

    $getAttribute: (elm: Element, key: any) =>
      elm.getAttribute(key),

    $setAttribute: (elm: Element, key: string, val: string) =>
      elm.setAttribute(key, val),

    $setAttributeNS: (elm, namespaceURI: string, qualifiedName: string, val: string) =>
      elm.setAttributeNS(namespaceURI, qualifiedName, val),

    $removeAttribute: (elm, key) =>
      elm.removeAttribute(key),

    $addEventListener: (elm, eventName, eventListener, useCapture, usePassive, eventListenerOpts?: any) => {
      eventListenerOpts = domApi.$supportsEventOptions ? {
        capture: !!useCapture,
        passive: !!usePassive
      } : !!useCapture;

      // ok, good to go, let's add the actual listener to the dom element
      elm.addEventListener(eventName, eventListener, eventListenerOpts);

      // return a function which is used to remove this very same listener
      return () => elm && elm.removeEventListener(eventName, eventListener, eventListenerOpts);
    },

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
    }

  };


  if (Build.shadowDom) {
    domApi.$attachShadow = (elm, shadowRootInit) => elm.attachShadow(shadowRootInit);

    domApi.$supportsShadowDom = !!domApi.$documentElement.attachShadow;
  }


  if (Build.event) {
    WindowCustomEvent = win.CustomEvent;
    if (typeof WindowCustomEvent !== 'function') {
      // CustomEvent polyfill
      WindowCustomEvent = (event: any, data: EventEmitterData, evt?: any) => {
        evt = doc.createEvent('CustomEvent');
        evt.initCustomEvent(event, data.bubbles, data.cancelable, data.detail);
        return evt;
      };
      WindowCustomEvent.prototype = win.Event.prototype;
    }

    // test if this browser supports event options or not
    try {
      (win as Window).addEventListener('e', null,
        Object.defineProperty({}, 'passive', {
          get: () => domApi.$supportsEventOptions = true
        })
      );
    } catch (e) {}

    domApi.$dispatchEvent = (elm, eventName, data) => elm && elm.dispatchEvent(new WindowCustomEvent(eventName, data));
  }


  domApi.$parentElement = (elm: Node, parentNode?: any): any => {
    // if the parent node is a document fragment (shadow root)
    // then use the "host" property on it
    // otherwise use the parent node
    parentNode = domApi.$parentNode(elm);
    return (parentNode && domApi.$nodeType(parentNode) === NODE_TYPE.DocumentFragment) ? parentNode.host : parentNode;
  };

  return domApi;
}
