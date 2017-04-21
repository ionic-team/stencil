import { ComponentMeta, ComponentMode, ComponentRegistry,
  DomControllerApi, IonicGlobal, NextTickApi, PlatformApi } from '../util/interfaces';
import { h } from './renderer/h';
import { initInjectedIonic } from './injected-ionic';
import { parseComponentModeData } from '../util/data-parse';
import { toDashCase } from '../util/helpers';


export function PlatformClient(win: any, doc: HTMLDocument, ionic: IonicGlobal, staticDir: string, domCtrl: DomControllerApi, nextTickCtrl: NextTickApi): PlatformApi {
  const registry: ComponentRegistry = {};
  const loadedBundles: {[bundleId: string]: boolean} = {};
  const bundleCallbacks: BundleCallbacks = {};
  const activeJsonRequests: {[url: string]: boolean} = {};
  const moduleImports = {};
  const css: {[tag: string]: boolean} = {};
  const hasNativeShadowDom = !(win.ShadyDOM && win.ShadyDOM.inUse);


  const injectedIonic = initInjectedIonic(doc);


  ionic.loadComponents = function loadComponents(bundleId) {
    var args = arguments;
    for (var i = 1; i < args.length; i++) {
      // first arg is the bundleId
      // each arg after that is a component/mode
      parseComponentModeData(registry, moduleImports, h, injectedIonic, args[i]);

      // fire off all the callbacks waiting on this bundle to load
      var callbacks = bundleCallbacks[bundleId];
      if (callbacks) {
        for (var j = 0, jlen = callbacks.length; j < jlen; j++) {
          callbacks[j]();
        }
        delete bundleCallbacks[bundleId];
      }

      // remember that we've already loaded this bundle
      loadedBundles[bundleId] = true;
    }
  };


  function loadComponent(bundleId: string, cb: Function): void {
    if (loadedBundles[bundleId]) {
      // we've already loaded this bundle
      cb();

    } else {
      // never seen this bundle before, let's start the request
      // and add it to the bundle callbacks to fire when it's loaded
      if (bundleCallbacks[bundleId]) {
        bundleCallbacks[bundleId].push(cb);
      } else {
        bundleCallbacks[bundleId] = [cb];
      }

      // create the url we'll be requesting
      const url = `${staticDir}ionic.${bundleId}.js`;

      if (!activeJsonRequests[url]) {
        // not already actively requesting this url
        // let's kick off the request
        jsonp(url);
      }
    }
  }


  function jsonp(url: string) {
    // remember that we're actively requesting this url
    activeJsonRequests[url] = true;

    // create a sript element to add to the document.head
    var scriptElm = createElement('script');
    scriptElm.charset = 'utf-8';
    scriptElm.async = true;
    scriptElm.src = url;

    // create a fallback timeout if something goes wrong
    var tmrId = setTimeout(onScriptComplete, 120000);

    function onScriptComplete() {
      clearTimeout(tmrId);
      scriptElm.onerror = scriptElm.onload = null;
      scriptElm.parentNode.removeChild(scriptElm);

      // remove from our list of active requests
      delete activeJsonRequests[url];
    }

    // add script completed listener to this script element
    scriptElm.onerror = scriptElm.onload = onScriptComplete;

    // inject a script tag in the head
    // kick off the actual request
    doc.head.appendChild(scriptElm);
  }


  function attachShadow(elm: Element, cmpMode: ComponentMode, cmpModeId: string) {
    const shadowRoot = elm.attachShadow({ mode: 'open' });

    if (cmpMode.styles) {
      if (hasNativeShadowDom) {
        if (!cmpMode.styleElm) {
          cmpMode.styleElm = createElement('style');
          cmpMode.styleElm.innerHTML = cmpMode.styles;
        }

        shadowRoot.appendChild(cmpMode.styleElm.cloneNode(true));

      } else if (!hasCss(cmpModeId)) {
        const headStyleEle = createElement('style');
        headStyleEle.dataset['cmpModeId'] = cmpModeId;
        headStyleEle.innerHTML = cmpMode.styles.replace(/\:host\-context\((.*?)\)|:host\((.*?)\)|\:host/g, '__h');
        appendChild(doc.head, headStyleEle);
        setCss(cmpModeId);
      }
    }

    return shadowRoot;
  }

  function registerComponent(tag: string, data: any[]) {
    const modeBundleIds = data[0];
    const props = data[1] || {};

    const cmpMeta: ComponentMeta = registry[tag] = {
      tag: tag,
      modes: {},
      props: props,
      obsAttrs: []
    };

    let keys = Object.keys(modeBundleIds);
    for (var i = 0; i < keys.length; i++) {
      cmpMeta.modes[keys[i]] = {
        bundleId: modeBundleIds[keys[i]]
      };
    }

    keys = cmpMeta.tag.split('-');
    keys.shift();
    cmpMeta.hostCss = keys.join('-');

    props.color = {};
    props.mode = {};

    keys = Object.keys(props);
    for (i = 0; i < keys.length; i++) {
      cmpMeta.obsAttrs.push(toDashCase(keys[i]));
    }

    return cmpMeta;
  }

  function getComponentMeta(tag: string) {
    return registry[tag];
  }

  function createElement<K extends keyof HTMLElementTagNameMap>(tagName: K): HTMLElementTagNameMap[K] {
    return doc.createElement(tagName);
  }

  function createElementNS(namespaceURI: string, qualifiedName: string): Element {
    return doc.createElementNS(namespaceURI, qualifiedName);
  }

  function createTextNode(text: string): Text {
    return doc.createTextNode(text);
  }

  function createComment(text: string): Comment {
    return doc.createComment(text);
  }

  function insertBefore(parentNode: Node, newNode: Node, referenceNode: Node | null): void {
    parentNode.insertBefore(newNode, referenceNode);
  }

  function removeChild(parentNode: Node, childNode: Node): void {
    parentNode.removeChild(childNode);
  }

  function appendChild(parentNode: Node, childNode: Node): void {
    parentNode.appendChild(childNode);
  }

  function parentNode(node: Node): Node | null {
    return node.parentNode;
  }

  function nextSibling(node: Node): Node | null {
    return node.nextSibling;
  }

  function tagName(elm: Element): string {
    return (elm.tagName || '').toLowerCase();
  }

  function setTextContent(node: Node, text: string | null): void {
    node.textContent = text;
  }

  function getTextContent(node: Node): string | null {
    return node.textContent;
  }

  function getAttribute(elm: HTMLElement, attrName: string): string {
    return elm.getAttribute(attrName);
  }

  function isElement(node: Node): node is Element {
    return node.nodeType === 1;
  }

  function isText(node: Node): node is Text {
    return node.nodeType === 3;
  }

  function isComment(node: Node): node is Comment {
    return node.nodeType === 8;
  }

  function hasCss(moduleId: string): boolean {
    return !!css[moduleId];
  }

  function setCss(linkUrl: string) {
    css[linkUrl] = true;
  }


  return {
    registerComponent: registerComponent,
    getComponentMeta: getComponentMeta,
    loadComponent: loadComponent,

    isElement: isElement,
    isText: isText,
    isComment: isComment,
    nextTick: nextTickCtrl.nextTick.bind(nextTickCtrl),
    domRead: domCtrl.read.bind(domCtrl),
    domWrite: domCtrl.write.bind(domCtrl),

    $createElement: createElement,
    $createElementNS: createElementNS,
    $createTextNode: createTextNode,
    $createComment: createComment,
    $insertBefore: insertBefore,
    $removeChild: removeChild,
    $appendChild: appendChild,
    $parentNode: parentNode,
    $nextSibling: nextSibling,
    $tagName: tagName,
    $setTextContent: setTextContent,
    $getTextContent: getTextContent,
    $getAttribute: getAttribute,
    $attachShadow: attachShadow
  }
}


export interface BundleCallbacks {
  [bundleId: string]: Function[];
}
