import { PlatformApi } from './platform-api';
import { isDef, toCamelCase } from '../utils/helpers';
import { ComponentRegistry, ComponentMeta, ComponentModule } from '../utils/interfaces';
import { getStaticComponentDir } from '../utils/helpers';


export class PlatformClient implements PlatformApi {
  private registry: ComponentRegistry = {};
  private modules: {[tag: string]: ComponentModule} = {};
  private loadCallbacks: LoadedCallbacks = {};
  private activeRequests: string[] = [];
  private hasLink: {[tag: string]: boolean} = {};

  injectScopedCss: boolean;
  staticDir: string;


  constructor(private win: Window, private d: HTMLDocument) {
    const self = this;
    self.win;

    self.staticDir = getStaticComponentDir(d);

    (<any>win).ionicComponent = function(tag: string, moduleFn: {(): ComponentModule}) {
      console.debug('ionicComponent', tag);

      const cmpMeta = self.getComponentMeta(tag);
      const cmpModule = moduleFn();

      self.modules[tag] = cmpModule;

      const callbacks = self.loadCallbacks[tag];
      if (callbacks) {
        callbacks.forEach(cb => {
          cb(cmpMeta, cmpModule);
        })
        delete self.loadCallbacks[tag];
      }
    };

  }

  registerComponents(componentsToRegister: ComponentRegistry) {
    Object.assign(this.registry, componentsToRegister);
  }

  getComponentMeta(tag: string): ComponentMeta {
    return this.registry[tag];
  }

  loadComponentModule(tag: string, cb: {(cmpMeta: ComponentMeta, cmpModule: any): void}): void {
    const self = this;
    const cmpMeta = self.getComponentMeta(tag);
    const loadedCallbacks = self.loadCallbacks;

    if (self.injectScopedCss) {

    }

    const cmpModule = self.modules[tag];
    if (cmpModule) {
      cb(cmpMeta, cmpModule);

    } else if (cmpMeta.moduleUrl) {
      if (!loadedCallbacks[tag]) {
        loadedCallbacks[tag] = [cb];
      } else {
        loadedCallbacks[tag].push(cb);
      }

      self.jsonp(cmpMeta.moduleUrl);

    } else {
      cb(cmpMeta, CommonComponent);
    }
  }

  private jsonp(jsonpUrl: string) {
    var scriptTag: HTMLScriptElement;
    var tmrId: any;
    const self = this;

    // jsonpUrl = scriptsDir + jsonpUrl;

    if (self.activeRequests.indexOf(jsonpUrl) > -1) {
      return;
    }
    self.activeRequests.push(jsonpUrl);

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

      var index = self.activeRequests.indexOf(jsonpUrl);
      if (index > -1) {
        self.activeRequests.splice(index, 1);
      }
    }

    scriptTag.onerror = scriptTag.onload = onScriptComplete;

    self.d.head.appendChild(scriptTag);
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

  removeChild(node: Node, child: Node): void {
    node.removeChild(child);
  }

  appendChild(node: Node, child: Node): void {
    node.appendChild(child);
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

  getPropOrAttr(elm: HTMLElement, name: string): any {
    const val = (<any>elm)[toCamelCase(name)];
    return isDef(val) ? val : elm.getAttribute(name);
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
    const obs = new MutationObserver(() => {
      cb && cb();
    });

    const textNode = this.createTextNode('');
    obs.observe(textNode, { characterData: true });
    textNode.data = '1';
  }

  hasLinkCss(linkUrl: string): boolean {
    if (this.hasLink[linkUrl]) {
      return true;
    }

    if (this.d.head.querySelector(`link[href="${linkUrl}"]`)) {
      this.hasLink[linkUrl] = true;
      return true;
    }

    return false;
  }

  getDocumentHead(): HTMLHeadElement {
    return this.d.head;
  }

}


export interface FetchComponentCallback {
  (cmpMeta: ComponentMeta, cmpModule: ComponentModule): void;
}


export interface LoadedCallbacks {
  [key: string]: FetchComponentCallback[];
}


export class CommonComponent {}
