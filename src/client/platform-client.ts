import { addEventListener, enableEventListener } from '../core/instance/listeners';
import { assignHostContentSlots, createVNodesFromSsr } from '../core/renderer/slot';
import { AppGlobal, BundleCallbacks, ComponentMeta, ComponentRegistry, CoreContext,
  EventEmitterData, HostElement, LoadComponentRegistry, PlatformApi } from '../util/interfaces';
import { createDomControllerClient } from './dom-controller-client';
import { createDomApi } from '../core/renderer/dom-api';
import { createRendererPatch } from '../core/renderer/patch';
import { createQueueClient } from './queue-client';
import { ENCAPSULATION, RUNTIME_ERROR, SSR_VNODE_ID } from '../util/constants';
import { h, t } from '../core/renderer/h';
import { initHostConstructor } from '../core/instance/init-host';
import { parseComponentMeta, parseComponentLoaders } from '../util/data-parse';
import { proxyController } from '../core/instance/proxy';
import { useScopedCss, useShadowDom } from '../core/renderer/encapsulation';


export function createPlatformClient(Context: CoreContext, App: AppGlobal, win: Window, doc: Document, publicPath: string, hydratedCssClass: string): PlatformApi {
  const registry: ComponentRegistry = { 'html': {} };
  const moduleImports: {[tag: string]: any} = {};
  const bundleCallbacks: BundleCallbacks = {};
  const loadedBundles: {[bundleId: string]: boolean} = {};
  const styleTemplates: StyleTemplates = {};
  const pendingBundleRequests: {[url: string]: boolean} = {};
  const controllerComponents: {[tag: string]: HostElement} = {};
  const domApi = createDomApi(doc);
  const now = () => win.performance.now();

  // initialize Core global object
  Context.dom = createDomControllerClient(win, now);

  Context.addListener = function addListener(elm, eventName, cb, opts) {
    return addEventListener(plt, elm, eventName, cb, opts && opts.capture, opts && opts.passive);
  };

  Context.enableListener = function enableListener(instance, eventName, enabled, attachTo) {
    enableEventListener(plt, instance, eventName, enabled, attachTo);
  };

  Context.emit = function emitEvent(elm: Element, eventName: string, data: EventEmitterData) {
    elm && elm.dispatchEvent(new WindowCustomEvent(
      Context.eventNameFn ? Context.eventNameFn(eventName) : eventName,
      data
    ));
  };

  Context.isClient = true;
  Context.isServer = Context.isPrerender = false;
  Context.window = win;
  Context.location = win.location;
  Context.document = doc;

  // keep a global set of tags we've already defined
  const globalDefined: string[] = (win as any).definedComponents = (win as any).definedComponents || [];

  // create the platform api which is used throughout common core code
  const plt: PlatformApi = {
    registerComponents,
    defineComponent,
    isDefinedComponent,
    getComponentMeta,
    propConnect,
    getContextItem,
    loadBundle,
    queue: createQueueClient(Context.dom, now),
    connectHostElement,
    attachStyles,
    emitEvent: Context.emit,
    getEventOptions,
    onError,
    isClient: true
  };

  const supportsNativeShadowDom = !!(Element.prototype.attachShadow);

  // create the renderer that will be used
  plt.render = createRendererPatch(plt, domApi, supportsNativeShadowDom);

  // setup the root element which is the mighty <html> tag
  // the <html> has the final say of when the app has loaded
  const rootElm = domApi.$documentElement as HostElement;
  rootElm.$rendered = true;
  rootElm.$activeLoading = [];
  rootElm.$initLoad = () => {
    // this will fire when all components have finished loaded
    rootElm._hasLoaded = true;
  };


  // if the HTML was generated from SSR
  // then let's walk the tree and generate vnodes out of the data
  createVNodesFromSsr(domApi, rootElm);


  function getComponentMeta(elm: Element) {
    // get component meta using the element
    // important that the registry has upper case tag names
    return registry[elm.tagName.toLowerCase()];
  }

  function connectHostElement(cmpMeta: ComponentMeta, elm: HostElement) {
    // set the "mode" property
    if (!elm.mode) {
      // looks like mode wasn't set as a property directly yet
      // first check if there's an attribute
      // next check the app's global
      elm.mode = domApi.$getAttribute(elm, 'mode') || Context.mode;
    }

    // host element has been connected to the DOM
    if (!domApi.$getAttribute(elm, SSR_VNODE_ID) && !useShadowDom(supportsNativeShadowDom, cmpMeta)) {
      // only required when we're not using native shadow dom (slot)
      // this host element was NOT created with SSR
      // let's pick out the inner content for slot projection
      assignHostContentSlots(domApi, elm, cmpMeta.slotMeta);
    }

    if (!supportsNativeShadowDom && cmpMeta.encapsulation === ENCAPSULATION.ShadowDom) {
      // this component should use shadow dom
      // but this browser doesn't support it
      // so let's polyfill a few things for the user
      (elm as any).shadowRoot = elm;
    }
  }


  function registerComponents(components: LoadComponentRegistry[]) {
    // this is the part that just registers the minimal amount of data
    // it's basically a map of the component tag name to its associated external bundles
    return (components || []).map(data => parseComponentLoaders(data, registry));
  }


  function defineComponent(cmpMeta: ComponentMeta, HostElementConstructor: any) {
    const tagName = cmpMeta.tagNameMeta;

    if (globalDefined.indexOf(tagName) === -1) {
      // keep an array of all the defined components, useful for external frameworks
      globalDefined.push(tagName);

      // initialize the members on the host element prototype
      initHostConstructor(plt, cmpMeta, HostElementConstructor.prototype, hydratedCssClass);

      // add which attributes should be observed
      const observedAttributes: string[] = [];

      // at this point the membersMeta only includes attributes which should
      // be observed, it does not include all props yet, so it's safe to
      // loop through all of the props (attrs) and observed them
      for (var propName in cmpMeta.membersMeta) {
        // initialize the actual attribute name used vs. the prop name
        // for example, "myProp" would be "my-prop" as an attribute
        // and these can be configured to be all lower case or dash case (default)
        if (cmpMeta.membersMeta[propName].attribName) {
          observedAttributes.push(
            // dynamically generate the attribute name from the prop name
            // also add it to our array of attributes we need to observe
            cmpMeta.membersMeta[propName].attribName
          );
        }
      }

      // set the array of all the attributes to keep an eye on
      // https://www.youtube.com/watch?v=RBs21CFBALI
      HostElementConstructor.observedAttributes = observedAttributes;

      // define the custom element
      win.customElements.define(tagName, HostElementConstructor);
    }
  }


  function isDefinedComponent(elm: Element) {
    // check if this component is already defined or not
    return globalDefined.indexOf(elm.tagName.toLowerCase()) > -1 || !!getComponentMeta(elm);
  }


  App.loadComponents = function loadComponents(bundleId, importFn) {
    // https://youtu.be/Z-FPimCmbX8?t=31
    // jsonp tag team callback from requested bundles contain tags
    const args = arguments;

    // import component function
    // inject globals
    importFn(moduleImports, h, t, Context, publicPath);

    for (var i = 2; i < args.length; i++) {
      // parse the external component data into internal component meta data
      parseComponentMeta(registry, moduleImports, args[i]);
    }

    // fire off all the callbacks waiting on this bundle to load
    var callbacks = bundleCallbacks[bundleId];
    if (callbacks) {
      for (i = 0; i < callbacks.length; i++) {
        callbacks[i]();
      }
      delete bundleCallbacks[bundleId];
    }

    // remember that we've already loaded this bundle
    loadedBundles[bundleId] = true;
  };


  App.loadStyles = function loadStyles() {
    // jsonp callback from requested bundles
    // either directly add styles to document.head or add the
    // styles to a template tag to be cloned later for shadow roots
    const args = arguments;
    let templateElm: HTMLTemplateElement;

    for (var i = 0; i < args.length; i += 2) {
      // create the template element which will hold the styles
      // adding it to the dom via <template> so that we can
      // clone this for each potential shadow root that will need these styles
      // otherwise it'll be cloned and added to the entire document
      // but that's for the renderer to figure out later
      styleTemplates[args[i]] = templateElm = domApi.$createElement('template');

      // add the style text to the template element
      templateElm.innerHTML = `<style>${args[i + 1]}</style>`;

      // give it an unique id
      templateElm.id = `tmp-${args[i]}`;

      // add our new element to the head
      domApi.$appendChild(domApi.$head, templateElm);
    }
  };


  function loadBundle(cmpMeta: ComponentMeta, elm: HostElement, cb: Function): void {
    const bundleId: string = cmpMeta.bundleIds[elm.mode] || (cmpMeta.bundleIds as any);

    if (loadedBundles[bundleId]) {
      // sweet, we've already loaded this bundle
      cb();

    } else {
      // never seen this bundle before, let's start the request
      // and add it to the callbacks to fire when it has loaded
      (bundleCallbacks[bundleId] = bundleCallbacks[bundleId] || []).push(cb);

      // figure out which bundle to request and kick it off
      requestBundle(cmpMeta, bundleId);
    }
  }


  function requestBundle(cmpMeta: ComponentMeta, bundleId: string) {
    // create the url we'll be requesting
    const url = publicPath + bundleId + ((useScopedCss(supportsNativeShadowDom, cmpMeta) ? '.sc' : '') + '.js');

    if (pendingBundleRequests[url]) {
      // we're already actively requesting this url
      // no need to do another request
      return;
    }

    // let's kick off the bundle request
    // remember that we're now actively requesting this url
    pendingBundleRequests[url] = true;

    // create a sript element to add to the document.head
    var scriptElm = domApi.$createElement('script');
    scriptElm.charset = 'utf-8';
    scriptElm.async = true;
    scriptElm.src = url;

    // create a fallback timeout if something goes wrong
    var tmrId = setTimeout(onScriptComplete, 120000);

    function onScriptComplete() {
      clearTimeout(tmrId);
      scriptElm.onerror = scriptElm.onload = null;
      domApi.$removeChild(scriptElm.parentNode, scriptElm);

      // remove from our list of active requests
      delete pendingBundleRequests[url];
    }

    // add script completed listener to this script element
    scriptElm.onerror = scriptElm.onload = onScriptComplete;

    // inject a script tag in the head
    // kick off the actual request
    domApi.$appendChild(domApi.$head, scriptElm);
  }


  function attachStyles(cmpMeta: ComponentMeta, modeName: string, elm: HostElement) {
    const templateElm = styleTemplates[cmpMeta.tagNameMeta + '_' + modeName] || styleTemplates[cmpMeta.tagNameMeta];

    if (templateElm) {
      let styleContainerNode: HTMLElement = domApi.$head;

      if (supportsNativeShadowDom) {
        if (cmpMeta.encapsulation === ENCAPSULATION.ShadowDom) {
          styleContainerNode = (elm.shadowRoot as any);

        } else {
          while ((elm as Node) = domApi.$parentNode(elm)) {
            if ((elm as any).host && (elm as any).host.shadowRoot) {
              styleContainerNode = (elm as any).host.shadowRoot;
              break;
            }
          }
        }
      }

      const appliedStyles = ((styleContainerNode as HostElement)._appliedStyles = (styleContainerNode as HostElement)._appliedStyles || {});

      if (!appliedStyles[templateElm.id]) {
        // we haven't added these styles to this element yet
        const styleElm = templateElm.content.cloneNode(true) as HTMLStyleElement;

        const insertReferenceNode = styleContainerNode.querySelector('[data-visibility]');
        domApi.$insertBefore(styleContainerNode, styleElm, (insertReferenceNode && insertReferenceNode.nextSibling) || styleContainerNode.firstChild);

        // remember we don't need to do this again for this element
        appliedStyles[templateElm.id] = true;
      }
    }
  }


  var WindowCustomEvent = (win as any).CustomEvent;
  if (typeof WindowCustomEvent !== 'function') {
    // CustomEvent polyfill
    WindowCustomEvent = function CustomEvent(event: any, data: EventEmitterData) {
      var evt = domApi.$createEvent();
      evt.initCustomEvent(event, data.bubbles, data.cancelable, data.detail);
      return evt;
    };
    WindowCustomEvent.prototype = (win as any).Event.prototype;
  }

  // test if this browser supports event options or not
  var supportsEventOptions = false;
  try {
    win.addEventListener('eopt', null,
      Object.defineProperty({}, 'passive', {
        get: () => {
          supportsEventOptions = true;
        }
      })
    );
  } catch (e) {}

  function getEventOptions(useCapture: boolean, usePassive: boolean) {
    return supportsEventOptions ? {
        capture: !!useCapture,
        passive: !!usePassive
      } : !!useCapture;
  }

  function onError(err: Error, type: RUNTIME_ERROR, elm: HostElement) {
    console.error(err, type, elm && elm.tagName);
  }

  function propConnect(ctrlTag: string) {
    return proxyController(domApi, controllerComponents, ctrlTag);
  }

  function getContextItem(contextKey: string) {
    return Context[contextKey];
  }

  return plt;
}


export interface StyleTemplates {
  [tag: string]: HTMLTemplateElement;
}
