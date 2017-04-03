import { ComponentMeta, ComponentMode, ComponentRegistry, Ionic } from '../utils/interfaces';
import { noop } from '../utils/helpers';
import { PlatformApi } from './platform-api';


export function PlatformClient(win: any, doc: HTMLDocument, ionic: Ionic): PlatformApi {
  const staticDir: string = ionic.staticDir;
  const registry: ComponentRegistry = {};
  const bundleCBs: BundleCallbacks = {};
  const jsonReqs: string[] = [];
  const css: {[tag: string]: boolean} = {};

  const isIOS = /iphone|ipad|ipod|ios/.test(win.navigator.userAgent.toLowerCase());
  const hasNativeShadowDom = !(win.ShadyDOM && win.ShadyDOM.inUse);

  const raf: RequestAnimationFrame = ionic.raf ? ionic.raf : win.requestAnimationFrame.bind(win);
  const readCBs: RafCallback[] = [];
  const writeCBs: RafCallback[] = [];
  let rafPending: boolean;


  ionic.loadComponents = function loadComponent(bundleId) {
    const args = arguments;
    for (var i = 1; i < args.length; i++) {
      var cmpModeData = args[i];
      var tag = cmpModeData[0];
      var mode = cmpModeData[1];

      var cmpMeta = registry[tag];
      var cmpMode = cmpMeta.modes[mode];

      cmpMode.styles = cmpModeData[2];

      var importModuleFn = cmpModeData[3];
      var moduleImports = {};
      importModuleFn(moduleImports);
      cmpMeta.componentModule = moduleImports[Object.keys(moduleImports)[0]];

      cmpMode.isLoaded = true;
    }

    const callbacks = bundleCBs[bundleId];
    if (callbacks) {
      for (var i = 0, l = callbacks.length; i < l; i++) {
        callbacks[i]();
      }
      delete bundleCBs[bundleId];
    }
  };


  function loadComponent(cmpMeta: ComponentMeta, cmpMode: ComponentMode, cb: Function): void {
    if (cmpMode && cmpMode.isLoaded) {
      cb(cmpMeta, cmpMode);

    } else {
      const bundleId = cmpMode.bundleId;

      if (bundleCBs[bundleId]) {
        bundleCBs[bundleId].push(cb);
      } else {
        bundleCBs[bundleId] = [cb];
      }

      const url = `${staticDir}ionic.${bundleId}.js`;

      if (jsonReqs.indexOf(url) === -1) {
        jsonp(url);
      }
    }
  }


  function jsonp(jsonpUrl: string) {
    jsonReqs.push(jsonpUrl);

    var scriptElm = createElement('script');
    scriptElm.charset = 'utf-8';
    scriptElm.async = true;
    scriptElm.src = jsonpUrl;

    var tmrId = setTimeout(onScriptComplete, 120000);

    function onScriptComplete() {
      clearTimeout(tmrId);
      scriptElm.onerror = scriptElm.onload = null;
      scriptElm.parentNode.removeChild(scriptElm);

      var index = jsonReqs.indexOf(jsonpUrl);
      if (index > -1) {
        jsonReqs.splice(index, 1);
      }
    }

    scriptElm.onerror = scriptElm.onload = onScriptComplete;

    doc.head.appendChild(scriptElm);
  }


  function attachShadow(elm: Element, cmpMode: ComponentMode, cmpModeId: string) {
    const shadowElm = elm.attachShadow({ mode: 'open' });

    if (hasNativeShadowDom) {
      if (!cmpMode.styleElm) {
        cmpMode.styleElm = createElement('style');
        cmpMode.styleElm.innerHTML = cmpMode.styles;
      }

      shadowElm.appendChild(cmpMode.styleElm.cloneNode(true));

    } else {
      if (!hasCss(cmpModeId)) {
        const headStyleEle = createElement('style');
        headStyleEle.dataset['cmpModeId'] = cmpModeId;
        headStyleEle.innerHTML = cmpMode.styles.replace(/\:host\-context\((.*?)\)|:host\((.*?)\)|\:host/g, '__h');
        appendChild(doc.head, headStyleEle);
        setCss(cmpModeId);
      }
    }

    return shadowElm;
  }


  const nextTick = (function () {
    /* Adopted from Vue.js, MIT, https://github.com/vuejs/vue */
    const callbacks: Function[] = [];
    let pending = false;
    let timerFunc;

    function nextTickHandler() {
      pending = false;
      const copies = callbacks.slice(0);

      callbacks.length = 0;
      for (let i = 0; i < copies.length; i++) {
        copies[i]();
      }
    }

    if (typeof Promise !== "undefined" && Promise.toString().indexOf("[native code]") !== -1) {
      const p = Promise.resolve();
      const logError = err => { console.error(err); };

      timerFunc = function promiseTick() {
        p.then(nextTickHandler).catch(logError);
        // in problematic UIWebViews, Promise.then doesn't completely break, but
        // it can get stuck in a weird state where callbacks are pushed into the
        // microtask queue but the queue isn't being flushed, until the browser
        // needs to do some other work, e.g. handle a timer. Therefore we can
        // "force" the microtask queue to be flushed by adding an empty timer.
        if (isIOS) setTimeout(noop);
      }

    } else {
      // fallback to setTimeout
      timerFunc = function timeoutTick() {
        setTimeout(nextTickHandler, 0);
      };
    }

    return function queueNextTick(cb: Function) {
      callbacks.push(cb);

      if (!pending) {
        pending = true;
        timerFunc();
      }
    }
  })();


  function domRead(cb: RafCallback) {
    readCBs.push(cb);
    if (!rafPending) {
      rafQueue();
    }
  }


  function domWrite(cb: RafCallback) {
    writeCBs.push(cb);
    if (!rafPending) {
      rafQueue();
    }
  }


  function rafQueue() {
    rafPending = true;

    raf(function rafCallback(timeStamp) {
      rafFlush(timeStamp);
    });
  }


  function rafFlush(timeStamp: number, startTime?: number, cb?: RafCallback, err?: any) {
    try {
      startTime = performance.now();

      // ******** DOM READS ****************
      while (cb = readCBs.shift()) {
        cb(timeStamp);
      }

      // ******** DOM WRITES ****************
      while (cb = writeCBs.shift()) {
        cb(timeStamp);

        if ((performance.now() - startTime) > 8) {
          break;
        }
      }

    } catch(e) {
      err = e;
    }

    rafPending = false;

    if (readCBs.length || writeCBs.length) {
      rafQueue();
    }

    if (err) {
      throw err;
    }
  }


  function registerComponent(cmpMeta: ComponentMeta) {
    registry[cmpMeta.tag] = cmpMeta;
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
    nextTick: nextTick,
    domRead: domRead,
    domWrite: domWrite,

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


export interface RafCallback {
  (timeStamp?: number): void;
}


export interface RequestAnimationFrame {
  (cb: {(timeStamp?: number): void}): void;
}
