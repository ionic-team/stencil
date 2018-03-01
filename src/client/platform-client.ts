import { AppGlobal, ComponentMeta, ComponentRegistry, CoreContext, EventEmitterData,
  HostElement, ImportedModule, LoadComponentRegistry, PlatformApi } from '../declarations';
import { assignHostContentSlots } from '../renderer/vdom/slot';
import { attachStyles } from '../core/styles';
import { Build } from '../util/build-conditionals';
import { createDomApi } from '../renderer/vdom/dom-api';
import { createRendererPatch } from '../renderer/vdom/patch';
import { createVNodesFromSsr } from '../renderer/vdom/ssr';
import { createQueueClient } from './queue-client';
import { dashToPascalCase } from '../util/helpers';
import { enableEventListener } from '../core/listeners';
import { ENCAPSULATION, SSR_VNODE_ID } from '../util/constants';
import { h } from '../renderer/vdom/h';
import { initHostElement } from '../core/init-host-element';
import { initStyleTemplate } from '../core/styles';
import { parseComponentLoader } from '../util/data-parse';
import { proxyController } from '../core/proxy-controller';
import { useScopedCss, useShadowDom } from '../renderer/vdom/encapsulation';


export function createPlatformClient(Context: CoreContext, App: AppGlobal, win: Window, doc: Document, publicPath: string, hydratedCssClass: string): PlatformApi {
  const cmpRegistry: ComponentRegistry = { 'html': {} };
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
    loadBundle,
    onError: (err, type, elm) => console.error(err, type, elm && elm.tagName),
    propConnect: ctrlTag => proxyController(domApi, controllerComponents, ctrlTag),
    queue: createQueueClient(win),
    registerComponents: (components: LoadComponentRegistry[]) => (components || []).map(data => parseComponentLoader(data, cmpRegistry)),

    ancestorHostElementMap: new WeakMap(),
    componentAppliedStyles: new WeakMap(),
    defaultSlotsMap: new WeakMap(),
    hasConnectedMap: new WeakMap(),
    hasListenersMap: new WeakMap(),
    hasLoadedMap: new WeakMap(),
    hostElementMap: new WeakMap(),
    instanceMap: new WeakMap(),
    isDisconnectedMap: new WeakMap(),
    isQueuedForUpdate: new WeakMap(),
    namedSlotsMap: new WeakMap(),
    onReadyCallbacksMap: new WeakMap(),
    queuedEvents: new WeakMap(),
    vnodeMap: new WeakMap(),
    valuesMap: new WeakMap()
  };

  // create the renderer that will be used
  plt.render = createRendererPatch(plt, domApi);

  // setup the root element which is the mighty <html> tag
  // the <html> has the final say of when the app has loaded
  const rootElm = domApi.$documentElement as HostElement;
  rootElm.$rendered = true;
  rootElm.$activeLoading = [];

  // this will fire when all components have finished loaded
  rootElm.$initLoad = () => plt.hasLoadedMap.set(rootElm, plt.isAppLoaded = true);

  // if the HTML was generated from SSR
  // then let's walk the tree and generate vnodes out of the data
  createVNodesFromSsr(plt, domApi, rootElm);

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
      assignHostContentSlots(plt, domApi, elm, elm.childNodes);
    }

    if (!domApi.$supportsShadowDom && cmpMeta.encapsulation === ENCAPSULATION.ShadowDom) {
      // this component should use shadow dom
      // but this browser doesn't support it
      // so let's polyfill a few things for the user
      (elm as any).shadowRoot = elm;
    }
  }


  function defineComponent(cmpMeta: ComponentMeta, HostElementConstructor: any) {

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
      win.customElements.define(cmpMeta.tagNameMeta, HostElementConstructor);
    }
  }


  function loadBundle(cmpMeta: ComponentMeta, modeName: string, cb: Function) {
    if (cmpMeta.componentConstructor) {
      // we're already all loaded up :)
      cb();

    } else {
      const bundleId = (typeof cmpMeta.bundleIds === 'string') ?
        cmpMeta.bundleIds :
        cmpMeta.bundleIds[modeName];
      const url = publicPath + bundleId + ((useScopedCss(domApi.$supportsShadowDom, cmpMeta) ? '.sc' : '') + '.js');

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
        cb();

      }).catch(err => console.error(err, url));
    }
  }

  if (Build.styles) {
    plt.attachStyles = attachStyles;
  }

  return plt;
}


declare var __import: (url: string) => Promise<ImportedModule>;
