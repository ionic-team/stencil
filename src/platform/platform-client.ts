import { ComponentMeta, ComponentMode, ComponentRegistry, Ionic } from '../utils/interfaces';
import { noop, toCamelCase } from '../utils/helpers';
import { PlatformApi } from './platform-api';


export function PlatformClient(win: any, doc: HTMLDocument, ionic: Ionic): PlatformApi {
  const registry: ComponentRegistry = {};
  const bundleCBs: BundleCallbacks = {};
  const jsonReqs: string[] = [];
  const css: {[tag: string]: boolean} = {};
  const nextCBs: Function[] = [];
  let nextPending: boolean;
  const readCBs: RafCallback[] = [];
  const writeCBs: RafCallback[] = [];
  let rafPending: boolean;
  const staticDir: string = ionic.staticDir;

  const hasPromises = (typeof Promise !== "undefined" && Promise.toString().indexOf("[native code]") !== -1);

  const ua = win.navigator.userAgent.toLowerCase();
  const isIOS = /iphone|ipad|ipod|ios/.test(ua);

  const raf: RequestAnimationFrame = ionic.raf ? ionic.raf : win.requestAnimationFrame.bind(win);


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

      cmpMode.loaded = true;
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
    if (cmpMode && cmpMode.loaded) {
      cb(cmpMeta, cmpMode);

    } else {
      const bundleId = cmpMode.bundleId;

      if (bundleCBs[bundleId]) {
        bundleCBs[bundleId].push(cb);
      } else {
        bundleCBs[bundleId] = [cb];
      }

      const url = `${staticDir}ionic.${bundleId}.js`;

      jsonp(url, jsonReqs, doc);
    }
  }

  function nextTick(cb: Function) {
    nextCBs.push(cb);

    if (!nextPending) {
      nextPending = true;

      if (hasPromises) {
        Promise.resolve().then(function nextTickHandler() {
          nextPending = false;

          const callbacks = nextCBs.slice(0);
          nextCBs.length = 0;

          for (let i = 0; i < callbacks.length; i++) {
            callbacks[i]();
          }
        }).catch(err => {
          console.error(err);
        });

        if (isIOS) {
          // Adopt from vue.js: https://github.com/vuejs/vue, MIT Licensed
          // In problematic UIWebViews, Promise.then doesn't completely break, but
          // it can get stuck in a weird state where callbacks are pushed into the
          // microtask queue but the queue isn't being flushed, until the browser
          // needs to do some other work, e.g. handle a timer. Therefore we can
          // "force" the microtask queue to be flushed by adding an empty timer.
          setTimeout(noop);
        }

      } else {
        setTimeout(function nextTickHandler() {
          nextPending = false;

          const callbacks = nextCBs.slice(0);
          nextCBs.length = 0;

          for (let i = 0; i < callbacks.length; i++) {
            callbacks[i]();
          }
        });
      }
    }
  }

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

  function createElement(tagName: any): HTMLElement {
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

  function tag(elm: Element): string {
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

  function setStyle(elm: HTMLElement, styleName: string, styleValue: any) {
    (<any>elm.style)[toCamelCase(styleName)] = styleValue;
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

  function getDocumentHead(): HTMLHeadElement {
    return doc.head;
  }


  return {
    registerComponent: registerComponent,
    getComponentMeta: getComponentMeta,
    loadComponent: loadComponent,
    createElement: createElement,
    createElementNS: createElementNS,
    createTextNode: createTextNode,
    createComment: createComment,
    insertBefore: insertBefore,
    removeChild: removeChild,
    appendChild: appendChild,
    parentNode: parentNode,
    nextSibling: nextSibling,
    tag: tag,
    setTextContent: setTextContent,
    getTextContent: getTextContent,
    getAttribute: getAttribute,
    setStyle: setStyle,
    isElement: isElement,
    isText: isText,
    isComment: isComment,
    nextTick: nextTick,
    domRead: domRead,
    domWrite: domWrite,
    hasCss: hasCss,
    setCss: setCss,
    getDocumentHead: getDocumentHead,
    supports: {
      shadowDom: !(win.ShadyDOM && win.ShadyDOM.inUse)
    },
    staticDir: ionic.staticDir
  }
}


export interface BundleCallbacks {
  [bundleId: string]: Function[];
}


export interface RafCallback {
  (timeStamp?: number): void;
}


function jsonp(jsonpUrl: string, jsonReqs: string[], doc?: HTMLDocument, scriptTag?: HTMLScriptElement, tmrId?: any) {
  if (jsonReqs.indexOf(jsonpUrl) > -1) {
    return;
  }
  jsonReqs.push(jsonpUrl);

  scriptTag = <HTMLScriptElement>doc.createElement('script');

  scriptTag.charset = 'utf-8';
  scriptTag.async = true;
  (<any>scriptTag).timeout = 120000;

  scriptTag.src = jsonpUrl;

  tmrId = setTimeout(onScriptComplete, 120000);

  function onScriptComplete() {
    clearTimeout(tmrId);
    scriptTag.onerror = scriptTag.onload = null;
    scriptTag.parentNode.removeChild(scriptTag);

    var index = jsonReqs.indexOf(jsonpUrl);
    if (index > -1) {
      jsonReqs.splice(index, 1);
    }
  }

  scriptTag.onerror = scriptTag.onload = onScriptComplete;

  doc.head.appendChild(scriptTag);
}


export interface RequestAnimationFrame {
  (cb: {(timeStamp?: number): void}): void;
}
