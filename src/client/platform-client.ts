import { Component, ComponentMeta, ComponentRegistry,
  IonicGlobal, NextTickApi, PlatformApi } from '../util/interfaces';
import { h } from './renderer/h';
import { initInjectedIonic } from './ionic-client';
import { parseComponentModeData, parseModeName, parseProp } from '../util/data-parse';
import { toDashCase } from '../util/helpers';


export function PlatformClient(win: Window, doc: HTMLDocument, IonicGbl: IonicGlobal, NextTickCtrl: NextTickApi): PlatformApi {
  const registry: ComponentRegistry = {};
  const loadedBundles: {[bundleId: string]: boolean} = {};
  const bundleCallbacks: BundleCallbacks = {};
  const activeJsonRequests: {[url: string]: boolean} = {};
  const moduleImports = {};
  const hasNativeShadowDom = !((<any>win).ShadyDOM && (<any>win).ShadyDOM.inUse);


  const injectedIonic = initInjectedIonic(IonicGbl, win, doc);


  IonicGbl.loadComponents = function loadComponents(coreVersion, bundleId, importFn) {
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
      parseComponentModeData(registry, moduleImports, args[i]);

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


  function loadComponent(bundleId: string, priority: string, cb: Function): void {
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
      const url = `${IonicGbl.staticDir}bundles/ionic.${bundleId}.js`;

      if (!activeJsonRequests[url]) {
        // not already actively requesting this url
        // let's kick off the request

        // remember that we're now actively requesting this url
        activeJsonRequests[url] = true;

        if (priority === 'low') {
          // low priority which means its ok to load this behind
          // UI components, for example: gestures, menu
          if ('requestIdleCallback' in win) {
            // kick off the request in a requestIdleCallback
            (<any>win).requestIdleCallback(() => {
              jsonp(url);
            }, { timeout: 2000 });

          } else {
            // no support for requestIdleCallback, so instead throw it
            // in a setTimeout just so all the UI components kick in first
            setTimeout(() => {
              jsonp(url);
            }, 600);
          }

        } else {
          // high priority component (normal UI components)
          jsonp(url);
        }
      }
    }
  }


  function jsonp(url: string) {
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


  function attachComponent(elm: Element, cmpMeta: ComponentMeta, instance: Component) {
    if (cmpMeta.shadow) {
      // cool, this component should use shadow dom
      instance.$root = elm.attachShadow({ mode: 'open' });
    }

    // look up which component mode this instance should use
    // if a mode isn't found then check if there's a default
    const cmpMode = cmpMeta.modes[instance.mode] || cmpMeta.modes.default;

    if (cmpMode && cmpMode.styles) {
      // this component mode has styles
      let cmpStyles = cmpMode.styles;

      if (cmpMeta.shadow && hasNativeShadowDom) {
        // this component uses the shadow dom
        // and this browser supports the shadow dom natively
        if (!cmpMode.styleElm) {
          // we're doing this so the browser only needs to parse
          // the HTML once, and can clone it every time after that
          cmpMode.styleElm = createElement('style');
          cmpMode.styleElm.innerHTML = cmpStyles;
        }

        // attach our styles to the root
        instance.$root.appendChild(cmpMode.styleElm.cloneNode(true));

      } else {
        // this component does not use the shadow dom
        // or this browser does not support shadow dom
        const cmpModeId = `${cmpMeta.tag}.${instance.mode}`;

        // remove any :host and :host-context stuff which is
        // invalid css for browsers that don't support shadow dom
        cmpStyles = cmpStyles.replace(/\:host\-context\((.*?)\)|:host\((.*?)\)|\:host/g, '__h');

        // climb up the ancestors looking to see if this element
        // is within another component with a shadow root
        let node: any = elm;
        let hostRoot: any = doc.head;
        let styleElm: HTMLStyleElement;

        while (node = node.parentNode) {
          if (node.host && node.host.shadowRoot) {
            // this element is within another shadow root
            // so instead of attaching the styles to the head
            // we need to attach the styles to this shadow root
            hostRoot = node.host.shadowRoot;
            hostRoot.$css = hostRoot.$css || {};

            if (!hostRoot.$css[cmpModeId]) {
              // only attach the styles if we haven't already done so for this host element
              hostRoot.$css[cmpModeId] = true;

              styleElm = hostRoot.querySelector('style');
              if (styleElm) {
                styleElm.innerHTML = cmpStyles + styleElm.innerHTML;

              } else {
                styleElm = createElement('style');
                styleElm.innerHTML = cmpStyles;
                insertBefore(hostRoot, styleElm, hostRoot.firstChild);
              }
            }

            // the styles are added to this shadow root, no need to continue
            return;
          }
        }

        // this component is not within a parent shadow root
        // so attach the styles to document.head
        hostRoot.$css = hostRoot.$css || {};
        if (!hostRoot.$css[cmpModeId]) {
          // only attach the styles if we haven't already done so for this host element
          hostRoot.$css[cmpModeId] = true;

          // add these styles to document.head
          let styleEle = createElement('style');
          styleEle.dataset['cmp'] = cmpModeId;

          // we're replacing the :host and :host-context stuff because
          // it's invalid css for browsers that don't support shadow dom
          styleEle.innerHTML = cmpStyles;

          appendChild(hostRoot, styleEle);
        }
      }
    }
  }


  function registerComponent(tag: string, data: any[]) {
    // data[0] = all of the mode and bundle maps
    // data[1] = properties
    // data[2] = bundle priority
    const modeBundleIds = data[0];

    const cmpMeta: ComponentMeta = registry[tag] = {
      tag: tag,
      modes: {},
      props: parseProp(data[1]),
      obsAttrs: []
    };

    if (data[2] === 0) {
      // priority
      cmpMeta.priority = 'low';
    }

    let keys = Object.keys(modeBundleIds);
    for (var i = 0; i < keys.length; i++) {
      cmpMeta.modes[parseModeName(keys[i].toString())] = {
        bundleId: modeBundleIds[keys[i]]
      };
    }

    keys = Object.keys(cmpMeta.props);
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

  return {
    registerComponent: registerComponent,
    getComponentMeta: getComponentMeta,
    loadComponent: loadComponent,

    isElement: isElement,
    isText: isText,
    isComment: isComment,
    nextTick: NextTickCtrl.nextTick.bind(NextTickCtrl),

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
    $attachComponent: attachComponent
  };
}


export interface BundleCallbacks {
  [bundleId: string]: Function[];
}
