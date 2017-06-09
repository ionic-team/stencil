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


export function createPlatformClient(IonicGbl: IonicGlobal, win: Window, domApi: DomApi, config: ConfigApi, queue: QueueApi, dom: DomControllerApi, staticDir: string): PlatformApi {
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
    attachStyles,
    appLoaded
  };

  plt.render = createRenderer(plt, domApi);


  function loadBundle(bundleId: string, priority: number, cb: Function): void {
    if (loadedBundles[bundleId]) {
      // we've already loaded this bundle
      cb();

    } else {
      // never seen this bundle before, let's start the request
      // and add it to the bundle callbacks to fire when it's loaded
      (bundleCallbacks[bundleId] = bundleCallbacks[bundleId] || []).push(cb);

      // create the url we'll be requesting
      const url = `${staticDir}bundles/ionic.${bundleId}.js`;

      if (!activeJsonRequests[url]) {
        // not already actively requesting this url
        // let's kick off the request

        // remember that we're now actively requesting this url
        activeJsonRequests[url] = true;

        if (priority === PRIORITY_LOW) {
          // low priority which means its ok to load this behind
          // UI components, for example: gestures, menu
          // kick off the request in a requestIdleCallback
          queue.add(() => {
            jsonp(url);
          }, PRIORITY_LOW);

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
        let hostRoot: any;

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
            break;
          }
        }
      }
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

  let initAppStyles: string[] = [];

  function appendBundleStyles(bundleCmpMeta: ComponentMeta[]) {
    const styles = bundleCmpMeta.map(getCmpMetaStyle);

    if (plt.hasAppLoaded) {
      queue.add(() => {
        appendStylesToHead(styles);
      });

    } else {
      initAppStyles = initAppStyles.concat(styles);
    }
  }


  function appendStylesToHead(styles: string[]) {
    const styleElm = domApi.$createElement('style');
    styleElm.innerHTML = styles.join('');
    domApi.$insertBefore(domApi.$head, styleElm, domApi.$head.firstChild);
  }


  function getCmpMetaStyle(cmpMeta: ComponentMeta) {
    if (cmpMeta.modesMeta) {
      return Object.keys(cmpMeta.modesMeta).map(m => cmpMeta.modesMeta[m].styles).join('');
    }
    return '';
  }

  const injectedIonic = initInjectedIonic(IonicGbl, win, domApi, plt, config, queue, dom);


  function appLoaded() {
    appendStylesToHead(initAppStyles);
    initAppStyles = null;

    // let it be know, we have loaded
    injectedIonic.emit(plt.appRoot.$instance, 'ionLoad');

    // kick off loading the auxiliary code, which has stuff that wasn't
    // needed for the initial paint, such as animation code
    queue.add(() => {
      jsonp(staticDir + 'ionic.animation.js');
    });
  }


  IonicGbl.defineComponents = function defineComponents(coreVersion, bundleId, importFn) {
    coreVersion;
    const args = arguments;
    const bundleCmpMeta: ComponentMeta[] = [];
    let i = 0;

    // import component function
    // inject ionic globals
    importFn(moduleImports, h, injectedIonic);

    for (i = 3; i < args.length; i++) {
      // first arg is core version
      // second arg is the bundleId
      // third arg is the importFn
      // each arg after that is a component/mode
      bundleCmpMeta.push(
        parseComponentModeData(registry, moduleImports, args[i])
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

  return plt;
}
