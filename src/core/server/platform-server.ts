import { assignHostContentSlots } from '../renderer/slot';
import { attributeChangedCallback } from '../instance/attribute-changed';
import { BundleCallbacks, Component, ComponentMeta, ComponentRegistry, ConfigApi,
  DomApi, DomControllerApi, HostElement, IonicGlobal, LoadComponentData, PlatformApi } from '../../util/interfaces';
import { createRenderer } from '../renderer/patch';
import { generateGlobalContext } from './dom/global-context';
import { initInjectedIonic } from './ionic-server';
import { isDef } from '../../util/helpers';
import { parseModeName, parseProp } from '../../util/data-parse';
import * as fs from 'fs';
import * as path from 'path';
import * as vm from 'vm';



export function createPlatformServer(IonicGbl: IonicGlobal, win: Window, domApi: DomApi, config: ConfigApi, dom: DomControllerApi): PlatformApi {
  const registry: ComponentRegistry = {};
  const loadedBundles: {[bundleId: string]: boolean} = {};
  const bundleCallbacks: BundleCallbacks = {};
  const activeFileReads: {[url: string]: boolean} = {};
  const css: {[cmpModeId: string]: string} = {};
  initInjectedIonic(config, dom);
  let loadResolve: Function;

  const plt: PlatformApi = {
    registerComponents,
    defineComponent,
    getComponentMeta,
    loadBundle,
    collectHostContent,
    config,
    queue: IonicGbl.QueueCtrl,
    getMode,
    attachStyles,
    tmpDisconnected: false,
    css: css,
    isServer: true,
    appLoaded,
    onReady: new Promise(resolve => {
      loadResolve = resolve;
    })
  };

  // generate a sandboxed context
  const context = generateGlobalContext(win, IonicGbl);
  vm.createContext(context);

  // IonicGbl.defineComponents = function defineComponents(coreVersion, bundleId, importFn) {
  //   coreVersion;
  //   var args = arguments;

  //   // import component function
  //   // inject ionic globals
  //   importFn(moduleImports, h, injectedIonic);

  //   for (var i = 3; i < args.length; i++) {
  //     // first arg is core version
  //     // second arg is the bundleId
  //     // third arg is the importFn
  //     // each arg after that is a component/mode
  //     var cmpModeData: ComponentModeData = args[i];

  //     parseComponentModeData(registry, moduleImports, cmpModeData);

  //     if (cmpModeData[1]) {
  //       registry[cmpModeData[0]].props = registry[cmpModeData[0]].props.concat(cmpModeData[1].map(parseProp));
  //     }

  //     // fire off all the callbacks waiting on this bundle to load
  //     var callbacks = bundleCallbacks[bundleId];
  //     if (callbacks) {
  //       for (var j = 0, jlen = callbacks.length; j < jlen; j++) {
  //         callbacks[j]();
  //       }
  //       delete bundleCallbacks[bundleId];
  //     }

  //     // remember that we've already loaded this bundle
  //     loadedBundles[bundleId] = true;
  //   }
  // };


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

      // create the filePath we'll be reading
      const filePath = path.join(IonicGbl.staticDir, `bundles`, `ionic.${bundleId}.js`);

      if (!activeFileReads[filePath]) {
        // not already actively requesting this url
        // let's kick off the request

        // remember that we're now actively requesting this url
        activeFileReads[filePath] = true;

        // priority doesn't matter on the server
        priority;

        fs.readFile(filePath, 'utf-8', (err, code) => {
          if (err) {
            console.error(`loadBundle: ${bundleId}, ${err}`);
            err.stack && console.error(err.stack);

          } else {
            // run the code in this sandboxed context
            vm.runInContext(code, context, { timeout: 5000 });
          }

          delete activeFileReads[filePath];
        });

      }
    }
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

  function attachStyles(cmpMeta: ComponentMeta, elm: any, instance: Component) {
    elm.classList.add('ssr');

    cmpMeta.propsMeta.forEach(prop => {
      attributeChangedCallback(plt, elm, prop.attribName, null, domApi.$getAttribute(elm, prop.attribName));
    });

    if (cmpMeta.isShadowMeta) {
      // cannot use shadow dom server side :(
      return;
    }

    // look up which component mode this instance should use
    // if a mode isn't found then check if there's a default
    const cmpMode = cmpMeta.modesMeta[instance.mode] || cmpMeta.modesMeta['default'];

    if (cmpMode && cmpMode.styles) {
      // this component mode has styles
      const cmpModeId = `${cmpMeta.tagNameMeta}.${instance.mode}`;

      // this component is not within a parent shadow root
      // so attach the styles to document.head
      if (!css[cmpModeId]) {
        // only attach the styles if we haven't already done so for this host element
        css[cmpModeId] = cmpMode.styles;
      }
    }
  }

  function registerComponents(components: LoadComponentData[]): ComponentMeta[] {
    // this is the part that just registers the minimal amount about each
    // component, basically its tag, modes and observed attributes

    return components.map(data => {
      data[0] = data[0].toLowerCase();

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

  function defineComponent(cmpMeta: ComponentMeta) {
    registry[cmpMeta.tagNameMeta.toUpperCase()] = cmpMeta;
  }

  function getComponentMeta(elm: Element) {
    return registry[elm.tagName];
  }

  function collectHostContent(elm: HostElement, validNamedSlots: string[]) {
    elm._hostContentNodes = assignHostContentSlots(domApi, elm, validNamedSlots);
  }

  function appLoaded() {
    // let it be know, we have loaded
    loadResolve();
  }

  plt.render = createRenderer(plt, domApi);

  return plt;
}
