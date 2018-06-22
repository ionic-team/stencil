import * as d from '../declarations';
import { createDomApi } from '../renderer/dom-api';
import { createQueueServer } from './queue-server';
import { createRendererPatch } from '../renderer/vdom/patch';
import { DEFAULT_STYLE_MODE, ENCAPSULATION, RUNTIME_ERROR } from '../util/constants';
import { enableEventListener } from '../core/listeners';
import { fillCmpMetaFromConstructor } from '../util/cmp-meta';
import { getAppBuildDir } from '../compiler/app/app-file-naming';
import { h } from '../renderer/vdom/h';
import { initCoreComponentOnReady } from '../core/component-on-ready';
import { noop } from '../util/helpers';
import { patchDomApi } from './dom-api-server';
import { proxyController } from '../core/proxy-controller';
import { queueUpdate } from '../core/update';
import { toDashCase } from '../util/helpers';


export function createPlatformServer(
  config: d.Config,
  outputTarget: d.OutputTargetWww,
  win: any,
  doc: Document,
  App: d.AppGlobal,
  cmpRegistry: d.ComponentRegistry,
  diagnostics: d.Diagnostic[],
  isPrerender: boolean,
  compilerCtx?: d.CompilerCtx
): d.PlatformApi {
  const loadedBundles: {[bundleId: string]:  d.CjsExports} = {};
  const styles: {[tagName: string]: string} = {};
  const controllerComponents: {[tag: string]: d.HostElement} = {};

  const domApi = createDomApi(App, win, doc);

  // init build context
  compilerCtx = compilerCtx || {};

  // the root <html> element is always the top level registered component
  cmpRegistry = Object.assign({ 'html': {}}, cmpRegistry);

  // initialize Core global object
  const Context: d.CoreContext = {};
  Context.enableListener = (instance, eventName, enabled, attachTo, passive) => enableEventListener(plt, instance, eventName, enabled, attachTo, passive);
  Context.emit = (elm: Element, eventName: string, data: d.EventEmitterData) => domApi.$dispatchEvent(elm, Context.eventNameFn ? Context.eventNameFn(eventName) : eventName, data);
  Context.isClient = false;
  Context.isServer = true;
  Context.isPrerender = isPrerender;
  Context.window = win;
  Context.location = win.location;
  Context.document = doc;

  // add the Core global to the window context
  // Note: "Core" is not on the window context on the client-side
  win.Context = Context;

  // add the h() fn to the app's global namespace
  App.h = h;
  App.Context = Context;

  // add the app's global to the window context
  win[config.namespace] = App;

  const appBuildDir = getAppBuildDir(config, outputTarget);
  Context.resourcesUrl = Context.publicPath = appBuildDir;

  // create the sandboxed context with a new instance of a V8 Context
  // V8 Context provides an isolated global environment
  config.sys.vm.createContext(compilerCtx, outputTarget, win);

  // execute the global scripts (if there are any)
  runGlobalScripts();

  // internal id increment for unique ids
  let ids = 0;

  // create the platform api which is used throughout common core code
  const plt: d.PlatformApi = {
    attachStyles: noop,
    defineComponent,
    domApi,
    emitEvent: Context.emit,
    getComponentMeta,
    getContextItem,
    isDefinedComponent,
    onError,
    nextId: () => config.namespace + (ids++),
    propConnect,
    queue: (Context.queue = createQueueServer()),
    requestBundle: requestBundle,
    tmpDisconnected: false,

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

  // patch dom api like createElement()
  patchDomApi(config, plt, domApi);

  // create the renderer which will be used to patch the vdom
  plt.render = createRendererPatch(plt, domApi);

  // patch the componentOnReady fn
  initCoreComponentOnReady(plt, App);

  // setup the root node of all things
  // which is the mighty <html> tag
  const rootElm = domApi.$documentElement as d.HostElement;
  rootElm['s-ld'] = [];
  rootElm['s-rn'] = true;

  rootElm['s-init'] = function appLoadedCallback() {
    plt.hasLoadedMap.set(rootElm, true);
    appLoaded();
  };

  function appLoaded(failureDiagnostic?: d.Diagnostic) {
    if (plt.hasLoadedMap.has(rootElm) || failureDiagnostic) {
      // the root node has loaded
      // and there are no css files still loading
      const allStyles = Object.keys(styles).map(tagName => styles[tagName]);

      plt.onAppLoad && plt.onAppLoad(rootElm, allStyles, failureDiagnostic);
    }
  }

  function getComponentMeta(elm: Element) {
    // registry tags are always lower-case
    return cmpRegistry[elm.nodeName.toLowerCase()];
  }

  function defineComponent(cmpMeta: d.ComponentMeta) {
    // default mode and color props
    cmpRegistry[cmpMeta.tagNameMeta] = cmpMeta;
  }


  function setLoadedBundle(bundleId: string, value: d.CjsExports) {
    loadedBundles[bundleId] = value;
  }

  function getLoadedBundle(bundleId: string) {
    if (bundleId == null) {
      return null;
    }
    return loadedBundles[bundleId.replace(/^\.\//, '')];
  }

  /**
   * Execute a bundle queue item
   * @param name
   * @param deps
   * @param callback
   */
  function execBundleCallback(name: string, deps: string[], callback: Function) {
    const bundleExports: d.CjsExports = {};

    try {
      callback(bundleExports, ...deps.map(d => getLoadedBundle(d)));
    } catch (e) {
      onError(e, RUNTIME_ERROR.LoadBundleError, null, true);
    }

    // If name is undefined then this callback was fired by component callback
    if (name === undefined) {
      return;
    }

    setLoadedBundle(name, bundleExports);

    // If name contains chunk then this callback was associated with a dependent bundle loading
    // let's add a reference to the constructors on each components metadata
    // each key in moduleImports is a PascalCased tag name
    if (!name.startsWith('chunk')) {
      Object.keys(bundleExports).forEach(pascalCasedTagName => {
        const normalizedTagName = pascalCasedTagName.replace(/-/g, '').toLowerCase();

        const registryTags = Object.keys(cmpRegistry);
        for (let i = 0; i < registryTags.length; i++) {
          const normalizedRegistryTag = registryTags[i].replace(/-/g, '').toLowerCase();

          if (normalizedRegistryTag === normalizedTagName) {
            const cmpMeta = cmpRegistry[toDashCase(pascalCasedTagName)];
            if (cmpMeta) {
              // connect the component's constructor to its metadata
              const componentConstructor = bundleExports[pascalCasedTagName];

              if (!cmpMeta.componentConstructor) {
                fillCmpMetaFromConstructor(componentConstructor, cmpMeta);

                if (!cmpMeta.componentConstructor) {
                  cmpMeta.componentConstructor = componentConstructor;
                }
              }

              if (componentConstructor.style) {
                styles[cmpMeta.tagNameMeta] = componentConstructor.style;
              }
            }
            break;
          }
        }
      });
    }
  }

  /**
   * This function is called anytime a JS file is loaded
   */
  App.loadBundle = function loadBundle(bundleId: string, [, ...dependentsList]: string[], importer: Function) {

    const missingDependents = dependentsList.filter(d => !getLoadedBundle(d));
    missingDependents.forEach(d => {
      const fileName = d.replace('.js', '.es5.js');
      loadFile(fileName);
    });

    execBundleCallback(bundleId, dependentsList, importer);
  };


  function isDefinedComponent(elm: Element) {
    return !!(cmpRegistry[elm.tagName.toLowerCase()]);
  }


  plt.attachStyles = function attachStyles(_domApi, _cmpMeta, _elm) {/**/};


  // This is executed by the component's connected callback.
  function requestBundle(cmpMeta: d.ComponentMeta, elm: d.HostElement) {

    // set the "mode" property
    if (!elm.mode) {
      // looks like mode wasn't set as a property directly yet
      // first check if there's an attribute
      // next check the app's global
      elm.mode = domApi.$getAttribute(elm, 'mode') || Context.mode;
    }

    // It is possible the data was loaded from an outside source like tests
    if (cmpRegistry[cmpMeta.tagNameMeta].componentConstructor) {
      if (cmpRegistry[cmpMeta.tagNameMeta].componentConstructor.style) {
        styles[cmpMeta.tagNameMeta] = cmpRegistry[cmpMeta.tagNameMeta].componentConstructor.style;
      }
      queueUpdate(plt, elm);

    } else {
      const bundleId = (typeof cmpMeta.bundleIds === 'string') ?
        cmpMeta.bundleIds :
        (cmpMeta.bundleIds as d.BundleIds)[elm.mode];

      if (getLoadedBundle(bundleId)) {
        // sweet, we've already loaded this bundle
        if (cmpRegistry[cmpMeta.tagNameMeta].componentConstructor.style) {
          styles[cmpMeta.tagNameMeta] = cmpRegistry[cmpMeta.tagNameMeta].componentConstructor.style;
        }
        queueUpdate(plt, elm);

      } else {
        const fileName = getComponentBundleFilename(cmpMeta, elm.mode);
        loadFile(fileName);
      }
    }
  }

  function loadFile(fileName: string) {
    const jsFilePath = config.sys.path.join(appBuildDir, fileName);
    const jsCode = compilerCtx.fs.readFileSync(jsFilePath);
    config.sys.vm.runInContext(jsCode, win);
  }


  function runGlobalScripts() {
    if (!compilerCtx || !compilerCtx.appFiles || !compilerCtx.appFiles.global) {
      return;
    }

    config.sys.vm.runInContext(compilerCtx.appFiles.global, win);
  }

  function onError(err: Error, type: RUNTIME_ERROR, elm: d.HostElement, appFailure: boolean) {
    const diagnostic: d.Diagnostic = {
      type: 'runtime',
      header: 'Runtime error detected',
      level: 'error',
      messageText: err ? err.message ? err.message : err.toString() : ''
    };

    if (err && err.stack) {
      diagnostic.messageText += '\n' + err.stack;
      diagnostic.messageText = diagnostic.messageText.trim();
    }

    switch (type) {
      case RUNTIME_ERROR.LoadBundleError:
        diagnostic.header += ' while loading bundle';
        break;
      case RUNTIME_ERROR.QueueEventsError:
        diagnostic.header += ' while running initial events';
        break;
      case RUNTIME_ERROR.WillLoadError:
        diagnostic.header += ' during componentWillLoad()';
        break;
      case RUNTIME_ERROR.DidLoadError:
        diagnostic.header += ' during componentDidLoad()';
        break;
      case RUNTIME_ERROR.InitInstanceError:
        diagnostic.header += ' while initializing instance';
        break;
      case RUNTIME_ERROR.RenderError:
        diagnostic.header += ' while rendering';
        break;
      case RUNTIME_ERROR.DidUpdateError:
        diagnostic.header += ' while updating';
        break;
    }

    if (elm && elm.tagName) {
      diagnostic.header += ': ' + elm.tagName.toLowerCase();
    }

    diagnostics.push(diagnostic);

    if (appFailure) {
      appLoaded(diagnostic);
    }
  }

  function propConnect(ctrlTag: string) {
    return proxyController(domApi, controllerComponents, ctrlTag);
  }

  function getContextItem(contextKey: string) {
    return Context[contextKey];
  }

  return plt;
}


export function getComponentBundleFilename(cmpMeta: d.ComponentMeta, modeName: string) {
  let bundleId: string = (typeof cmpMeta.bundleIds === 'string') ?
    cmpMeta.bundleIds :
    ((cmpMeta.bundleIds as d.BundleIds)[modeName] || (cmpMeta.bundleIds as d.BundleIds)[DEFAULT_STYLE_MODE]);

  if (cmpMeta.encapsulation === ENCAPSULATION.ScopedCss || cmpMeta.encapsulation === ENCAPSULATION.ShadowDom) {
    bundleId += '.sc';
  }

  // server-side always uses es5 and jsonp callback modules
  bundleId += '.es5.js';

  return bundleId;
}
