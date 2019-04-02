import * as d from '../declarations';
import { attachStyles } from '../core/styles';
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
import { initStyleTemplate } from '../core/styles';
import { parseComponentLoader } from '../util/data-parse';
import { proxyController } from '../core/proxy-controller';
import { queueUpdate } from '../core/update';


export const createPlatformMain = (namespace: string, Context: d.CoreContext, win: d.WindowData, doc: Document, resourcesUrl: string, hydratedCssClass: string, components: d.ComponentHostData[]) => {

  const perf = win.performance;
  const cmpRegistry: d.ComponentRegistry = { 'html': {} };
  const controllerComponents: {[tag: string]: d.HostElement} = {};
  const App: d.AppGlobal = (win as any)[namespace] = (win as any)[namespace] || {};
  const domApi = createDomApi(App, win, doc);
  const rootElm = domApi.$doc.documentElement as d.HostElement;

  // keep a global set of tags we've already defined
  const globalDefined: {[tag: string]: boolean} = win['s-defined'] = (win['s-defined'] || {});

  const defineComponent = (cmpMeta: d.ComponentMeta, HostElementConstructor: any) => {

    if (!win.customElements.get(cmpMeta.tagNameMeta)) {

      // define the custom element
      // initialize the members on the host element prototype
      // keep a ref to the metadata with the tag as the key
      initHostElement(
        plt,
        (cmpRegistry[cmpMeta.tagNameMeta] = cmpMeta),
        HostElementConstructor.prototype,
        hydratedCssClass,
        perf
      );

      if (_BUILD_.observeAttr) {
        // add which attributes should be observed
        // at this point the membersMeta only includes attributes which should
        // be observed, it does not include all props yet, so it's safe to
        // loop through all of the props (attrs) and observed them
        // set the array of all the attributes to keep an eye on
        // https://www.youtube.com/watch?v=RBs21CFBALI
        HostElementConstructor.observedAttributes = Object.values(cmpMeta.membersMeta)
          .map(member => member.attribName)
          .filter(attribName => !!attribName);
      }

      if (_BUILD_.profile) {
        perf.mark(`define_start:${cmpMeta.tagNameMeta}`);
      }

      win.customElements.define(cmpMeta.tagNameMeta, HostElementConstructor);

      if (_BUILD_.profile) {
        perf.mark(`define_end:${cmpMeta.tagNameMeta}`);
        perf.measure(`define:${cmpMeta.tagNameMeta}`, `define_start:${cmpMeta.tagNameMeta}`, `define_end:${cmpMeta.tagNameMeta}`);
      }
    }
  };

  // create the platform api which is used throughout common core code
  const plt: d.PlatformApi = {
    domApi,
    defineComponent,
    getComponentMeta: elm => cmpRegistry[domApi.$tagName(elm)],
    getContextItem: contextKey => Context[contextKey],
    isClient: true,
    isDefinedComponent: (elm: Element) => !!(globalDefined[domApi.$tagName(elm)] || plt.getComponentMeta(elm)),
    onError: (err, type, elm) => console.error(err, type, elm && elm.tagName),
    queue: (Context.queue = createQueueClient(App, win)),

    requestBundle: (cmpMeta: d.ComponentMeta, elm: d.HostElement, hmrVersionId: string) => {
      if (_BUILD_.profile) {
        perf.mark(`request_bundle_start:${elm.nodeName.toLowerCase()}:${elm['s-id']}`);
      }

      if (_BUILD_.externalModuleLoader) {
        // using a 3rd party bundler to import modules
        // at this point the cmpMeta will already have a
        // static function as a the bundleIds that returns the module
        const useScopedCss = _BUILD_.shadowDom && !domApi.$supportsShadowDom;
        const moduleOpts: d.GetModuleOptions = {
          mode: elm.mode,
          scoped: useScopedCss
        };

        (cmpMeta.bundleIds as d.GetModuleFn)(moduleOpts).then(cmpConstructor => {
          // async loading of the module is done

          if (_BUILD_.profile) {
            perf.mark(`request_bundle_end:${elm.nodeName.toLowerCase()}:${elm['s-id']}`);
            perf.measure(`request_bundle:${elm.nodeName.toLowerCase()}:${elm['s-id']}`, `request_bundle_start:${elm.nodeName.toLowerCase()}:${elm['s-id']}`, `request_bundle_end:${elm.nodeName.toLowerCase()}:${elm['s-id']}`);
          }

          try {
            // get the component constructor from the module
            // initialize this component constructor's styles
            // it is possible for the same component to have difficult styles applied in the same app
            cmpMeta.componentConstructor = cmpConstructor;

            if (_BUILD_.styles) {
              initStyleTemplate(
                domApi,
                cmpMeta,
                cmpMeta.encapsulationMeta,
                cmpConstructor.style,
                cmpConstructor.styleMode,
                perf
              );
            }

          } catch (e) {
            // oh man, something's up
            console.error(e);

            // provide a bogus component constructor
            // so the rest of the app acts as normal
            cmpMeta.componentConstructor = class {} as any;
          }

          // bundle all loaded up, let's continue
          queueUpdate(plt, elm, perf);
        });

      } else if (_BUILD_.browserModuleLoader) {
        // self loading module using built-in browser's import()
        // this is when not using a 3rd party bundler
        // and components are able to lazy load themselves
        // through standardized browser APIs
        const bundleId = (_BUILD_.hasMode && typeof cmpMeta.bundleIds !== 'string')
          ? (cmpMeta.bundleIds as d.BundleIds)[elm.mode]
          : cmpMeta.bundleIds;

        const useScopedCss = _BUILD_.shadowDom && !domApi.$supportsShadowDom;
        let url = resourcesUrl + bundleId + (useScopedCss ? '.sc' : '') + '.entry.js';

        if (_BUILD_.hotModuleReplacement && hmrVersionId) {
          url += '?s-hmr=' + hmrVersionId;
        }

        // dynamic es module import() => woot!
        __import(url).then(importedModule => {
          // async loading of the module is done

          if (_BUILD_.profile) {
            perf.mark(`request_bundle_end:${elm.nodeName.toLowerCase()}:${elm['s-id']}`);
            perf.measure(`request_bundle:${elm.nodeName.toLowerCase()}:${elm['s-id']}`, `request_bundle_start:${elm.nodeName.toLowerCase()}:${elm['s-id']}`, `request_bundle_end:${elm.nodeName.toLowerCase()}:${elm['s-id']}`);
          }

          try {
            // get the component constructor from the module
            // initialize this component constructor's styles
            // it is possible for the same component to have difficult styles applied in the same app
            cmpMeta.componentConstructor = importedModule[dashToPascalCase(cmpMeta.tagNameMeta)];

            if (_BUILD_.styles) {
              initStyleTemplate(
                domApi,
                cmpMeta,
                cmpMeta.encapsulationMeta,
                cmpMeta.componentConstructor.style,
                cmpMeta.componentConstructor.styleMode,
                perf
              );
            }

            // bundle all loaded up, let's continue
            queueUpdate(plt, elm, perf);

          } catch (e) {
            // oh man, something's up
            console.error(e);
            // provide a bogus component constructor
            // so the rest of the app acts as normal
            cmpMeta.componentConstructor = class {} as any;
          }
        }, err => console.error(err, url));
      }
    },

    activeRender: false,
    isAppLoaded: false,
    tmpDisconnected: false,
    attachStyles: (_BUILD_.styles) ? attachStyles : undefined,

    ancestorHostElementMap: new WeakMap(),
    componentAppliedStyles: new WeakMap(),
    hasConnectedMap: new WeakMap(),
    hasListenersMap: new WeakMap(),
    isCmpLoaded: new WeakMap(),
    isCmpReady: new WeakMap(),
    hostElementMap: new WeakMap(),
    hostSnapshotMap: new WeakMap(),
    instanceMap: new WeakMap(),
    isDisconnectedMap: new WeakMap(),
    isQueuedForUpdate: new WeakMap(),
    onReadyCallbacksMap: new WeakMap(),
    queuedEvents: new WeakMap(),
    vnodeMap: new WeakMap(),
    valuesMap: new WeakMap(),

    processingCmp: new Set(),
    onAppReadyCallbacks: []
  };

  if (_BUILD_.profile) {
    perf.mark(`app_load_start`);
  }

  // set App Context
  Context.isServer = Context.isPrerender = !(Context.isClient = true);
  Context.window = win;
  Context.location = win.location;
  Context.document = doc;
  Context.resourcesUrl = Context.publicPath = resourcesUrl;

  if (_BUILD_.listener) {
    Context.enableListener = (instance, eventName, enabled, attachTo, passive) => enableEventListener(plt, instance, eventName, enabled, attachTo, passive);
  }

  if (_BUILD_.event) {
    plt.emitEvent = Context.emit = (elm: Element, eventName: string, data: d.EventEmitterData) => domApi.$dispatchEvent(elm, Context.eventNameFn ? Context.eventNameFn(eventName) : eventName, data);
  }

  if (_BUILD_.propConnect) {
    plt.propConnect = ctrlTag => proxyController(domApi, controllerComponents, ctrlTag);
  }

  if (_BUILD_.profile) {
    // internal id increment for unique ids
    let ids = 0;
    plt.nextId = () => namespace + (ids++);
  }

  // add the h() fn to the app's global namespace
  App.h = h;
  App.Context = Context;

  // create a method that returns a promise
  // which gets resolved when the app's queue is empty
  // and app is idle, works for both initial load and updates
  App.onReady = () => new Promise(resolve => plt.queue.write(() => plt.processingCmp.size ? plt.onAppReadyCallbacks.push(resolve) : resolve()));

  // create the renderer that will be used
  plt.render = createRendererPatch(plt, domApi);

  // setup the root element which is the mighty <html> tag
  // the <html> has the final say of when the app has loaded
  rootElm['s-ld'] = [];
  rootElm['s-rn'] = true;

  // this will fire when all components have finished loaded
  rootElm['s-init'] = () => {
    plt.isCmpReady.set(rootElm, App.loaded = plt.isAppLoaded = true);
    domApi.$dispatchEvent(win, 'appload', { detail: { namespace: namespace } });

    if (_BUILD_.profile) {
      perf.mark('app_load_end');
      perf.measure('app_load', 'app_load_start', 'app_load_end');
    }
  };

  if (_BUILD_.prerenderClientSide || _BUILD_.prerenderExternal) {
    // if the HTML was generated from prerendering
    // then let's walk the tree and generate vnodes out of the data
    createVNodesFromSsr(plt, domApi, rootElm);
  }

  if (_BUILD_.devInspector) {
    generateDevInspector(namespace, win, plt, components);
  }

  if (_BUILD_.browserModuleLoader) {
    // register all the components now that everything's ready
    // standard es2017 class extends HTMLElement
    if (_BUILD_.profile) {
      perf.mark(`define_custom_elements_start`);
    }

    components
      .map(parseComponentLoader)
      .forEach(cmpMeta => defineComponent(cmpMeta, class extends HTMLElement {}));

    if (_BUILD_.profile) {
      perf.mark(`define_custom_elements_end`);
      perf.measure(`define_custom_elements`, `define_custom_elements_start`, `define_custom_elements_end`);
    }

    if (!plt.hasConnectedComponent) {
      // we just defined call the custom elements but no
      // connectedCallbacks happened, so no components in the dom :(
      rootElm['s-init']();
    }
  }

  // create the componentOnReady fn
  initCoreComponentOnReady(plt, App, win, win['s-apps'], win['s-cr']);

  // notify that the app has initialized and the core script is ready
  // but note that the components have not fully loaded yet
  App.initialized = true;

  return plt;
};


declare var __import: (url: string) => Promise<d.ImportedModule>;
