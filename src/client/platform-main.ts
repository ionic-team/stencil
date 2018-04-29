import * as d from '../declarations';
import { attachStyles } from '../core/styles';
import { Build } from '../util/build-conditionals';
import { createDomApi } from '../renderer/dom-api';
import { createRendererPatch } from '../renderer/vdom/patch';
import { createVNodesFromSsr } from '../renderer/vdom/ssr';
import { createQueueClient } from './queue-client';
import { dashToPascalCase } from '../util/helpers';
import { enableEventListener } from '../core/listeners';
import { generateDevInspector } from './dev-inspector';
import { h } from '../renderer/vdom/h';
import { initCoreComponentOnReady } from '../core/component-on-ready';
import { initHostElement } from '../core/init-host-element';
import { initHostSnapshot } from '../core/host-snapshot';
import { initStyleTemplate } from '../core/styles';
import { parseComponentLoader } from '../util/data-parse';
import { proxyController } from '../core/proxy-controller';
import { queueUpdate } from '../core/update';
import { useScopedCss } from '../renderer/vdom/encapsulation';


export function createPlatformMain(namespace: string, Context: d.CoreContext, win: Window, doc: Document, resourcesUrl: string, hydratedCssClass: string) {
  const cmpRegistry: d.ComponentRegistry = { 'html': {} };
  const controllerComponents: {[tag: string]: d.HostElement} = {};
  const App: d.AppGlobal = (win as any)[namespace] = (win as any)[namespace] || {};
  const domApi = createDomApi(App, win, doc);

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
  App.registerComponents = registerComponents;

  // keep a global set of tags we've already defined
  const globalDefined: {[tag: string]: boolean} = (win as any).$definedCmps = (win as any).$definedCmps || {};

  // internal id increment for unique ids
  let ids = 0;

  // create the platform api which is used throughout common core code
  const plt: d.PlatformApi = {
    domApi,
    defineComponent,
    emitEvent: Context.emit,
    getComponentMeta: elm => cmpRegistry[domApi.$tagName(elm)],
    getContextItem: contextKey => Context[contextKey],
    isClient: true,
    isDefinedComponent: (elm: Element) => !!(globalDefined[domApi.$tagName(elm)] || plt.getComponentMeta(elm)),
    nextId: () => namespace + (ids++),
    onError: (err, type, elm) => console.error(err, type, elm && elm.tagName),
    propConnect: ctrlTag => proxyController(domApi, controllerComponents, ctrlTag),
    queue: (Context.queue = createQueueClient(App, win)),
    requestBundle,

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

    if (!globalDefined[cmpMeta.tagNameMeta]) {
      // keep a map of all the defined components
      globalDefined[cmpMeta.tagNameMeta] = true;

      // initialize the members on the host element prototype
      initHostElement(plt, cmpMeta, HostElementConstructor.prototype, hydratedCssClass);

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


  function requestBundle(cmpMeta: d.ComponentMeta, elm: d.HostElement) {
    // set the "mode" property
    if (!elm.mode) {
      // looks like mode wasn't set as a property directly yet
      // first check if there's an attribute
      // next check the app's global
      elm.mode = domApi.$getAttribute(elm, 'mode') || Context.mode;
    }

    // remember a "snapshot" of this host element's current attributes/child nodes/slots/etc
    initHostSnapshot(plt.domApi, cmpMeta, elm);

    if (cmpMeta.componentConstructor) {
      // we're already all loaded up :)
      queueUpdate(plt, elm);

    } else {
      const bundleId = (typeof cmpMeta.bundleIds === 'string') ?
        cmpMeta.bundleIds :
        cmpMeta.bundleIds[elm.mode];
      const url = resourcesUrl + bundleId + ((useScopedCss(domApi.$supportsShadowDom, cmpMeta) ? '.sc' : '') + '.js');

      // dynamic es module import() => woot!
      __import(url).then(importedModule => {
        // async loading of the module is done
        try {
          // get the component constructor from the module
          cmpMeta.componentConstructor = importedModule[dashToPascalCase(cmpMeta.tagNameMeta)];

          // initialize this component constructor's styles
          // it is possible for the same component to have difficult styles applied in the same app
          initStyleTemplate(domApi, cmpMeta, cmpMeta.componentConstructor);

        } catch (e) {
          // oh man, something's up
          console.error(e);

          // provide a bogus component constructor
          // so the rest of the app acts as normal
          cmpMeta.componentConstructor = class {} as any;
        }

        // bundle all loaded up, let's continue
        queueUpdate(plt, elm);

      }).catch(err => console.error(err, url));
    }
  }

  function registerComponents(components: d.LoadComponentRegistry[]) {
    (components || [])
        .map(data => parseComponentLoader(data, cmpRegistry))
        .forEach(cmpMeta => plt.defineComponent(cmpMeta, class extends HTMLElement {
    }));
  }

  if (Build.styles) {
    plt.attachStyles = attachStyles;
  }

  if (Build.devInspector) {
    generateDevInspector(App, namespace, window, plt);
  }

  // register all the components now that everything's ready
  // standard es2015 class extends HTMLElement
  registerComponents(App.components);
  
  // create the componentOnReady fn
  initCoreComponentOnReady(plt, App);

  // notify that the app has initialized and the core script is ready
  // but note that the components have not fully loaded yet
  App.initialized = true;
}


declare var __import: (url: string) => Promise<d.ImportedModule>;
