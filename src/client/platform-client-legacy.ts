import { enableEventListener } from '../core/instance/listeners';
import { AppGlobal, BundleCallback, CjsExports, ComponentMeta, ComponentRegistry, CoreContext,
  EventEmitterData, HostElement, LoadComponentRegistry, PlatformApi } from '../util/interfaces';
import { assignHostContentSlots } from '../core/renderer/slot';
import { attachStyles } from '../core/instance/styles';
import { Build } from '../util/build-conditionals';
import { createDomApi } from '../core/renderer/dom-api';
import { createRendererPatch } from '../core/renderer/patch';
import { createVNodesFromSsr } from '../core/renderer/ssr';
import { createQueueClient } from './queue-client';
import { CustomStyle } from './css-shim/custom-style';
import { ENCAPSULATION, PROP_TYPE, SSR_VNODE_ID } from '../util/constants';
import { h } from '../core/renderer/h';
import { initCssVarShim } from './css-shim/init-css-shim';
import { initHostElement } from '../core/instance/init-host-element';
import { initStyleTemplate } from '../core/instance/styles';
import { parseComponentLoader } from '../util/data-parse';
import { proxyController } from '../core/instance/proxy-controller';
import { toDashCase } from '../util/helpers';
import { useScopedCss, useShadowDom } from '../core/renderer/encapsulation';


