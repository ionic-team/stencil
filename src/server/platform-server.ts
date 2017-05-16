import { ComponentMeta, Component, ComponentModeData, ComponentRegistry, ConfigApi,
  DomControllerApi, IonicGlobal, LoadComponents, PlatformApi } from '../util/interfaces';
import { h } from '../client/renderer/h';
import { initInjectedIonic } from './ionic-server';
import { parseComponentModeData } from '../util/data-parse';
import { QueueServer } from './queue-server';


export function PlatformServer(IonicGbl: IonicGlobal, ConfigCtrl: ConfigApi, DomCtrl: DomControllerApi): PlatformApi {
  const registry: ComponentRegistry = {};
  const moduleImports = {};
  const queue = QueueServer();

  const injectedIonic = initInjectedIonic(ConfigCtrl, DomCtrl);


  IonicGbl.loadComponents = function loadComponents(coreVersion, bundleId, importFn) {
    var args = arguments;

    // import component function
    // inject ionic globals
    importFn(moduleImports, h, injectedIonic);

    for (var i = 3; i < args.length; i++) {
      // first arg is core version
      // second arg is the bundleId
      // third arg is the importFn
      // each arg after that is a component/mode
      var cmpModeData: ComponentModeData = args[i];

      parseComponentModeData(registry, moduleImports, args[i]);

      // tag name (ion-badge)
      var tag = cmpModeData[0];
      console.log(`load tag: ${tag}, bundleId: ${bundleId}, coreVersion: ${coreVersion}`);

      // registerComponents(tag, []);
    }
  };

  function loadComponent(bundleId: string, priority: string, cb: Function): void {
    console.log(`loadComponent, bundleId: ${bundleId}, priority: ${priority}`);

    cb();
  }

  function attachComponent(elm: Element, cmpMeta: ComponentMeta, instance: Component) {
    const shadowElm = elm.attachShadow({ mode: 'open' });

    cmpMeta;
    instance;

    return shadowElm;
  }

  function registerComponents(components: LoadComponents): ComponentMeta[] {
    components;

    return [];
  }

  function defineComponent(tag: string, constructor: Function) {
    console.log('defineComponent', tag, constructor);
  }

  function getComponentMeta(tag: string) {
    return registry[tag];
  }

  function createElement<K extends keyof HTMLElementTagNameMap>(tagName: K): HTMLElementTagNameMap[K] {
    return <any>{
      tagName: tagName
    };
  }

  function createElementNS(namespaceURI: string, qualifiedName: string): Element {
    return <any>{
      namespaceURI: namespaceURI,
      qualifiedName: qualifiedName,
    };
  }

  function createTextNode(text: string): Text {
    return <any>{
      text: text,
    };
  }

  function createComment(text: string): Comment {
    return <any>{
      text: text,
    };
  }

  function insertBefore(parentNode: any, newNode: Node, referenceNode: Node | null): void {
    if (!parentNode.childNodes) {
      parentNode.childNodes = [newNode];

    } else {
      const refNodeIndex = parentNode.childNodes.indexOf(referenceNode);
      if (refNodeIndex > 0) {
        parentNode.childNodes.splice(refNodeIndex - 1, 0, newNode);
      } else {
        parentNode.childNodes.unshift(referenceNode);
      }
    }
  }

  function removeChild(parentNode: any, childNode: Node): void {
    if (parentNode.childNodes) {
      const refNodeIndex = parentNode.childNodes.indexOf(childNode);
      if (refNodeIndex > -1) {
        parentNode.childNodes.splice(refNodeIndex, 1);
      }
    }
  }

  function appendChild(parentNode: any, childNode: Node): void {
    if (!parentNode.childNodes) {
      parentNode.childNodes = [childNode];

    } else {
      parentNode.childNodes.push(childNode);
    }
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
    return !!(<any>node).tagName;
  }

  function isText(node: Node): node is Text {
    return node.nodeName === '#text';
  }

  function isComment(node: Node): node is Comment {
    return node.nodeName === '#comment';
  }


  return {
    registerComponents: registerComponents,
    defineComponent: defineComponent,
    getComponentMeta: getComponentMeta,
    loadBundle: loadComponent,

    isElement: isElement,
    isText: isText,
    isComment: isComment,
    queue: queue,

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
    $attachComponent: attachComponent,

    $tmpDisconnected: false
  };
}


export interface BundleCallbacks {
  [bundleId: string]: Function[];
}
