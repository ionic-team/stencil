import { assignHostContentSlots } from '../renderer/slot';
import { BundleCallbacks, Component, ComponentMeta, ComponentRegistry,
  ConfigApi, DomControllerApi, DomApi, HostElement,
  IonicGlobal, LoadComponentData, QueueApi, PlatformApi } from '../../util/interfaces';
import { createRenderer } from '../renderer/patch';
import { h } from '../renderer/h';
import { isDef } from '../../util/helpers';
import { initInjectedIonic } from './ionic-client';
import { PRIORITY_LOW } from '../../util/constants';
import { initHostConstructor } from '../instance/init';
import { parseComponentModeData, parseModeName, parseProp } from '../../util/data-parse';


export function createPlatformClient(IonicGbl: IonicGlobal, win: Window, domApi: DomApi, config: ConfigApi, queue: QueueApi, dom: DomControllerApi): PlatformApi {
  const registry: ComponentRegistry = {};
  const loadedBundles: {[bundleId: string]: boolean} = {};
  const bundleCallbacks: BundleCallbacks = {};
  const activeJsonRequests: {[url: string]: boolean} = {};
  const moduleImports = {};
  const hasNativeShadowDom = !((<any>win).ShadyDOM && (<any>win).ShadyDOM.inUse);

  const plt: PlatformApi = {
    registerComponents,
    defineComponent,
    getComponentMeta,
    loadBundle,
    config,
    queue,
    collectHostContent,
    getMode,
    attachStyles
  };

  plt.render = createRenderer(plt, domApi);


  function loadBundle(bundleId: string, priority: number, cb: Function): void {
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
      const url = `${IonicGbl.staticDir}bundles/ionic.${bundleId}.js`;

      if (!activeJsonRequests[url]) {
        // not already actively requesting this url
        // let's kick off the request

        // remember that we're now actively requesting this url
        activeJsonRequests[url] = true;

        if (priority === PRIORITY_LOW) {
          // low priority which means its ok to load this behind
          // UI components, for example: gestures, menu
          // kick off the request in a requestIdleCallback
          (<any>win).requestIdleCallback(() => {
            jsonp(url);
          }, { timeout: 2000 });

        } else {
          // high priority component (normal UI components)
          jsonp(url);
        }
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
      scriptElm.parentNode.removeChild(scriptElm);

      // remove from our list of active requests
      delete activeJsonRequests[url];
    }

    // add script completed listener to this script element
    scriptElm.onerror = scriptElm.onload = onScriptComplete;

    // inject a script tag in the head
    // kick off the actual request
    domApi.$appendChild(domApi.$head, scriptElm);
  }


  function getMode(elm: HostElement): string {
    // first let's see if they set the mode directly on the property
    let value = (<any>elm).mode;
    if (isDef(value)) {
      return value;
    }

    // next let's see if they set the mode on the elements attribute
    value = domApi.$getAttribute(elm, 'mode');
    if (isDef(value)) {
      return value;
    }

    // ok fine, let's just get the values from the config
    return config.get('mode', 'md');
  }


  function attachStyles(cmpMeta: ComponentMeta, elm: HostElement, instance: Component) {
    if (cmpMeta.isShadowMeta) {
      // cool, this component should use shadow dom
      elm._root = elm.attachShadow({ mode: 'open' });
    }

    // look up which component mode this instance should use
    // if a mode isn't found then check if there's a default
    const cmpMode = cmpMeta.modesMeta[instance.mode] || cmpMeta.modesMeta['default'];

    if (cmpMode && cmpMode.styles) {
      // cool, we found the mode for this component
      // and this mode has styles :)
      let styleElm: HTMLStyleElement;

      if (cmpMeta.isShadowMeta && hasNativeShadowDom) {
        // this component uses the shadow dom
        // and this browser supports the shadow dom natively
        // attach our styles to the root
        styleElm = domApi.$createElement('style');
        styleElm.innerHTML = cmpMode.styles;
        domApi.$appendChild(elm._root, styleElm);

      } else {
        // this component does not use the shadow dom
        // or this browser does not support shadow dom
        const cmpModeId = `${cmpMeta.tagNameMeta}.${instance.mode}`;

        // climb up the ancestors looking to see if this element
        // is within another component with a shadow root
        let node: any = elm;
        let hostRoot: any = domApi.$head;

        while (node = node.parentNode) {
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
                styleElm.innerHTML = cmpMode.styles + styleElm.innerHTML;

              } else {
                styleElm = domApi.$createElement('style');
                styleElm.innerHTML = cmpMode.styles;
                domApi.$insertBefore(hostRoot, styleElm, hostRoot.firstChild);
              }
            }

            // the styles are added to this shadow root, no need to continue
            return;
          }
        }

        // this component is not within a parent shadow root
        // so attach the styles to document.head
        hostRoot._css = hostRoot._css || {};
        if (!hostRoot._css[cmpModeId]) {
          // only attach the styles if we haven't already done so for this host element
          hostRoot._css[cmpModeId] = true;

          // prepend the styles to the head, above of existing styles
          styleElm = domApi.$createElement('style');
          styleElm.innerHTML = cmpMode.styles;
          styleElm.dataset['cmp'] = cmpModeId;
          domApi.$insertBefore(hostRoot, styleElm, hostRoot.firstChild);
        }
      }

      // now that the styles are the dom, there's no need
      // to keep its JS string counterpart in memory
      cmpMode.styles = null;
    }
  }


  function registerComponents(components: LoadComponentData[]) {
    // this is the part that just registers the minimal amount about each
    // component, basically its tag, modes and observed attributes

    return components.map(data => {
      const cmpMeta: ComponentMeta = registry[data[0].toUpperCase()] = {
        tagNameMeta: data[0],
        modesMeta: {},
        propsMeta: [
          // every component defaults to always have
          // the mode and color properties
          // but only watch the color attribute
          { propName: 'color', attribName: 'color' },
          { propName: 'mode' },
        ]
      };

      // copy over the map of the modes and bundle ids
      // parse the mode codes to names: "1" becomes "ios"
      Object.keys(data[1]).forEach(modeCode => {
        cmpMeta.modesMeta[parseModeName(modeCode)] = {
          bundleId: data[1][modeCode]
        };
      });

      if (data[2]) {
        cmpMeta.propsMeta = cmpMeta.propsMeta.concat(data[2].map(parseProp));
      }

      // priority
      cmpMeta.priorityMeta = data[3];

      return cmpMeta;
    });
  }


  function defineComponent(cmpMeta: ComponentMeta, HostElementConstructor: any) {
    registry[cmpMeta.tagNameMeta.toUpperCase()] = cmpMeta;

    initHostConstructor(plt, HostElementConstructor.prototype);

    HostElementConstructor.observedAttributes = getObservedAttributes(cmpMeta);

    win.customElements.define(cmpMeta.tagNameMeta, HostElementConstructor);
  }

  function getObservedAttributes(cmpMeta: ComponentMeta) {
    return cmpMeta.propsMeta.filter(p => p.attribName).map(p => p.attribName);
  }

  function getComponentMeta(elm: Element) {
    return registry[elm.tagName];
  }

  function collectHostContent(elm: HostElement, validNamedSlots: string[]) {
    assignHostContentSlots(domApi, elm, validNamedSlots);
  }


  const injectedIonic = initInjectedIonic(IonicGbl, win, domApi, plt, config, queue, dom);


  IonicGbl.defineComponents = function defineComponents(coreVersion, bundleId, importFn) {
    coreVersion;
    var args = arguments;

    // import component function
    // inject ionic globals
    importFn(moduleImports, h, injectedIonic);

    for (var i = 3; i < args.length; i++) {
      // first arg is core version
      // second arg is the bundleId
      // third arg is the importFn
      // each arg after that is a component/mode
      parseComponentModeData(registry, moduleImports, args[i]);

      // fire off all the callbacks waiting on this bundle to load
      var callbacks = bundleCallbacks[bundleId];
      if (callbacks) {
        for (var j = 0, jlen = callbacks.length; j < jlen; j++) {
          callbacks[j]();
        }
        delete bundleCallbacks[bundleId];
      }

      // remember that we've already loaded this bundle
      loadedBundles[bundleId] = true;
    }
  };

  return plt;
}
