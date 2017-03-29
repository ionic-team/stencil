import { PlatformApi } from './platform-api';
import { getComponentId, noop, toCamelCase } from '../utils/helpers';
import { ComponentRegistry, ComponentMeta, Ionic, LoadComponentCallback } from '../utils/interfaces';
import { getStaticComponentDir } from '../utils/helpers';


export class PlatformClient implements PlatformApi {
  private registry: ComponentRegistry = {};
  private loadCBs: LoadCallbacks = {};
  private jsonReqs: string[] = [];
  private css: {[tag: string]: boolean} = {};
  private nextCBs: Function[] = [];
  private nextPending: boolean;
  private readCBs: RafCallback[] = [];
  private writeCBs: RafCallback[] = [];
  private rafPending: boolean;
  private hasPromises: boolean;
  private isIOS: boolean;

  staticDir: string;
  supports: { shadowDom?: boolean } = {};


  constructor(private w: any, private d: HTMLDocument, ionic: Ionic) {
    const self = this;

    self.supports.shadowDom = !(w.ShadyDOM && w.ShadyDOM.inUse);

    self.hasPromises = (typeof Promise !== "undefined" && Promise.toString().indexOf("[native code]") !== -1);

    self.staticDir = getStaticComponentDir(d);

    const ua = w.navigator.userAgent.toLowerCase();
    self.isIOS = /iphone|ipad|ipod|ios/.test(ua);

    ionic.loadComponent = function loadComponent(tag, mode, id, styles, importModuleFn) {
      const cmpMeta = self.registry[tag];

      const moduleImports = {};
      importModuleFn(moduleImports);
      const importNames = Object.keys(moduleImports);
      cmpMeta.module = moduleImports[importNames[0]];

      const cmpMode = cmpMeta.modes[mode];
      cmpMode.styles = styles;
      cmpMode.loaded = true;

      const moduleId = getComponentId(tag, mode, id);

      const callbacks = self.loadCBs[moduleId];
      if (callbacks) {
        for (var i = 0, l = callbacks.length; i < l; i++) {
          callbacks[i](cmpMeta, cmpMode);
        }
        delete self.loadCBs[moduleId];
      }
    };
  }

  nextTick(cb: Function) {
    const self = this;
    const nextCBs = self.nextCBs;

    nextCBs.push(cb);

    if (!self.nextPending) {
      self.nextPending = true;

      if (self.hasPromises) {
        Promise.resolve().then(function nextTickHandler() {
          self.nextPending = false;

          const callbacks = nextCBs.slice(0);
          nextCBs.length = 0;

          for (let i = 0; i < callbacks.length; i++) {
            callbacks[i]();
          }
        }).catch(err => {
          console.error(err);
        });

        if (self.isIOS) {
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
          self.nextPending = false;

          const callbacks = nextCBs.slice(0);
          nextCBs.length = 0;

          for (let i = 0; i < callbacks.length; i++) {
            callbacks[i]();
          }
        });
      }
    }
  }

  domRead(cb: RafCallback) {
    this.readCBs.push(cb);
    if (!this.rafPending) {
      this.rafQueue();
    }
  }

  domWrite(cb: RafCallback) {
    this.writeCBs.push(cb);
    if (!this.rafPending) {
      this.rafQueue();
    }
  }

  private rafQueue(self?: PlatformClient) {
    self = this;

    self.rafPending = true;

    self.w.requestAnimationFrame(function rafCallback(timeStamp) {
      self.rafFlush(timeStamp);
    });
  }

  private rafFlush(timeStamp: number, self?: PlatformClient, cb?: RafCallback, err?: any) {
    self = this;

    try {
      const startTime = performance.now();

      // ******** DOM READS ****************
      while (cb = self.readCBs.shift()) {
        cb(timeStamp);
      }

      // ******** DOM WRITES ****************
      while (cb = self.writeCBs.shift()) {
        cb(timeStamp);

        if ((performance.now() - startTime) > 8) {
          break;
        }
      }

    } catch(e) {
      err = e;
    }

    self.rafPending = false;

    if (self.readCBs.length || self.writeCBs.length) {
      self.rafQueue();
    }

    if (err) {
      throw err;
    }
  }

  loadComponentModule(tag: string, mode: string, cb: LoadComponentCallback): void {
    const cmpMeta = this.registry[tag];
    const cmpMode = cmpMeta.modes[mode];

    if (cmpMode && cmpMode.loaded) {
      cb(cmpMeta, cmpMode);

    } else {
      const cmpId = getComponentId(tag, mode, cmpMode.id);

      const loadedCallbacks = this.loadCBs;

      if (!loadedCallbacks[cmpId]) {
        loadedCallbacks[cmpId] = [cb];
      } else {
        loadedCallbacks[cmpId].push(cb);
      }

      const url = `${this.staticDir}${cmpId}.js`;

      jsonp(url, this.jsonReqs, this.d);
    }
  }

  registerComponent(cmpMeta: ComponentMeta) {
    this.registry[cmpMeta.tag] = cmpMeta;
  }

  createElement(tagName: any): HTMLElement {
    return this.d.createElement(tagName);
  }

  createElementNS(namespaceURI: string, qualifiedName: string): Element {
    return this.d.createElementNS(namespaceURI, qualifiedName);
  }

  createTextNode(text: string): Text {
    return this.d.createTextNode(text);
  }

  createComment(text: string): Comment {
    return this.d.createComment(text);
  }

  insertBefore(parentNode: Node, newNode: Node, referenceNode: Node | null): void {
    parentNode.insertBefore(newNode, referenceNode);
  }

  removeChild(parentNode: Node, childNode: Node): void {
    parentNode.removeChild(childNode);
  }

  appendChild(parentNode: Node, childNode: Node): void {
    parentNode.appendChild(childNode);
  }

  parentNode(node: Node): Node | null {
    return node.parentNode;
  }

  nextSibling(node: Node): Node | null {
    return node.nextSibling;
  }

  tag(elm: Element): string {
    return (elm.tagName || '').toLowerCase();
  }

  setTextContent(node: Node, text: string | null): void {
    node.textContent = text;
  }

  getTextContent(node: Node): string | null {
    return node.textContent;
  }

  getAttribute(elm: HTMLElement, attrName: string): string {
    return elm.getAttribute(attrName);
  }

  getProperty(node: Node, propName: string): any {
    return (<any>node)[propName];
  }

  setProperty(node: Node, propName: string, propValue: any): any {
    (<any>node)[propName] = propValue;
  }

  setStyle(elm: HTMLElement, styleName: string, styleValue: any) {
    (<any>elm.style)[toCamelCase(styleName)] = styleValue;
  }

  isElement(node: Node): node is Element {
    return node.nodeType === 1;
  }

  isText(node: Node): node is Text {
    return node.nodeType === 3;
  }

  isComment(node: Node): node is Comment {
    return node.nodeType === 8;
  }

  hasCss(moduleId: string): boolean {
    if (this.css[moduleId]) {
      return true;
    }

    if (this.d.head.querySelector(`style[data-module-id="${moduleId}"]`)) {
      this.setCss(moduleId);
      return true;
    }

    return false;
  }

  setCss(linkUrl: string) {
    this.css[linkUrl] = true;
  }

  getDocumentHead(): HTMLHeadElement {
    return this.d.head;
  }

}


export interface LoadCallbacks {
  [moduleId: string]: LoadComponentCallback[];
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
