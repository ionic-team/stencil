import { adapter } from './dom/adapter';
import { attributeChangedCallback } from '../renderer/attribute-changed';
import { BundleCallbacks, Component, ComponentModeData, ComponentMeta, ComponentRegistry,
  IonicGlobal, LoadComponentData, PlatformApi } from '../util/interfaces';
import { generateGlobalContext } from './dom/global-context';
import { h } from '../renderer/h';
import { initInjectedIonic } from './ionic-server';
import { parseComponentModeData, parseModeName, parseProp } from '../util/data-parse';
import { Window } from './dom/window';
import { XLINK_NS, XML_NS } from '../util/constants';
import * as fs from 'fs';
import * as path from 'path';
import * as vm from 'vm';


export function PlatformServer(registry: ComponentRegistry, win: Window, IonicGbl: IonicGlobal): PlatformApi {
  const loadedBundles: {[bundleId: string]: boolean} = {};
  const bundleCallbacks: BundleCallbacks = {};
  const activeFileReads: {[url: string]: boolean} = {};
  const moduleImports = {};
  const css: {[cmpModeId: string]: string} = {};
  const injectedIonic = initInjectedIonic(IonicGbl.ConfigCtrl, IonicGbl.DomCtrl);

  const context = generateGlobalContext(win, IonicGbl);

  vm.createContext(context);

  IonicGbl.defineComponents = function defineComponents(coreVersion, bundleId, importFn) {
    coreVersion;
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

      parseComponentModeData(registry, moduleImports, cmpModeData);

      if (cmpModeData[1]) {
        registry[cmpModeData[0]].props = registry[cmpModeData[0]].props.concat(cmpModeData[1].map(parseProp));
      }

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


  function loadBundle(bundleId: string, priority: number, cb: Function): void {
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

      // create the filePath we'll be reading
      const filePath = path.join(IonicGbl.staticDir, `bundles`, `ionic.${bundleId}.js`);

      if (!activeFileReads[filePath]) {
        // not already actively requesting this url
        // let's kick off the request

        // remember that we're now actively requesting this url
        activeFileReads[filePath] = true;

        // priority doesn't matter on the server
        priority;

        fs.readFile(filePath, 'utf-8', (err, code) => {
          if (err) {
            console.error(`loadBundle: ${bundleId}, ${err}`);
            err.stack && console.error(err.stack);

          } else {
            // run the code in this sandboxed context
            vm.runInContext(code, context);
          }

          delete activeFileReads[filePath];
        });

      }
    }
  }

  function attachComponent(elm: any, cmpMeta: ComponentMeta, instance: Component) {
    elm.classList.add('ssr');

    cmpMeta.props.forEach(prop => {
      attributeChangedCallback(elm, cmpMeta, prop.attrName, null, getAttribute(elm, prop.attrName));
    });

    if (cmpMeta.shadow) {
      // cannot use shadow dom server side :(
      return;
    }

    // look up which component mode this instance should use
    // if a mode isn't found then check if there's a default
    const cmpMode = cmpMeta.modes[instance.mode] || cmpMeta.modes['default'];

    if (cmpMode && cmpMode.styles) {
      // this component mode has styles
      const cmpModeId = `${cmpMeta.tag}.${instance.mode}`;

      // this component is not within a parent shadow root
      // so attach the styles to document.head
      if (!css[cmpModeId]) {
        // only attach the styles if we haven't already done so for this host element
        css[cmpModeId] = cmpMode.styles;
      }
    }
  }

  function registerComponents(components: LoadComponentData[]): ComponentMeta[] {
    // this is the part that just registers the minimal amount about each
    // component, basically its tag, modes and observed attributes

    return components.map(data => {

      const cmpMeta: ComponentMeta = registry[data[0]] = {
        tag: data[0],
        modes: {},
        props: [
          // every component defaults to always have
          // the mode and color properties
          // but only watch the color attribute
          { propName: 'color', attrName: 'color' },
          { propName: 'mode' },
        ]
      };

      // copy over the map of the modes and bundle ids
      // parse the mode codes to names: "1" becomes "ios"
      Object.keys(data[1]).forEach(modeCode => {
        cmpMeta.modes[parseModeName(modeCode)] = {
          bundleId: data[1][modeCode]
        };
      });

      if (data[2]) {
        cmpMeta.props = cmpMeta.props.concat(data[2].map(parseProp));
      }

      // priority
      cmpMeta.priority = data[3];

      return cmpMeta;
    });
  }

  function defineComponent(tag: string, constructor: Function) {
    console.log('defineComponent', tag, constructor);
  }

  function getComponentMeta(tag: string) {
    return registry[tag];
  }

  function createElement<K extends keyof HTMLElementTagNameMap>(tagName: K): HTMLElementTagNameMap[K] {
    return context.document.createElement(tagName);
  }

  function createElementNS(namespaceURI: string, qualifiedName: string): Element {
    return context.document.createElementNS(namespaceURI, qualifiedName);
  }

  function createTextNode(text: string): Text {
    return context.document.createTextNode(text);
  }

  function createComment(text: string): Comment {
    return context.document.createComment(text);
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

  function setAttribute(elm: HTMLElement, attrName: string, attrValue: any) {
    if (attrName.charCodeAt(0) === 120) {
      const namespaceURI = attrName.charCodeAt(3) === 58 ? XML_NS : (attrName.charCodeAt(5) === 58 ? XLINK_NS : 0);
      if (namespaceURI) {
        elm.setAttributeNS(namespaceURI, attrName, attrValue);
        return;
      }
    }

    elm.setAttribute(attrName, attrValue);
  }

  function removeAttribute(elm: HTMLElement, attrName: string) {
    elm.removeAttribute(attrName);
  }

  function setClass(elm: HTMLElement, cssClassName: string, shouldAddCssClassName: boolean) {
    elm.classList[shouldAddCssClassName ? 'add' : 'remove'](cssClassName);
  }

  function isElement(node: any): node is Element {
    return !!node.attribs || !!node.children;
  }

  function isText(node: Node): node is Text {
    return adapter.isTextNode(node);
  }

  function isComment(node: Node): node is Comment {
    return adapter.isCommentNode(node);
  }


  return {
    registerComponents: registerComponents,
    defineComponent: defineComponent,
    getComponentMeta: getComponentMeta,
    loadBundle: loadBundle,

    isElement: isElement,
    isText: isText,
    isComment: isComment,
    queue: IonicGbl.QueueCtrl,

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
    $setAttribute: setAttribute,
    $removeAttribute: removeAttribute,
    $setClass: setClass,
    $attachComponent: attachComponent,

    $tmpDisconnected: false,
    css: css,
    isServer: true
  };
}
