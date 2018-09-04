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


export function createPlatformMain(namespace: string, Context: d.CoreContext, win: d.WindowData, doc: Document, resourcesUrl: string, hydratedCssClass: string) {
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

  if (__BUILD_CONDITIONALS__.listener) {
    Context.enableListener = (instance, eventName, enabled, attachTo, passive) => enableEventListener(plt, instance, eventName, enabled, attachTo, passive);
  }

  if (__BUILD_CONDITIONALS__.event) {
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
    getComponentMeta: elm => cmpRegistry[domApi.$tagName(elm)],
    getContextItem: contextKey => Context[contextKey],
    isClient: true,
    isDefinedComponent: (elm: Element) => !!(globalDefined[domApi.$tagName(elm)] || plt.getComponentMeta(elm)),
    nextId: () => namespace + (ids++),
    onError: (err, type, elm) => console.error(err, type, elm && elm.tagName),
    propConnect: ctrlTag => proxyController(domApi, controllerComponents, ctrlTag),
    queue: (Context.queue = createQueueClient(App, win)),
    requestBundle,
    activeRender: false,
    isAppLoaded: false,
    tmpDisconnected: false,
    attachStyles: (__BUILD_CONDITIONALS__.styles) ? attachStyles : undefined,

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
  const rootElm = domApi.$doc.documentElement as d.HostElement;
  rootElm['s-ld'] = [];
  rootElm['s-rn'] = true;

  // this will fire when all components have finished loaded
  rootElm['s-init'] = () => {
    plt.hasLoadedMap.set(rootElm, App.loaded = plt.isAppLoaded = true);
    domApi.$dispatchEvent(win, 'appload', { detail: { namespace: namespace } });
  };

  if (__BUILD_CONDITIONALS__.browserModuleLoader) {
    // if the HTML was generated from SSR
    // then let's walk the tree and generate vnodes out of the data
    createVNodesFromSsr(plt, domApi, rootElm);
  }

  function defineComponent(cmpMeta: d.ComponentMeta, HostElementConstructor: any) {

    const tagNameMeta = cmpMeta.tagNameMeta;

    if (!win.customElements.get(tagNameMeta)) {

      // define the custom element
      // initialize the members on the host element prototype
      // keep a ref to the metadata with the tag as the key
      initHostElement(
        plt,
        (cmpRegistry[tagNameMeta] = cmpMeta),
        HostElementConstructor.prototype,
        hydratedCssClass,
      );

      if (__BUILD_CONDITIONALS__.observeAttr) {
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

      win.customElements.define(cmpMeta.tagNameMeta, HostElementConstructor);
    }
  }


  async function requestBundle(cmpMeta: d.ComponentMeta, elm: d.HostElement, hmrVersionId: string) {
    if (cmpMeta.componentConstructor) {
      // we're already all loaded up :)
      queueUpdate(plt, elm);


    } else if (__BUILD_CONDITIONALS__.externalModuleLoader) {
      // using a 3rd party bundler to import modules
      // at this point the cmpMeta will already have a
      // static function as a the bundleIds that returns the module
      const moduleOpts: d.GetModuleOptions = {
        mode: elm.mode,
        scoped: !domApi.$supportsShadowDom
      };

      (cmpMeta.bundleIds as d.GetModuleFn)(moduleOpts).then(cmpConstructor => {
        // async loading of the module is done
        try {
          // get the component constructor from the module
          // initialize this component constructor's styles
          // it is possible for the same component to have difficult styles applied in the same app
          cmpMeta.componentConstructor = cmpConstructor;
          initStyleTemplate(
            domApi,
            cmpMeta,
            cmpMeta.encapsulationMeta,
            cmpConstructor.style,
            cmpConstructor.styleMode
          );

        } catch (e) {
          // oh man, something's up
          console.error(e);

          // provide a bogus component constructor
          // so the rest of the app acts as normal
          cmpMeta.componentConstructor = class {} as any;
        }

        // bundle all loaded up, let's continue
        queueUpdate(plt, elm);
      });


    } else if (__BUILD_CONDITIONALS__.browserModuleLoader) {
      // self loading module using built-in browser's import()
      // this is when not using a 3rd party bundler
      // and components are able to lazy load themselves
      // through standardized browser APIs
      const bundleId = (typeof cmpMeta.bundleIds === 'string')
        ? cmpMeta.bundleIds
        : (cmpMeta.bundleIds as d.BundleIds)[elm.mode];

      const useScopedCss = !domApi.$supportsShadowDom;
      let url = resourcesUrl + bundleId + ((useScopedCss ? '.sc' : '') + '.js');

      if (__BUILD_CONDITIONALS__.hotModuleReplacement && hmrVersionId) {
        url += '?s-hmr=' + hmrVersionId;
      }

      try {
        // dynamic es module import() => woot!
        const importedModule = await __import(url);

        // get the component constructor from the module
        // initialize this component constructor's styles
        // it is possible for the same component to have difficult styles applied in the same app
        cmpMeta.componentConstructor = importedModule[dashToPascalCase(cmpMeta.tagNameMeta)];
        initStyleTemplate(
          domApi,
          cmpMeta,
          cmpMeta.encapsulationMeta,
          cmpMeta.componentConstructor.style,
          cmpMeta.componentConstructor.styleMode
        );

        // bundle all loaded up, let's continue
        queueUpdate(plt, elm);

      } catch (e) {
        // oh man, something's up
        console.error(e);
      }
    }
  }

  if (__BUILD_CONDITIONALS__.devInspector) {
    generateDevInspector(App, namespace, win, plt);
  }

  if (__BUILD_CONDITIONALS__.browserModuleLoader) {
    // register all the components now that everything's ready
    // standard es2017 class extends HTMLElement
    (App.components || [])
      .map(parseComponentLoader)
      .forEach(cmpMeta => defineComponent(cmpMeta, class extends HTMLElement {}));
  }

  // create the componentOnReady fn
  initCoreComponentOnReady(plt, App, win, win['s-apps'], win['s-cr']);

  // notify that the app has initialized and the core script is ready
  // but note that the components have not fully loaded yet
  App.initialized = true;

  return plt;
}


declare var __import: (url: string) => Promise<d.ImportedModule>;
