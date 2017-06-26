import { assignHostContentSlots } from '../renderer/slot';
import { attributeChangedCallback } from '../instance/attribute-changed';
import { BundleCallbacks, Component, ComponentMeta, ComponentRegistry, ConfigApi,
  DomApi, DomControllerApi, GlobalNamespace, HostElement,
  PlatformApi, StencilSystem } from '../../util/interfaces';
import { BUNDLE_ID, STYLES } from '../../util/constants';
import { createRenderer } from '../renderer/patch';
import { generateGlobalContext } from './global-context';
import { getMode } from '../platform/mode';
import { h, t } from '../renderer/h';
import { initGlobal } from './global-server';
import { isString } from '../../util/helpers';
import { parseComponentMeta } from '../../util/data-parse';


export function createPlatformServer(sys: StencilSystem, Gbl: GlobalNamespace, win: Window, domApi: DomApi, config: ConfigApi, dom: DomControllerApi): PlatformApi {
  const registry: ComponentRegistry = { 'HTML': {} };
  const moduleImports: {[tag: string]: any} = {};
  const loadedBundles: {[bundleId: string]: boolean} = {};
  const bundleCallbacks: BundleCallbacks = {};
  const activeFileReads: {[url: string]: boolean} = {};
  const css: {[componentTag: string]: string} = {};


  const plt: PlatformApi = {
    defineComponent,
    getComponentMeta,
    loadBundle,
    connectHostElement,
    config,
    queue: Gbl.QueueCtrl,
    attachStyles,
    tmpDisconnected: false,
    isServer: true
  };

  plt.render = createRenderer(plt, domApi);

  const injectedGlobal = initGlobal(config, dom);

  // generate a sandboxed context
  const context = generateGlobalContext(win, Gbl);
  sys.vm.createContext(context);


  // setup the root node of all things
  // which is the mighty <html> tag
  const rootNode = <HostElement>domApi.$documentElement;
  rootNode._activelyLoadingChildren = [];
  rootNode._initLoad = function appLoadedCallback() {
    plt.onAppLoad && plt.onAppLoad(rootNode, Object.keys(css).sort().map(tag => css[tag]).join(''));
  };


  function attachStyles(cmpMeta: ComponentMeta, elm: any, instance: Component) {
    cmpMeta.propsMeta.forEach(prop => {
      attributeChangedCallback(plt, elm, prop.attribName, null, domApi.$getAttribute(elm, prop.attribName));
    });

    if (cmpMeta.isShadowMeta) {
      // cannot use shadow dom server side :(
      return;
    }

    // look up which component mode this instance should use
    // if a mode isn't found then check if there's a default
    const cmpMode = cmpMeta.modesMeta[instance.mode] || cmpMeta.modesMeta.$;

    if (cmpMode && isString(cmpMode[STYLES])) {
      // this component mode has styles
      const cmpModeId = `${cmpMeta.tagNameMeta}.${instance.mode}`;

      // this component is not within a parent shadow root
      // so attach the styles to document.head
      if (!css[cmpModeId]) {
        // only attach the styles if we haven't already done so for this host element
        css[cmpModeId] = cmpMode[STYLES];
      }
    }
  }

  function getComponentMeta(elm: Element) {
    return registry[elm.tagName];
  }

  function connectHostElement(elm: HostElement, slotMeta: number) {
    assignHostContentSlots(domApi, elm, slotMeta);
  }

  function defineComponent(cmpMeta: ComponentMeta) {
    const tagName = cmpMeta.tagNameMeta.toUpperCase();

    registry[tagName] = cmpMeta;

    if (cmpMeta.componentModuleMeta) {
      // for unit testing
      moduleImports[tagName] = cmpMeta.componentModuleMeta;
    }
  }


  Gbl.defineComponents = function defineComponents(coreVersion, bundleId, importFn) {
    coreVersion;
    const args = arguments;

    // import component function
    // inject globals
    importFn(moduleImports, h, t, injectedGlobal);

    for (var i = 3; i < args.length; i++) {
      parseComponentMeta(registry, moduleImports, args[i]);
    }

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
    if (cmpMeta.componentModuleMeta) {
      // we already have the module loaded
      // (this is probably a unit test)
      cb();
      return;
    }

    const cmpMode = cmpMeta.modesMeta[getMode(domApi, config, elm)] || cmpMeta.modesMeta.$;
    const bundleId = cmpMode[BUNDLE_ID];

    if (loadedBundles[bundleId]) {
      // sweet, we've already loaded this bundle
      cb();

    } else {
      // never seen this bundle before, let's start the request
      // and add it to the bundle callbacks to fire when it's loaded
      if (bundleCallbacks[bundleId]) {
        bundleCallbacks[bundleId].push(cb);
      } else {
        bundleCallbacks[bundleId] = [cb];
      }

      // create the filePath we'll be reading
      const filePath = sys.path.join(Gbl.staticDir, `bundles`, `ionic.${bundleId}.js`);

      if (!activeFileReads[filePath]) {
        // not already actively reading this file
        // let's kick off the request

        // remember that we're now actively requesting this url
        activeFileReads[filePath] = true;

        sys.fs.readFile(filePath, 'utf-8', (err, code) => {
          if (err) {
            console.error(`loadBundle: ${bundleId}, ${err}`);
            throw err;

          } else {
            // run the code in this sandboxed context
            sys.vm.runInContext(code, context, { timeout: 5000 });
          }

          delete activeFileReads[filePath];
        });

      }
    }
  }

  return plt;
}
