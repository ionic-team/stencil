import { AppGlobal, ComponentMeta, ComponentRegistry, CoreContext,
  EventEmitterData, HostElement, LoadComponentRegistry, PlatformApi, ImportedModule } from '../util/interfaces';
import { assignHostContentSlots } from '../core/renderer/slot';
import { attachStyles } from '../core/instance/styles';
import { Build } from '../util/build-conditionals';
import { createDomApi } from '../core/renderer/dom-api';
import { createRendererPatch } from '../core/renderer/patch';
import { createVNodesFromSsr } from '../core/renderer/ssr';
import { createQueueClient } from './queue-client';
import { dashToPascalCase } from '../util/helpers';
import { enableEventListener } from '../core/instance/listeners';
import { ENCAPSULATION, SSR_VNODE_ID } from '../util/constants';
import { h } from '../core/renderer/h';
import { initHostElementConstructor } from '../core/instance/init-host';
import { initStyleTemplate } from '../core/instance/styles';
import { parseComponentLoaders } from '../util/data-parse';
import { proxyController } from '../core/instance/proxy';
import { useScopedCss, useShadowDom } from '../core/renderer/encapsulation';


export function createPlatformClient(Context: CoreContext, App: AppGlobal, win: Window, doc: Document, publicPath: string, hydratedCssClass: string): PlatformApi {
  const registry: ComponentRegistry = { 'html': {} };
  const controllerComponents: {[tag: string]: HostElement} = {};
  const domApi = createDomApi(win, doc);

  // set App Context
  Context.isServer = Context.isPrerender = !(Context.isClient = true);
  Context.window = win;
  Context.location = win.location;
  Context.document = doc;
  Context.publicPath = publicPath;

  if (Build.listener) {
    Context.enableListener = (instance, eventName, enabled, attachTo) => enableEventListener(plt, instance, eventName, enabled, attachTo);
  }

  if (Build.event) {
    Context.emit = (elm: Element, eventName: string, data: EventEmitterData) => domApi.$dispatchEvent(elm, Context.eventNameFn ? Context.eventNameFn(eventName) : eventName, data);
  }

  // add the h() fn to the app's global namespace
  App.h = h;

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
    queue: createQueueClient(win),
    registerComponents: (components: LoadComponentRegistry[]) => (components || []).map(data => parseComponentLoaders(data, registry))
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

  if (Build.ssrClientSide) {
    // if the HTML was generated from SSR
    // then let's walk the tree and generate vnodes out of the data
    createVNodesFromSsr(domApi, rootElm);
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

    if (!globalDefined[cmpMeta.tagNameMeta]) {
      // keep an array of all the defined components, useful for external frameworks
      globalDefined[cmpMeta.tagNameMeta] = true;

      // initialize the members on the host element prototype
      initHostElementConstructor(plt, cmpMeta, HostElementConstructor.prototype, hydratedCssClass);

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

          // set the array of all the attributes to keep an eye on
          // https://www.youtube.com/watch?v=RBs21CFBALI
          HostElementConstructor.observedAttributes = observedAttributes;
        }
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
      const bundleId = (cmpMeta.bundleIds[modeName] || (cmpMeta.bundleIds as any))[0];
      const url = publicPath + bundleId + ((useScopedCss(domApi.$supportsShadowDom, cmpMeta) ? '.sc' : '') + '.js');

      // dynamic es module import() => woot!
      __import(url).then(importedModule => {

        // async loading of the module is done
        if (!cmpMeta.componentConstructor) {
          // we haven't initialized the component module yet
          // get the component constructor from the module
          cmpMeta.componentConstructor = importedModule[dashToPascalCase(cmpMeta.tagNameMeta)];
        }

        if (Build.styles) {
          // initialize this components styles
          // it is possible for the same component to have difficult styles applied in the same app
          initStyleTemplate(domApi, cmpMeta.componentConstructor);
        }

        // bundle all loaded up, let's continue
        cb();

      }).catch(err => console.error(err));
    }
  }

  if (Build.styles) {
    plt.attachStyles = attachStyles;
  }

  return plt;
}


declare var __import: (url: string) => Promise<ImportedModule>;
