import { assignHostContentSlots, createVNodesFromSsr } from '../renderer/slot';
import { BUNDLES_DIR, SSR_VNODE_ID } from '../../util/constants';
import { ComponentMeta, ComponentRegistry, ConfigApi, DomControllerApi,
  DomApi, HostElement, ProjectNamespace, ListenOptions, LoadComponentRegistry,
  ModuleCallbacks, QueueApi, PlatformApi } from '../../util/interfaces';
import { createRenderer } from '../renderer/patch';
import { getMode } from '../platform/mode';
import { h, t } from '../renderer/h';
import { initHostConstructor } from '../instance/init';
import { initGlobal } from './global-client';
import { parseComponentMeta, parseComponentRegistry } from '../../util/data-parse';


export function createPlatformClient(Gbl: ProjectNamespace, win: Window, domApi: DomApi, config: ConfigApi, domCtrl: DomControllerApi, queue: QueueApi, staticDir: string, loadAnimations: boolean): PlatformApi {
  const registry: ComponentRegistry = { 'HTML': {} };
  const moduleImports: {[tag: string]: any} = {};
  const moduleCallbacks: ModuleCallbacks = {};
  const loadedModules: {[moduleId: string]: boolean} = {};
  const pendingModuleRequests: {[url: string]: boolean} = {};


  // create the platform api which will be passed around for external use
  const plt: PlatformApi = {
    registerComponents,
    defineComponent,
    getComponentMeta,
    loadBundle,
    config,
    queue,
    connectHostElement,
    getEventOptions
  };


  // create the renderer that will be used
  plt.render = createRenderer(plt, domApi);


  // create the global which will be injected into the user's instances
  const injectedGlobal = initGlobal(Gbl, win, domApi, plt, config, domCtrl);


  // setup the root element which is the mighty <html> tag
  // the <html> has the final say of when the app has loaded
  const rootElm = <HostElement>domApi.$documentElement;
  rootElm._activelyLoadingChildren = [];
  rootElm._initLoad = function appLoadedCallback() {
    // this will fire when all components have finished loaded
    rootElm._hasLoaded = true;

    // kick off loading the auxiliary code, which has stuff that wasn't
    // needed for the initial paint, such as the animation library
    loadAnimations && queue.add(() => {
      jsonp(staticDir + 'ionic.animation.js');
    });
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
    HostElementConstructor.observedAttributes = cmpMeta.propsMeta.filter(p => p.attribName).map(p => p.attribName);

    // define the custom element
    win.customElements.define(cmpMeta.tagNameMeta.toLowerCase(), HostElementConstructor);
  }


  Gbl.defineComponents = function defineComponents(coreVersion, moduleId, importFn) {
    coreVersion;
    const args = arguments;

    // import component function
    // inject globals
    importFn(moduleImports, h, t, injectedGlobal);

    for (var i = 3; i < args.length; i++) {
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

      // create the url we'll be requesting
      const url = getBundlePath(`${moduleId}.js`);

      if (!pendingModuleRequests[url]) {
        // not already actively requesting this url
        // remember that we're now actively requesting this url
        pendingModuleRequests[url] = true;

        // let's kick off the module request
        jsonp(url);
      }

      // we also need to load the css file in the head
      const styleId = cmpMeta.styleIds[getMode(domApi, config, elm)] || cmpMeta.styleIds.$;
      if (styleId && !loadedModules[styleId]) {
        // this style hasn't been added to the head yet
        loadedModules[styleId] = true;

        // append this link element to the head, which starts the request for the file
        const linkElm = domApi.$createElement('link');
        linkElm.href = getBundlePath(`${styleId}.css`);
        linkElm.rel = 'stylesheet';
        domApi.$insertBefore(domApi.$head, linkElm, domApi.$head.firstChild);
      }
    }
  }


  function getBundlePath(fileName: string) {
    return `${staticDir}${BUNDLES_DIR}/${Gbl.ns.toLowerCase()}/${fileName}`;
  }


  function jsonp(url: string) {
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


  // test if this browser supports event options or not
  let supportsEventOptions = false;
  try {
    win.addEventListener('evopt', null,
      Object.defineProperty({}, 'passive', {
        get: () => {
          supportsEventOptions = true;
        }
      })
    );
  } catch (e) {}

  function getEventOptions(opts?: ListenOptions) {
    return supportsEventOptions ? {
        'capture': !!(opts && opts.capture),
        'passive': !(opts && opts.passive === false)
      } : !!(opts && opts.capture);
  }

  return plt;
}
