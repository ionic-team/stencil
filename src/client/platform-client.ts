import { BundleCallbacks, Component, ComponentMeta, ComponentRegistry,
  IonicGlobal, LoadComponentData, QueueApi, PlatformApi } from '../util/interfaces';
import { h } from '../renderer/h';
import { initInjectedIonic } from './ionic-client';
import { PRIORITY_LOW, XLINK_NS, XML_NS } from '../util/constants';
import { parseComponentModeData, parseModeName, parseProp } from '../util/data-parse';


export function PlatformClient(win: Window, doc: HTMLDocument, IonicGbl: IonicGlobal, queue: QueueApi): PlatformApi {
  const registry: ComponentRegistry = {};
  const loadedBundles: {[bundleId: string]: boolean} = {};
  const bundleCallbacks: BundleCallbacks = {};
  const activeJsonRequests: {[url: string]: boolean} = {};
  const moduleImports = {};
  const hasNativeShadowDom = !((<any>win).ShadyDOM && (<any>win).ShadyDOM.inUse);


  const injectedIonic = initInjectedIonic(IonicGbl, win, doc, queue);


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

      // create the url we'll be requesting
      const url = `${IonicGbl.staticDir}bundles/ionic.${bundleId}.js`;

      if (!activeJsonRequests[url]) {
        // not already actively requesting this url
        // let's kick off the request

        // remember that we're now actively requesting this url
        activeJsonRequests[url] = true;

        if (priority === PRIORITY_LOW) {
          // low priority which means its ok to load this behind
          // UI components, for example: gestures, menu
          // kick off the request in a requestIdleCallback
          (<any>win).requestIdleCallback(() => {
            jsonp(url);
          }, { timeout: 2000 });

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
    const cmpMode = cmpMeta.modes[instance.mode] || cmpMeta.modes['default'];

    if (cmpMode && cmpMode.styles) {
      // cool, we found the mode for this component
      // and this mode has styles :)

      if (cmpMeta.shadow && hasNativeShadowDom) {
        // this component uses the shadow dom
        // and this browser supports the shadow dom natively
        // attach our styles to the root
        const styleElm = createElement('style');
        styleElm.innerHTML = cmpMode.styles;
        instance.$root.appendChild(styleElm);

      } else {
        // this component does not use the shadow dom
        // or this browser does not support shadow dom
        const cmpModeId = `${cmpMeta.tag}.${instance.mode}`;

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
                styleElm.innerHTML = cmpMode.styles + styleElm.innerHTML;

              } else {
                styleElm = createElement('style');
                styleElm.innerHTML = cmpMode.styles;
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
          styleEle.innerHTML = cmpMode.styles;

          // prepend the styles to the head, above of existing styles
          insertBefore(hostRoot, styleEle, hostRoot.firstChild);
        }
      }
    }
  }


  function registerComponents(components: LoadComponentData[]) {
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
    win.customElements.define(tag, constructor);
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
    registerComponents: registerComponents,
    defineComponent: defineComponent,
    getComponentMeta: getComponentMeta,
    loadBundle: loadBundle,

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
    $setAttribute: setAttribute,
    $removeAttribute: removeAttribute,
    $setClass: setClass,
    $attachComponent: attachComponent,

    $tmpDisconnected: false
  };
}
