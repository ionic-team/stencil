import { addListener, enableEventListener } from '../core/instance/listeners';
import { assignHostContentSlots } from '../core/renderer/slot';
import { AppGlobal, BundleCallbacks, ComponentMeta, ComponentRegistry, CoreContext,
  EventEmitterData, HostElement, LoadComponentRegistry, PlatformApi } from '../util/interfaces';
import { Build } from '../util/build-conditionals';
import { createDomControllerClient } from './dom-controller-client';
import { createDomApi } from '../core/renderer/dom-api';
import { createRendererPatch } from '../core/renderer/patch';
import { createVNodesFromSsr } from '../core/renderer/ssr';
import { createQueueClient } from './queue-client';
import { ENCAPSULATION, SSR_VNODE_ID } from '../util/constants';
import { h } from '../core/renderer/h';
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
  const domApi = createDomApi(win, doc);
  const now = () => win.performance.now();

  // initialize Core global object
  Context.dom = createDomControllerClient(win, now);

  if (Build.listener) {
    Context.addListener = (elm, eventName, cb, opts) => addListener(plt, elm, eventName, cb, opts && opts.capture, opts && opts.passive);
    Context.enableListener = (instance, eventName, enabled, attachTo) => enableEventListener(plt, instance, eventName, enabled, attachTo);
  }

  if (Build.event) {
    Context.emit = (elm: Element, eventName: string, data: EventEmitterData) => domApi.$dispatchEvent(elm, Context.eventNameFn ? Context.eventNameFn(eventName) : eventName, data);
  }

  Context.isServer = Context.isPrerender = !(Context.isClient = true);
  Context.window = win;
  Context.location = win.location;
  Context.document = doc;

  // keep a global set of tags we've already defined
  const globalDefined: {[tag: string]: boolean} = (win as any).definedComponents = (win as any).definedComponents || {};

  // create the platform api which is used throughout common core code
  const plt: PlatformApi = {
    connectHostElement,
    domApi,
    defineComponent,
    emitEvent: Context.emit,
    getComponentMeta: elm => registry[domApi.$tagName(elm)],
    getContextItem: contextKey => Context[contextKey],
    isClient: true,
    isDefinedComponent: (elm: Element) => !!(globalDefined[domApi.$tagName(elm)] || plt.getComponentMeta(elm)),
    loadBundle,
    onError: (err, type, elm) => console.error(err, type, elm && elm.tagName),
    propConnect: ctrlTag => proxyController(domApi, controllerComponents, ctrlTag),
    queue: createQueueClient(Context.dom, now),
    registerComponents: (components: LoadComponentRegistry[]) => (components || []).map(data => parseComponentLoaders(data, registry))
  };

  if (Build.render) {
    // create the renderer that will be used
    plt.render = createRendererPatch(plt, domApi);
  }

  // setup the root element which is the mighty <html> tag
  // the <html> has the final say of when the app has loaded
  const rootElm = domApi.$documentElement as HostElement;
  rootElm.$rendered = true;
  rootElm.$activeLoading = [];

  // this will fire when all components have finished loaded
  rootElm.$initLoad = () => rootElm._hasLoaded = true;

  // if the HTML was generated from SSR
  // then let's walk the tree and generate vnodes out of the data
  createVNodesFromSsr(domApi, rootElm);

  function connectHostElement(cmpMeta: ComponentMeta, elm: HostElement) {
    // set the "mode" property
    if (!elm.mode) {
      // looks like mode wasn't set as a property directly yet
      // first check if there's an attribute
      // next check the app's global
      elm.mode = domApi.$getAttribute(elm, 'mode') || Context.mode;
    }

    // host element has been connected to the DOM
    if (Build.customSlot && !domApi.$getAttribute(elm, SSR_VNODE_ID) && !useShadowDom(domApi.$supportsShadowDom, cmpMeta)) {
      // only required when we're NOT using native shadow dom (slot)
      // this host element was NOT created with SSR
      // let's pick out the inner content for slot projection
      assignHostContentSlots(domApi, cmpMeta, elm, elm.childNodes);
    }

    if (Build.customSlot && !domApi.$supportsShadowDom && cmpMeta.encapsulation === ENCAPSULATION.ShadowDom) {
      // this component should use shadow dom
      // but this browser doesn't support it
      // so let's polyfill a few things for the user
      (elm as any).shadowRoot = elm;
    }
  }



  function defineComponent(cmpMeta: ComponentMeta, HostElementConstructor: any) {
    const tagName = cmpMeta.tagNameMeta;

    if (!globalDefined[tagName]) {
      // keep an array of all the defined components, useful for external frameworks
      globalDefined[tagName] = true;

      // initialize the members on the host element prototype
      initHostConstructor(plt, cmpMeta, HostElementConstructor.prototype, hydratedCssClass);

      if (Build.observeAttr) {
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
      }

      // define the custom element
      win.customElements.define(tagName, HostElementConstructor);
    }
  }


  App.loadComponents = function loadComponents(bundleId, importFn) {
    // https://youtu.be/Z-FPimCmbX8?t=31
    // jsonp tag team back again from requested bundle
    const args = arguments;

    // import component function
    // inject globals
    importFn(moduleImports, h, Context, publicPath);

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
      bundleCallbacks[bundleId] = null;
    }

    // remember that we've already loaded this bundle
    loadedBundles[bundleId] = true;
  };


  if (Build.styles) {
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
  }


  function loadBundle(cmpMeta: ComponentMeta, elm: HostElement, cb: Function, bundleId?: string): void {
    bundleId = cmpMeta.bundleIds[elm.mode] || (cmpMeta.bundleIds as any);

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


  function requestBundle(cmpMeta: ComponentMeta, bundleId: string, url?: string, tmrId?: any, scriptElm?: HTMLScriptElement) {
    // create the url we'll be requesting
    url = publicPath + bundleId + (((Build.scopedCss || Build.shadowDom) && (useScopedCss(domApi.$supportsShadowDom, cmpMeta)) ? '.sc' : '') + '.js');

    function onScriptComplete() {
      clearTimeout(tmrId);
      scriptElm.onerror = scriptElm.onload = null;
      domApi.$removeChild(domApi.$parentNode(scriptElm), scriptElm);

      // remove from our list of active requests
      pendingBundleRequests[url] = false;
    }

    if (!pendingBundleRequests[url]) {
      // we're not already actively requesting this url
      // let's kick off the bundle request and
      // remember that we're now actively requesting this url
      pendingBundleRequests[url] = true;

      // create a sript element to add to the document.head
      scriptElm = domApi.$createElement('script');
      scriptElm.charset = 'utf-8';
      scriptElm.async = true;
      scriptElm.src = url;

      // create a fallback timeout if something goes wrong
      tmrId = setTimeout(onScriptComplete, 120000);

      // add script completed listener to this script element
      scriptElm.onerror = scriptElm.onload = onScriptComplete;

      // inject a script tag in the head
      // kick off the actual request
      domApi.$appendChild(domApi.$head, scriptElm);
    }
  }

  if (Build.styles) {
    plt.attachStyles = (cmpMeta: ComponentMeta, modeName: string, elm: HostElement) => {
      if (Build.styles) {
        const templateElm = styleTemplates[cmpMeta.tagNameMeta + '_' + modeName] || styleTemplates[cmpMeta.tagNameMeta];

        if (templateElm) {
          let styleContainerNode: HTMLElement = domApi.$head;

          if (domApi.$supportsShadowDom) {
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
    };
  }

  return plt;
}


export interface StyleTemplates {
  [tag: string]: HTMLTemplateElement;
}
