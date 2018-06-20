import * as d from '../declarations';
import { attachStyles } from '../core/styles';
import { Build } from '../util/build-conditionals';
import { createDomApi } from '../renderer/dom-api';
import { createRendererPatch } from '../renderer/vdom/patch';
import { createVNodesFromSsr } from '../renderer/vdom/ssr';
import { createQueueClient } from './queue-client';
import { CustomStyle } from './polyfills/css-shim/custom-style';
import { enableEventListener } from '../core/listeners';
import { ENCAPSULATION } from '../util/constants';
import { generateDevInspector } from './dev-inspector';
import { h } from '../renderer/vdom/h';
import { initCoreComponentOnReady } from '../core/component-on-ready';
import { initHostElement } from '../core/init-host-element';
import { initStyleTemplate } from '../core/styles';
import { parseComponentLoader } from '../util/data-parse';
import { proxyController } from '../core/proxy-controller';
import { queueUpdate } from '../core/update';


export function createPlatformMainLegacy(namespace: string, Context: d.CoreContext, win: d.WindowData, doc: Document, resourcesUrl: string, hydratedCssClass: string, customStyle: CustomStyle) {
  const cmpRegistry: d.ComponentRegistry = { 'html': {} };
  const bundleQueue: d.BundleCallback[] = [];
  const loadedBundles = new Map<string, d.CjsExports>();
  const pendingBundleRequests = new Set<string>();
  const controllerComponents: {[tag: string]: d.HostElement} = {};
  const App: d.AppGlobal = (win as any)[namespace] = (win as any)[namespace] || {};
  const domApi = createDomApi(App, win, doc);

  if (Build.isDev && Build.shadowDom && domApi.$supportsShadowDom && customStyle) {
    console.error('Unsupported browser. Native shadow-dom available but CSS Custom Properites are not.');
  }

  // set App Context
  Context.isServer = Context.isPrerender = !(Context.isClient = true);
  Context.window = win;
  Context.location = win.location;
  Context.document = doc;
  Context.resourcesUrl = Context.publicPath = resourcesUrl;

  if (Build.listener) {
    Context.enableListener = (instance, eventName, enabled, attachTo, passive) => enableEventListener(plt, instance, eventName, enabled, attachTo, passive);
  }

  if (Build.event) {
    Context.emit = (elm: Element, eventName: string, data: d.EventEmitterData) => domApi.$dispatchEvent(elm, Context.eventNameFn ? Context.eventNameFn(eventName) : eventName, data);
  }

  // add the h() fn to the app's global namespace
  App.h = h;
  App.Context = Context;

  // keep a global set of tags we've already defined
  // DEPRECATED $definedCmps 2018-05-22
  const globalDefined: {[tag: string]: boolean} = win['s-defined'] = (win as any)['$definedCmps'] = (win['s-defined'] || (win as any)['$definedCmps'] || {});

  // internal id increment for unique ids
  let ids = 0;

  // create the platform api which is used throughout common core code
  const plt: d.PlatformApi = {
    domApi,
    defineComponent,
    emitEvent: Context.emit,
    customStyle,
    getComponentMeta: elm => cmpRegistry[domApi.$tagName(elm)],
    getContextItem: contextKey => Context[contextKey],
    isClient: true,
    isDefinedComponent: (elm: Element) => !!(globalDefined[domApi.$tagName(elm)] || plt.getComponentMeta(elm)),
    onError: (err, type, elm) => console.error(err, type, elm && elm.tagName),
    nextId: () => namespace + (ids++),
    propConnect: ctrlTag => proxyController(domApi, controllerComponents, ctrlTag),
    queue: (Context.queue = createQueueClient(App, win)),
    requestBundle: requestBundle,

    ancestorHostElementMap: new WeakMap(),
    componentAppliedStyles: new WeakMap(),
    hasConnectedMap: new WeakMap(),
    hasListenersMap: new WeakMap(),
    hasLoadedMap: new WeakMap(),
    hostElementMap: new WeakMap(),
    hostSnapshotMap: new WeakMap(),
    instanceMap: new WeakMap(),
    isDisconnectedMap: new WeakMap(),
    isQueuedForUpdate: new WeakMap(),
    onReadyCallbacksMap: new WeakMap(),
    queuedEvents: new WeakMap(),
    vnodeMap: new WeakMap(),
    valuesMap: new WeakMap()
  };

  // create the renderer that will be used
  plt.render = createRendererPatch(plt, domApi);

  // setup the root element which is the mighty <html> tag
  // the <html> has the final say of when the app has loaded
  const rootElm = domApi.$documentElement as d.HostElement;
  rootElm['s-ld'] = [];
  rootElm['s-rn'] = true;

  // this will fire when all components have finished loaded
  rootElm['s-init'] = () => {
    plt.hasLoadedMap.set(rootElm, App.loaded = plt.isAppLoaded = true);
    domApi.$dispatchEvent(win, 'appload', { detail: { namespace: namespace } });
  };

  // if the HTML was generated from SSR
  // then let's walk the tree and generate vnodes out of the data
  createVNodesFromSsr(plt, domApi, rootElm);


  function defineComponent(cmpMeta: d.ComponentMeta, HostElementConstructor: any) {

    if (!win.customElements.get(cmpMeta.tagNameMeta)) {
      // keep a map of all the defined components
      globalDefined[cmpMeta.tagNameMeta] = true;

      // initialize the members on the host element prototype
      // keep a ref to the metadata with the tag as the key
      initHostElement(plt,
        (cmpRegistry[cmpMeta.tagNameMeta] = cmpMeta),
        HostElementConstructor.prototype,
        hydratedCssClass
      );

      if (Build.observeAttr) {
        // add which attributes should be observed
        const observedAttributes: string[] = [];

        // at this point the membersMeta only includes attributes which should
        // be observed, it does not include all props yet, so it's safe to
        // loop through all of the props (attrs) and observed them
        for (const propName in cmpMeta.membersMeta) {
          if (cmpMeta.membersMeta[propName].attribName) {
            observedAttributes.push(
              // add this attribute to our array of attributes we need to observe
              cmpMeta.membersMeta[propName].attribName
            );
          }
        }

        // set the array of all the attributes to keep an eye on
        // https://www.youtube.com/watch?v=RBs21CFBALI
        HostElementConstructor.observedAttributes = observedAttributes;
      }

      // define the custom element
      win.customElements.define(cmpMeta.tagNameMeta, HostElementConstructor);
    }
  }

  function setLoadedBundle(bundleId: string, value: d.CjsExports) {
    loadedBundles.set(bundleId, value);
  }

  function getLoadedBundle(bundleId: string) {
    if (bundleId == null) {
      return null;
    }
    return loadedBundles.get(bundleId.replace(/^\.\//, ''));
  }

  function isLoadedBundle(id: string) {
    if (id === 'exports' || id === 'require') {
      return true;
    }
    return !!getLoadedBundle(id);
  }

  /**
   * Execute a bundle queue item
   * @param name
   * @param deps
   * @param callback
   */
  function execBundleCallback(name: string, deps: string[], callback: Function) {
    const bundleExports: d.CjsExports = {};

    try {
      callback.apply(null, deps.map(d => {
        if (d === 'exports') return bundleExports;
        if (d === 'require') return userRequire;
        return getLoadedBundle(d);
      }));
    } catch (e) {
      console.error(e);
    }

    // If name is undefined then this callback was fired by component callback
    if (name === undefined) {
      return;
    }

    setLoadedBundle(name, bundleExports);

    // If name contains chunk then this callback was associated with a dependent bundle loading
    // let's add a reference to the constructors on each components metadata
    // each key in moduleImports is a PascalCased tag name
    if (name && !name.endsWith('.js')) {
      Object.keys(bundleExports).forEach(pascalCasedTagName => {
        const normalizedTagName = pascalCasedTagName.replace(/-/g, '').toLowerCase();

        const registryTags = Object.keys(cmpRegistry);
        for (let i = 0; i < registryTags.length; i++) {
          const normalizedRegistryTag = registryTags[i].replace(/-/g, '').toLowerCase();

          if (normalizedRegistryTag === normalizedTagName) {
            const cmpMeta = cmpRegistry[registryTags[i]];
            if (cmpMeta) {
              // get the component constructor from the module
              cmpMeta.componentConstructor = bundleExports[pascalCasedTagName];

              initStyleTemplate(domApi, cmpMeta, cmpMeta.componentConstructor);
            }
            break;
          }
        }
      });
    }
  }

  function userRequire(ids: string[], resolve: Function) {
    loadBundle(undefined, ids, resolve);
  }

  /**
   * Check to see if any items in the bundle queue can be executed
   */
  function checkQueue() {
    for (let i = bundleQueue.length - 1; i >= 0; i--) {
      const [bundleId, dependentsList, importer] = bundleQueue[i];
      if (dependentsList.every(isLoadedBundle) && !isLoadedBundle(bundleId)) {
        bundleQueue.splice(i, 1);
        execBundleCallback(bundleId, dependentsList, importer);
      }
    }
  }

  /**
   * This function is called anytime a JS file is loaded
   */
  function loadBundle(bundleId: string | undefined, dependentsList: string[], importer: Function) {
    const missingDependents = dependentsList.filter(d => !isLoadedBundle(d));
    missingDependents.forEach(d => {
      requestUrl(resourcesUrl + d.replace('.js', '.es5.js'));
    });
    bundleQueue.push([bundleId, dependentsList, importer]);

    // If any dependents are not yet met then queue the bundle execution
    if (missingDependents.length === 0) {
      checkQueue();
    }
  }
  App.loadBundle = loadBundle;


  let requestBundleQueue: Function[] = [];
  if (Build.cssVarShim && customStyle) {
    customStyle.init().then(() => {
      // loaded all the css, let's run all the request bundle callbacks
      while (requestBundleQueue.length) {
        requestBundleQueue.shift()();
      }

      // set to null to we know we're loaded
      requestBundleQueue = null;
    });
  }

  // This is executed by the component's connected callback.
  function requestBundle(cmpMeta: d.ComponentMeta, elm: d.HostElement) {
    const bundleId = (typeof cmpMeta.bundleIds === 'string') ?
      cmpMeta.bundleIds :
      (cmpMeta.bundleIds as d.BundleIds)[elm.mode];

    if (getLoadedBundle(bundleId)) {
      // sweet, we've already loaded this bundle
      queueUpdate(plt, elm);

    } else {
      // never seen this bundle before, let's start the request
      // and add it to the callbacks to fire when it has loaded
      bundleQueue.push([undefined, [bundleId], () => {
        queueUpdate(plt, elm);
      }]);

      // when to request the bundle depends is we're using the css shim or not
      if (Build.cssVarShim && customStyle) {
        // using css shim, so we've gotta wait until it's ready
        if (requestBundleQueue) {
          // add this to the loadBundleQueue to run when css is ready
          requestBundleQueue.push(() => requestComponentBundle(cmpMeta, bundleId));

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


  function requestComponentBundle(cmpMeta: d.ComponentMeta, bundleId: string) {
    // create the url we'll be requesting
    // always use the es5/jsonp callback module
    const useScoped = cmpMeta.encapsulation === ENCAPSULATION.ScopedCss || (cmpMeta.encapsulation === ENCAPSULATION.ShadowDom && !domApi.$supportsShadowDom);
    requestUrl(resourcesUrl + bundleId + (useScoped ? '.sc' : '') + '.es5.js');
  }


  // Use JSONP to load in bundles
  function requestUrl(url: string) {

    let tmrId: any;
    let scriptElm: HTMLScriptElement;
    function onScriptComplete() {
      clearTimeout(tmrId);
      scriptElm.onerror = scriptElm.onload = null;
      domApi.$remove(scriptElm);

      // remove from our list of active requests
      pendingBundleRequests.delete(url);
    }

    if (!pendingBundleRequests.has(url)) {
      // we're not already actively requesting this url
      // let's kick off the bundle request and
      // remember that we're now actively requesting this url
      pendingBundleRequests.add(url);

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
    plt.attachStyles = (plt, domApi, cmpMeta, elm) => {
      attachStyles(plt, domApi, cmpMeta, elm);
    };
  }

  if (Build.devInspector) {
    generateDevInspector(App, namespace, win, plt);
  }

  // register all the components now that everything's ready
  (App.components || [])
    .map(data => {
      const cmpMeta = parseComponentLoader(data);
      return cmpRegistry[cmpMeta.tagNameMeta] = cmpMeta;
    })
    .forEach(cmpMeta => {
    // es5 way of extending HTMLElement
    function HostElement(self: any) {
      return HTMLElement.call(this, self);
    }

    HostElement.prototype = Object.create(
      HTMLElement.prototype,
      { constructor: { value: HostElement, configurable: true } }
    );

    defineComponent(cmpMeta, HostElement);
  });

  // create the componentOnReady fn
  initCoreComponentOnReady(plt, App, win, win['s-apps'], win['s-cr']);

  // notify that the app has initialized and the core script is ready
  // but note that the components have not fully loaded yet
  App.initialized = true;
}
