import { Component, ComponentMeta, ComponentModeData, ComponentMode, ComponentRegistry, DomControllerApi, Ionic, IonicGlobal, NextTickApi, PlatformApi } from '../util/interfaces';
import { h } from './renderer/h';
import { themeVNodeData } from './host';
import { toDashCase } from '../util/helpers';


export function PlatformClient(win: any, doc: HTMLDocument, ionic: IonicGlobal, staticDir: string, domCtrl: DomControllerApi, nextTickCtrl: NextTickApi): PlatformApi {
  const registry: ComponentRegistry = {};
  const bundleCBs: BundleCallbacks = {};
  const jsonReqs: string[] = [];
  const css: {[tag: string]: boolean} = {};
  const hasNativeShadowDom = !(win.ShadyDOM && win.ShadyDOM.inUse);


  const injectedIonic: Ionic = {
    theme: themeVNodeData,
    emit: function emitEvent(instance: any, eventName: string, data?: any) {
      const ev = doc.createEvent('CustomEvent');
      ev.initCustomEvent(eventName, true, true, data);
      (<Component>instance).$el.dispatchEvent(ev);
    }
  };


  ionic.loadComponents = function loadComponents(bundleId) {
    var args = arguments;
    for (var i = 1; i < args.length; i++) {
      var cmpModeData: ComponentModeData = args[i];
      var tag = cmpModeData[0];
      var mode = cmpModeData[1];

      var cmpMeta = registry[tag];
      var cmpMode = cmpMeta.modes[mode];

      cmpMode.styles = cmpModeData[2];

      var importModuleFn = cmpModeData[3];

      var moduleImports = {};
      importModuleFn(moduleImports, h, injectedIonic);
      cmpMeta.componentModule = moduleImports[Object.keys(moduleImports)[0]];

      cmpMeta.watches = cmpModeData[4];

      cmpMode.isLoaded = true;

      var callbacks = bundleCBs[bundleId];
      if (callbacks) {
        for (var j = 0, l = callbacks.length; j < l; j++) {
          callbacks[j]();
        }
        delete bundleCBs[bundleId];
      }
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

    } else if (!hasCss(cmpModeId)) {
      const headStyleEle = createElement('style');
      headStyleEle.dataset['cmpModeId'] = cmpModeId;
      headStyleEle.innerHTML = cmpMode.styles.replace(/\:host\-context\((.*?)\)|:host\((.*?)\)|\:host/g, '__h');
      appendChild(doc.head, headStyleEle);
      setCss(cmpModeId);
    }

    return shadowElm;
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
