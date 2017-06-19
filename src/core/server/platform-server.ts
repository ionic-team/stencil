import { assignHostContentSlots } from '../renderer/slot';
import { attributeChangedCallback } from '../instance/attribute-changed';
import { BundleCallbacks, Component, ComponentMeta, ComponentRegistry, ConfigApi,
  DomApi, DomControllerApi, HostElement, GlobalNamespace, PlatformApi, StencilSystem } from '../../util/interfaces';
import { createRenderer } from '../renderer/patch';
import { generateGlobalContext } from './global-context';
import { h, t } from '../renderer/h';
import { initGlobal } from './global-server';
import { isDef, isString } from '../../util/helpers';
import { parseComponentMeta } from '../../util/data-parse';
import { STYLES } from '../../util/constants';


export function createPlatformServer(sys: StencilSystem, Gbl: GlobalNamespace, win: Window, domApi: DomApi, config: ConfigApi, dom: DomControllerApi): PlatformApi {
  const registry: ComponentRegistry = {};
  const moduleImports: any = {};
  const loadedBundles: {[bundleId: string]: boolean} = {};
  const bundleCallbacks: BundleCallbacks = {};
  const activeFileReads: {[url: string]: boolean} = {};
  const css: {[cmpModeId: string]: string} = {};
  let ssrIds = 0;

  const plt: PlatformApi = {
    defineComponent,
    getComponentMeta,
    loadBundle,
    collectHostContent,
    config,
    queue: Gbl.QueueCtrl,
    getMode,
    attachStyles,
    tmpDisconnected: false,
    css: css,
    isServer: true,
    appLoaded
  };

  plt.render = createRenderer(plt, domApi);

  const injectedGlobal = initGlobal(config, dom);

  // generate a sandboxed context
  const context = generateGlobalContext(win, Gbl);
  sys.vm.createContext(context);


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

  function attachStyles(cmpMeta: ComponentMeta, elm: any, instance: Component) {
    domApi.$setAttribute(elm, 'ssr', ssrIds++);

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

  function collectHostContent(elm: HostElement, slotMeta: number) {
    assignHostContentSlots(domApi, elm, slotMeta);
  }

  function appLoaded() {
    // let it be know, we have loaded
    plt.onAppLoad && plt.onAppLoad(plt.appRoot);
  }

  function defineComponent(cmpMeta: ComponentMeta) {
    registry[cmpMeta.tagNameMeta.toUpperCase()] = cmpMeta;
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

    // append all of the bundle's styles to the document in one go
    // appendBundleStyles(bundleCmpMeta);

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


  function loadBundle(bundleId: string, cb: Function): void {
    if (loadedBundles[bundleId]) {
      // we've already loaded this bundle
      cb();

    } else {
      // never seen this bundle before, let's start the request
      // and add it to the bundle callbacks to fire when it's loaded
      (bundleCallbacks[bundleId] = bundleCallbacks[bundleId] || []).push(cb);

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