export function createPlatformClientLegacy(Context: CoreContext, App: AppGlobal, win: Window, doc: Document, publicPath: string, hydratedCssClass: string): PlatformApi {
  const cmpRegistry: ComponentRegistry = { 'html': {} };
  const bundleQueue: BundleCallback[] = [];
  const loadedBundles: {[bundleId: string]: any} = {};
  const pendingBundleRequests: {[url: string]: boolean} = {};
  const controllerComponents: {[tag: string]: HostElement} = {};
  const domApi = createDomApi(win, doc);

  // set App Context
  Context.isServer = Context.isPrerender = !(Context.isClient = true);
  Context.window = win;
  Context.location = win.location;
  Context.document = doc;
  Context.publicPath = publicPath;

  if (Build.listener) {
    Context.enableListener = (instance, eventName, enabled, attachTo, passive) => enableEventListener(plt, instance, eventName, enabled, attachTo, passive);
  }

  if (Build.event) {
    Context.emit = (elm: Element, eventName: string, data: EventEmitterData) => domApi.$dispatchEvent(elm, Context.eventNameFn ? Context.eventNameFn(eventName) : eventName, data);
  }

  // add the h() fn to the app's global namespace
  App.h = h;
  App.Context = Context;

  // keep a global set of tags we've already defined
  const globalDefined: {[tag: string]: boolean} = (win as any).$definedCmps = (win as any).$definedCmps || {};

  // create the platform api which is used throughout common core code
  const plt: PlatformApi = {
    connectHostElement,
    domApi,
    defineComponent,
    emitEvent: Context.emit,
    getComponentMeta: elm => cmpRegistry[domApi.$tagName(elm)],
    getContextItem: contextKey => Context[contextKey],
    isClient: true,
    isDefinedComponent: (elm: Element) => !!(globalDefined[domApi.$tagName(elm)] || plt.getComponentMeta(elm)),
    loadBundle: loadComponent,
    onError: (err, type, elm) => console.error(err, type, elm && elm.tagName),
    propConnect: ctrlTag => proxyController(domApi, controllerComponents, ctrlTag),
    queue: createQueueClient(win),
    registerComponents: (components: LoadComponentRegistry[]) => (components || []).map(data => parseComponentLoader(data, cmpRegistry))
  };

  // create the renderer that will be used
  plt.render = createRendererPatch(plt, domApi);

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
    if (!domApi.$getAttribute(elm, SSR_VNODE_ID) && !useShadowDom(domApi.$supportsShadowDom, cmpMeta)) {
      // only required when we're NOT using native shadow dom (slot)
      // this host element was NOT created with SSR
      // let's pick out the inner content for slot projection
      assignHostContentSlots(domApi, elm, elm.childNodes);
    }

    if (!domApi.$supportsShadowDom && cmpMeta.encapsulation === ENCAPSULATION.ShadowDom) {
      // this component should use shadow dom
      // but this browser doesn't support it
      // so let's polyfill a few things for the user
      (elm as any).shadowRoot = elm;
    }
  }


  function defineComponent(cmpMeta: ComponentMeta, HostElementConstructor: any) {
    const tagName = cmpMeta.tagNameMeta;

    if (!globalDefined[tagName]) {
      // keep a map of all the defined components
      globalDefined[tagName] = true;

      // initialize the members on the host element prototype
      initHostElement(plt, cmpMeta, HostElementConstructor.prototype, hydratedCssClass);

      if (Build.observeAttr) {
        // add which attributes should be observed
        const observedAttributes: string[] = [];

        // at this point the membersMeta only includes attributes which should
        // be observed, it does not include all props yet, so it's safe to
        // loop through all of the props (attrs) and observed them
        for (const propName in cmpMeta.membersMeta) {
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

  /**
   * Execute a bundle queue item
   * @param name
   * @param deps
   * @param callback
   */
  function execBundleCallback(name: string, deps: string[], callback: Function) {
    const bundleExports: CjsExports = {};

    try {
      callback(bundleExports, ...deps.map(d => loadedBundles[d]));
    } catch (e) {
      console.error(e);
    }

    // If name is undefined then this callback was fired by component callback
    if (name === undefined) {
      return;
    }

    loadedBundles[name] = bundleExports;

    // If name contains chunk then this callback was associated with a dependent bundle loading
    // let's add a reference to the constructors on each components metadata
    // each key in moduleImports is a PascalCased tag name
    if (!name.startsWith('./chunk')) {
      Object.keys(bundleExports).forEach(pascalCasedTagName => {
        const cmpMeta = cmpRegistry[toDashCase(pascalCasedTagName)];
        if (cmpMeta) {
          // connect the component's constructor to its metadata
          cmpMeta.componentConstructor = bundleExports[pascalCasedTagName];
          initStyleTemplate(domApi, cmpMeta.componentConstructor);
          cmpMeta.membersMeta = {
            'color': {}
          };

          if (cmpMeta.componentConstructor.properties) {
            Object.keys(cmpMeta.componentConstructor.properties).forEach(memberName => {
              const constructorProperty = cmpMeta.componentConstructor.properties[memberName];

              if (constructorProperty.type) {
                cmpMeta.membersMeta[memberName] = {
                  propType: PROP_TYPE.Any
                };
              }
            });
          }
        }
      });
    }
  }

  /**
   * Check to see if any items in the bundle queue can be executed
   */
  function checkQueue() {
    for (let i = bundleQueue.length - 1; i > -1; i--) {
      const [bundleId, dependentsList, importer] = bundleQueue[i];
      if (dependentsList.every(dep => loadedBundles[dep]) && !loadedBundles[bundleId]) {
        execBundleCallback(bundleId, dependentsList, importer);
      }
    }
  }

  /**
   * This function is called anytime a JS file is loaded
   */
  App.loadBundle = function loadBundle(bundleId: string, [, ...dependentsList]: string[], importer: Function) {

    const missingDependents = dependentsList.filter(d => !loadedBundles[d]);
    missingDependents.forEach(d => {
        const url = publicPath + d.replace('.js', '.es5.js');
        requestUrl(url);
      });
    bundleQueue.push([bundleId, dependentsList, importer]);

    // If any dependents are not yet met then queue the bundle execution
    if (missingDependents.length === 0) {
      checkQueue();
    }
  };


  let customStyle: CustomStyle;
  let requestBundleQueue: Function[] = [];
  if (Build.cssVarShim) {
    customStyle = new CustomStyle(win, doc);

    initCssVarShim(win, doc, customStyle, () => {
      // loaded all the css, let's run all the request bundle callbacks
      while (requestBundleQueue.length) {
        requestBundleQueue.shift()();
      }

      // set to null to we know we're loaded
      requestBundleQueue = null;
    });
  }

  // This is executed by the component's connected callback.
  function loadComponent(cmpMeta: ComponentMeta, modeName: string, cb: Function, bundleId?: string) {
    bundleId = cmpMeta.bundleIds[modeName] || (cmpMeta.bundleIds as any);

    if (loadedBundles[bundleId]) {
      // sweet, we've already loaded this bundle
      cb();

    } else {
      // never seen this bundle before, let's start the request
      // and add it to the callbacks to fire when it has loaded
      bundleQueue.push([undefined, [bundleId], cb]);

      // when to request the bundle depends is we're using the css shim or not
      if (Build.cssVarShim && !customStyle.supportsCssVars) {
        // using css shim, so we've gotta wait until it's ready
        if (requestBundleQueue) {
          // add this to the loadBundleQueue to run when css is ready
          requestBundleQueue.push(() => {
            requestComponentBundle(cmpMeta, bundleId);
          });

        } else {
          // css already all loaded
          requestComponentBundle(cmpMeta, bundleId);
        }

      } else {
        // not using css shim, so no need to wait on css shim to finish
        // figure out which bundle to request and kick it off
        requestComponentBundle(cmpMeta, bundleId);
      }
    }
  }


  function requestComponentBundle(cmpMeta: ComponentMeta, bundleId: string, url?: string, tmrId?: any, scriptElm?: HTMLScriptElement) {
    // create the url we'll be requesting
    // always use the es5/jsonp callback module
    url = publicPath + bundleId + ((useScopedCss(domApi.$supportsShadowDom, cmpMeta) ? '.sc' : '') + '.es5.js');

    requestUrl(url, tmrId, scriptElm);
  }


  // Use JSONP to load in bundles
  function requestUrl(url?: string, tmrId?: any, scriptElm?: HTMLScriptElement) {

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
    plt.attachStyles = attachStyles;
  }

  return plt;
}
