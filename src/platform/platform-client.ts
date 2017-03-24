import { PlatformApi } from './platform-api';
import { getModuleId, toCamelCase } from '../utils/helpers';
import { ComponentRegistry, ComponentMeta, LoadComponentData, LoadComponentCallback } from '../utils/interfaces';
import { getStaticComponentDir } from '../utils/helpers';


export class PlatformClient implements PlatformApi {
  private registry: ComponentRegistry = {};
  private loadCallbacks: LoadCallbacks = {};
  private jsonReqs: string[] = [];
  private css: {[tag: string]: boolean} = {};
  private hasPromises: boolean;

  staticDir: string;


  constructor(window: any, private d: HTMLDocument) {
    const self = this;

    self.staticDir = getStaticComponentDir(d);

    self.hasPromises = (typeof Promise !== "undefined" && Promise.toString().indexOf("[native code]") !== -1);

    window.ionicComponent = function(data: LoadComponentData) {
      const tag = data.tag;
      const mode = data.mode;

      const cmpMeta = self.getComponentMeta(tag);
      cmpMeta.modes = cmpMeta.modes || {};
      const cmpMode = cmpMeta.modes[mode] = {
        styles: data.styles
      };
      cmpMeta.module = data.moduleFn();

      const moduleId = getModuleId(tag, mode);

      const callbacks = self.loadCallbacks[moduleId];
      if (callbacks) {
        for (var i = 0, l = callbacks.length; i < l; i++) {
          callbacks[i](cmpMeta, cmpMode);
        }
        delete self.loadCallbacks[moduleId];
      }
    };

  }

  loadComponentModule(tag: string, mode: string, cb: LoadComponentCallback): void {
    const cmpMeta = this.getComponentMeta(tag);

    if (cmpMeta.module && cmpMeta.modes[mode]) {
      cb(cmpMeta, cmpMeta.modes[mode]);

    } else {
      const moduleId = getModuleId(tag, mode);

      const loadedCallbacks = this.loadCallbacks;

      if (!loadedCallbacks[moduleId]) {
        loadedCallbacks[moduleId] = [cb];
      } else {
        loadedCallbacks[moduleId].push(cb);
      }

      const moduleUrl = `${moduleId}.js`;

      this.jsonp(moduleUrl);
    }
  }

  private jsonp(jsonpUrl: string) {
    var scriptTag: HTMLScriptElement;
    var tmrId: any;
    const self = this;

    jsonpUrl = self.staticDir + jsonpUrl;

    if (self.jsonReqs.indexOf(jsonpUrl) > -1) {
      return;
    }
    self.jsonReqs.push(jsonpUrl);

    scriptTag = <HTMLScriptElement>self.createElement('script');

    scriptTag.charset = 'utf-8';
    scriptTag.async = true;
    (<any>scriptTag).timeout = 120000;

    scriptTag.src = jsonpUrl;

    tmrId = setTimeout(onScriptComplete, 120000);

    function onScriptComplete() {
      clearTimeout(tmrId);
      scriptTag.onerror = scriptTag.onload = null;
      scriptTag.parentNode.removeChild(scriptTag);

      var index = self.jsonReqs.indexOf(jsonpUrl);
      if (index > -1) {
        self.jsonReqs.splice(index, 1);
      }
    }

    scriptTag.onerror = scriptTag.onload = onScriptComplete;

    self.d.head.appendChild(scriptTag);
  }

  registerComponent(cmpMeta: ComponentMeta) {
    this.registry[cmpMeta.tag] = cmpMeta;
  }

  getComponentMeta(tag: string): ComponentMeta {
    return this.registry[tag];
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

  setAttribute(elm: HTMLElement, attrName: string, attrValue: any): void {
    elm.setAttribute(attrName, attrValue);
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

  nextTick(cb: Function) {
    const timerId = setTimeout(cb);

    if (this.hasPromises) {
      Promise.resolve().then(() => {
        clearTimeout(timerId);
        cb && cb();
      });
    }
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
