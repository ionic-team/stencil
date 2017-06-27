import { assignHostContentSlots, createVNodesFromSsr } from '../renderer/slot';
import { BundleCallbacks, Component, ComponentMeta, ComponentRegistry,
  ConfigApi, DomControllerApi, DomApi, HostElement, GlobalNamespace,
  ListenOptions, LoadComponentMeta, QueueApi, PlatformApi } from '../../util/interfaces';
import { BUNDLE_ID, SSR_VNODE_ID, STYLES } from '../../util/constants';
import { createRenderer } from '../renderer/patch';
import { getMode } from '../platform/mode';
import { h, t } from '../renderer/h';
import { isString } from '../../util/helpers';
import { initHostConstructor } from '../instance/init';
import { initGlobal } from './global-client';
import { parseComponentMeta } from '../../util/data-parse';


export function createPlatformClient(Gbl: GlobalNamespace, win: Window, domApi: DomApi, config: ConfigApi, domCtrl: DomControllerApi, queue: QueueApi, staticDir: string, loadAnimations: boolean): PlatformApi {
  const registry: ComponentRegistry = { 'HTML': {} };
  const moduleImports: {[tag: string]: any} = {};
  const loadedBundles: {[bundleId: string]: boolean} = {};
  const bundleCallbacks: BundleCallbacks = {};
  const activeJsonRequests: {[url: string]: boolean} = {};
  const hasNativeShadowDom = !((<any>win).ShadyDOM && (<any>win).ShadyDOM.inUse);
  let initRenderStyles: string[] = [];


  // create the platform api which will be passed around for external use
  const plt: PlatformApi = {
    registerComponents,
    defineComponent,
    getComponentMeta,
    loadBundle,
    config,
    queue,
    connectHostElement,
    attachStyles,
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
    appendStylesToHead(initRenderStyles);
    initRenderStyles = null;

    // kick off loading the auxiliary code, which has stuff that wasn't
    // needed for the initial paint, such as animation code
    loadAnimations && queue.add(() => {
      jsonp(staticDir + 'ionic.animation.js');
    });
  };


  // if the HTML was generated from SSR
  // then let's walk the tree and generate vnodes out of the data
  createVNodesFromSsr(domApi, rootElm);


  function attachStyles(cmpMeta: ComponentMeta, elm: HostElement, instance: Component) {
    if (cmpMeta.isShadowMeta) {
      // cool, this component should use shadow dom
      elm._root = elm.attachShadow({ mode: 'open' });
    }

    // look up which component mode this instance should use
    // if a mode isn't found then check if there's a default
    const cmpMode = cmpMeta.modesMeta[instance.mode] || cmpMeta.modesMeta.$;

    if (cmpMode && isString(cmpMode[STYLES])) {
      // cool, we found the mode for this component
      // and this mode has styles :)
      let styleElm: HTMLStyleElement;

      if (cmpMeta.isShadowMeta && hasNativeShadowDom) {
        // this component uses the shadow dom
        // and this browser supports the shadow dom natively
        // attach our styles to the root
        styleElm = domApi.$createElement('style');
        styleElm.innerHTML = cmpMode[STYLES];
        domApi.$appendChild(elm._root, styleElm);

      } else {
        // this component does not use the shadow dom
        // or this browser does not support shadow dom
        const cmpModeId = `${cmpMeta.tagNameMeta}.${instance.mode}`;

        // climb up the ancestors looking to see if this element
        // is within another component with a shadow root
        let node: any = elm;
        let hostRoot: any;

        while (node = domApi.$parentNode(node)) {
          if (node.host && node.host.shadowRoot) {
            // this element is within another shadow root
            // so instead of attaching the styles to the head
            // we need to attach the styles to this shadow root
            hostRoot = node.host.shadowRoot;
            hostRoot._css = hostRoot._css || {};

            if (!hostRoot._css[cmpModeId]) {
              // only attach the styles if we haven't already done so for this host element
              hostRoot._css[cmpModeId] = true;

              styleElm = hostRoot.querySelector('style');
              if (styleElm) {
                styleElm.innerHTML = cmpMode[STYLES] + styleElm.innerHTML;

              } else {
                styleElm = domApi.$createElement('style');
                styleElm.innerHTML = cmpMode[STYLES];
                domApi.$insertBefore(hostRoot, styleElm, hostRoot.firstChild);
              }
            }

            // the styles are added to this shadow root, no need to continue
            break;
          }
        }
      }
    }
  }

  function getObservedAttributes(cmpMeta: ComponentMeta) {
    return cmpMeta.propsMeta.filter(p => p.attribName).map(p => p.attribName);
  }

  function getComponentMeta(elm: Element) {
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

  function appendBundleStyles(bundleCmpMeta: ComponentMeta[]) {
    if (initRenderStyles) {
      collectStyles(bundleCmpMeta, initRenderStyles);

    } else {
      queue.add(() => {
        appendStylesToHead(collectStyles(bundleCmpMeta, []));
      });
    }
  }


  function appendStylesToHead(styles: string[]) {
    if (styles.length) {
      const styleElm = domApi.$createElement('style');
      styleElm.innerHTML = styles.join('');
      domApi.$insertBefore(domApi.$head, styleElm, domApi.$head.firstChild);
    }
  }


  function collectStyles(bundleCmpMeta: ComponentMeta[], appendTo: string[]) {
    for (var i = 0; i < bundleCmpMeta.length; i++) {
      var cmpMeta = bundleCmpMeta[i];
      if (cmpMeta.modesMeta) {
        let modeNames = Object.keys(cmpMeta.modesMeta);
        for (var j = 0; j < modeNames.length; j++) {
          if (isString(cmpMeta.modesMeta[modeNames[j]][STYLES])) {
            appendTo.push(cmpMeta.modesMeta[modeNames[j]][STYLES]);
          }
        }
      }
    }
    return appendTo;
  }


  function registerComponents(components: LoadComponentMeta[]) {
    // this is the part that just registers the minimal amount of data
    return components.map(data => parseComponentMeta(registry, moduleImports, data));
  }


  function defineComponent(cmpMeta: ComponentMeta, HostElementConstructor: any) {
    initHostConstructor(plt, HostElementConstructor.prototype);

    HostElementConstructor.observedAttributes = getObservedAttributes(cmpMeta);

    win.customElements.define(cmpMeta.tagNameMeta, HostElementConstructor);
  }


  Gbl.defineComponents = function defineComponents(coreVersion, bundleId, importFn) {
    coreVersion;
    const args = arguments;
    const bundleCmpMeta: ComponentMeta[] = [];

    // import component function
    // inject globals
    importFn(moduleImports, h, t, injectedGlobal);

    for (var i = 3; i < args.length; i++) {
      bundleCmpMeta.push(
        parseComponentMeta(registry, moduleImports, args[i])
      );
    }

    // append all of the bundle's styles to the document in one go
    appendBundleStyles(bundleCmpMeta);

    // fire off all the callbacks waiting on this bundle to load
    var callbacks = bundleCallbacks[bundleId];
    if (callbacks) {
      for (i = 0; i < callbacks.length; i++) {
        callbacks[i]();
      }
      delete bundleCallbacks[bundleId];
    }

    // remember that we've already loaded this bundle
    loadedBundles[bundleId] = true;
  };


  function loadBundle(cmpMeta: ComponentMeta, elm: HostElement, cb: Function): void {
    // get the mode the element which is loading
    // if there is no mode, then use "default"
    const cmpMode = cmpMeta.modesMeta[getMode(domApi, config, elm)] || cmpMeta.modesMeta.$;
    const bundleId = cmpMode[BUNDLE_ID];

    if (loadedBundles[bundleId]) {
      // we've already loaded this bundle
      cb();

    } else {
      // never seen this bundle before, let's start the request
      // and add it to the bundle callbacks to fire when it's loaded
      if (bundleCallbacks[bundleId]) {
        bundleCallbacks[bundleId].push(cb);
      } else {
        bundleCallbacks[bundleId] = [cb];
      }

      // create the url we'll be requesting
      const url = `${staticDir}bundles/ionic.${bundleId}.js`;

      if (!activeJsonRequests[url]) {
        // not already actively requesting this url
        // let's kick off the request

        // remember that we're now actively requesting this url
        activeJsonRequests[url] = true;

        jsonp(url);
      }
    }
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
      delete activeJsonRequests[url];
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
