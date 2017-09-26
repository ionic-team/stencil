import { addEventListener, enableEventListener } from '../core/instance/listeners';
import { assignHostContentSlots, createVNodesFromSsr } from '../core/renderer/slot';
import { ComponentMeta, ComponentRegistry, CoreContext,
  EventEmitterData, HostElement, AppGlobal, LoadComponentRegistry,
  ModuleCallbacks, PlatformApi } from '../util/interfaces';
import { createDomControllerClient } from './dom-controller-client';
import { createDomApi } from '../core/renderer/dom-api';
import { createRendererPatch } from '../core/renderer/patch';
import { createQueueClient } from './queue-client';
import { h, t } from '../core/renderer/h';
import { initHostConstructor } from '../core/instance/init';
import { parseComponentMeta, parseComponentRegistry } from '../util/data-parse';
import { proxyController } from '../core/instance/proxy';
import { SSR_VNODE_ID } from '../util/constants';


export function createPlatformClient(Context: CoreContext, App: AppGlobal, win: Window, doc: Document, publicPath: string): PlatformApi {
  const registry: ComponentRegistry = { 'HTML': {} };
  const moduleImports: {[tag: string]: any} = {};
  const moduleCallbacks: ModuleCallbacks = {};
  const loadedModules: {[moduleId: string]: boolean} = {};
  const loadedStyles: {[styleId: string]: boolean} = {};
  const pendingModuleRequests: {[url: string]: boolean} = {};
  const controllerComponents: {[tag: string]: HostElement} = {};

  const domApi = createDomApi(doc);
  const now = function() {
    return win.performance.now();
  };

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


  // create the platform api which is used throughout common core code
  const plt: PlatformApi = {
    registerComponents,
    defineComponent,
    getComponentMeta,
    propConnect,
    getContextItem,
    loadBundle,
    queue: createQueueClient(Context.dom, now),
    connectHostElement,
    emitEvent: Context.emit,
    getEventOptions,
    onError,
    isClient: true
  };

  // create the renderer that will be used
  plt.render = createRendererPatch(plt, domApi);


  // setup the root element which is the mighty <html> tag
  // the <html> has the final say of when the app has loaded
  const rootElm = <HostElement>domApi.$documentElement;
  rootElm._hasRendered = true;
  rootElm._activelyLoadingChildren = [];
  rootElm._initLoad = function appLoadedCallback() {
    // this will fire when all components have finished loaded
    rootElm._hasLoaded = true;
  };


  // if the HTML was generated from SSR
  // then let's walk the tree and generate vnodes out of the data
  createVNodesFromSsr(domApi, rootElm);


  function getComponentMeta(elm: Element) {
    // get component meta using the element
    // important that the registry has upper case tag names
    return registry[elm.tagName];
  }

  function connectHostElement(elm: HostElement, slotMeta: number) {
    // set the "mode" property
    if (!elm.mode) {
      // looks like mode wasn't set as a property directly yet
      // first check if there's an attribute
      // next check the app's global
      elm.mode = domApi.$getAttribute(elm, 'mode') || Context.mode;
    }

    // host element has been connected to the DOM
    if (!domApi.$getAttribute(elm, SSR_VNODE_ID)) {
      // this host element was NOT created with SSR
      // let's pick out the inner content for slot projection
      assignHostContentSlots(domApi, elm, slotMeta);
    }
  }


  function registerComponents(components: LoadComponentRegistry[]) {
    // this is the part that just registers the minimal amount of data
    // it's basically a map of the component tag name to its associated external bundles
    return (components || []).map(data => parseComponentRegistry(data, registry));
  }


  function defineComponent(cmpMeta: ComponentMeta, HostElementConstructor: any) {
    // initialize the properties on the component module prototype
    initHostConstructor(plt, HostElementConstructor.prototype);

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

    HostElementConstructor.observedAttributes = observedAttributes;

    // define the custom element
    win.customElements.define(cmpMeta.tagNameMeta.toLowerCase(), HostElementConstructor);
  }


  App.loadComponents = function loadComponents(moduleId, importFn) {
    const args = arguments;

    // import component function
    // inject globals
    importFn(moduleImports, h, t, Context, publicPath);

    for (var i = 2; i < args.length; i++) {
      // parse the external component data into internal component meta data
      // then add our set of prototype methods to the component module
      parseComponentMeta(registry, moduleImports, args[i]);
    }

    // fire off all the callbacks waiting on this module to load
    var callbacks = moduleCallbacks[moduleId];
    if (callbacks) {
      for (i = 0; i < callbacks.length; i++) {
        callbacks[i]();
      }
      delete moduleCallbacks[moduleId];
    }

    // remember that we've already loaded this module
    loadedModules[moduleId] = true;
  };


  function loadBundle(cmpMeta: ComponentMeta, elm: HostElement, cb: Function): void {
    const moduleId = cmpMeta.moduleId;

    if (loadedModules[moduleId]) {
      // sweet, we've already loaded this module
      cb();

    } else {
      // never seen this module before, let's start the request
      // and add it to the callbacks to fire when it has loaded
      if (moduleCallbacks[moduleId]) {
        moduleCallbacks[moduleId].push(cb);
      } else {
        moduleCallbacks[moduleId] = [cb];
      }

      // start the request for the component module
      requestModule(moduleId);

      // we also need to load the css file in the head
      // we've already figured out and set "mode" as a property to the element
      const styleId = cmpMeta.styleIds[elm.mode] || cmpMeta.styleIds.$;
      if (styleId && !loadedStyles[styleId]) {
        // this style hasn't been added to the head yet
        loadedStyles[styleId] = true;

        // append this link element to the head, which starts the request for the file
        const linkElm = domApi.$createElement('link');
        linkElm.href = publicPath + styleId + '.css';
        linkElm.rel = 'stylesheet';

        // insert these styles after the last styles we've already inserted
        // which could include the SSR styles, or the loader's hydrate css script's styles
        const insertedStyles = domApi.$head.querySelectorAll('[data-styles]');
        let insertBeforeRef = insertedStyles[insertedStyles.length - 1] || domApi.$head.firstChild;
        if (insertBeforeRef) {
          insertBeforeRef = insertBeforeRef.nextSibling;
        }
        domApi.$insertBefore(domApi.$head, linkElm, insertBeforeRef);
      }
    }
  }


  function requestModule(moduleId: string) {
    // create the url we'll be requesting
    const url = publicPath + moduleId + '.js';

    if (pendingModuleRequests[url]) {
      // we're already actively requesting this url
      // no need to do another request
      return;
    }

    // let's kick off the module request
    // remember that we're now actively requesting this url
    pendingModuleRequests[url] = true;

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
      delete pendingModuleRequests[url];
    }

    // add script completed listener to this script element
    scriptElm.onerror = scriptElm.onload = onScriptComplete;

    // inject a script tag in the head
    // kick off the actual request
    domApi.$appendChild(domApi.$head, scriptElm);
  }

  let WindowCustomEvent = (win as any).CustomEvent;
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
  let supportsEventOptions = false;
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

  function onError(type: number, err: any, elm: HostElement) {
    console.error(type, err, elm.tagName);
  }

  function propConnect(ctrlTag: string) {
    return proxyController(domApi, controllerComponents, ctrlTag);
  }

  function getContextItem(contextKey: string) {
    return Context[contextKey];
  }

  return plt;
}
