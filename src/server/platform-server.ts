import { assignHostContentSlots } from '../core/renderer/slot';
import { BuildConfig, BuildContext, ComponentMeta, ComponentRegistry,
  CoreContext, Diagnostic, FilesMap, HostElement,
  BundleCallbacks, PlatformApi, AppGlobal } from '../util/interfaces';
import { createDomApi } from '../core/renderer/dom-api';
import { createDomControllerServer } from './dom-controller-server';
import { createQueueServer } from './queue-server';
import { createRendererPatch } from '../core/renderer/patch';
import { ENCAPSULATION, DEFAULT_STYLE_MODE, MEMBER_TYPE, RUNTIME_ERROR } from '../util/constants';
import { getAppFileName } from '../compiler/app/generate-app-files';
import { getJsFile, normalizePath } from '../compiler/util';
import { h, t } from '../core/renderer/h';
import { noop } from '../util/helpers';
import { parseComponentMeta } from '../util/data-parse';
import { proxyController } from '../core/instance/proxy';


export function createPlatformServer(
  config: BuildConfig,
  win: any,
  doc: any,
  diagnostics: Diagnostic[],
  isPrerender: boolean,
  ctx?: BuildContext
): PlatformApi {
  const registry: ComponentRegistry = { 'html': {} };
  const moduleImports: {[tag: string]: any} = {};
  const bundleCallbacks: BundleCallbacks = {};
  const loadedBundles: {[bundleId: string]: boolean} = {};
  const pendingBundleFileReads: {[url: string]: boolean} = {};
  const stylesMap: FilesMap = {};
  const controllerComponents: {[tag: string]: HostElement} = {};

  // init build context
  ctx = ctx || {};

  // initialize Core global object
  const Context: CoreContext = {};
  Context.addListener = noop;
  Context.dom = createDomControllerServer();
  Context.enableListener = noop;
  Context.emit = noop;
  Context.isClient = false;
  Context.isServer = true;
  Context.isPrerender = isPrerender;
  Context.window = win;
  Context.location = win.location;
  Context.document = doc;

  // add the Core global to the window context
  // Note: "Core" is not on the window context on the client-side
  win.Context = Context;

  // create the app global
  const App: AppGlobal = {};

  // add the app's global to the window context
  win[config.namespace] = App;

  // keep a global set of tags we've already defined
  const globalDefined: { [tagName: string]: boolean } = win.$definedComponents = win.$definedComponents || {};

  const appWwwDir = config.wwwDir;
  const appBuildDir = config.sys.path.join(config.buildDir, getAppFileName(config));

  // create the sandboxed context with a new instance of a V8 Context
  // V8 Context provides an isolated global environment
  config.sys.vm.createContext(ctx, appWwwDir, win);

  // execute the global scripts (if there are any)
  runGlobalScripts();

  // create the DOM api which we'll use during hydrate
  const domApi = createDomApi(win.document);

  // create the platform api which is used throughout common core code
  const plt: PlatformApi = {
    defineComponent,
    getComponentMeta,
    propConnect,
    getContextItem,
    loadBundle,
    connectHostElement,
    attachStyles: noop,
    queue: createQueueServer(),
    tmpDisconnected: false,
    emitEvent: noop,
    getEventOptions,
    onError,
    isDefinedComponent
  };


  // create the renderer which will be used to patch the vdom
  plt.render = createRendererPatch(plt, domApi, false);

  // setup the root node of all things
  // which is the mighty <html> tag
  const rootElm = <HostElement>domApi.$documentElement;
  rootElm.$rendered = true;
  rootElm.$activeLoading = [];
  rootElm.$initLoad = function appLoadedCallback() {
    rootElm._hasLoaded = true;
    appLoaded();
  };

  function appLoaded(failureDiagnostic?: Diagnostic) {
    if (rootElm._hasLoaded || failureDiagnostic) {
      // the root node has loaded
      // and there are no css files still loading
      plt.onAppLoad && plt.onAppLoad(rootElm, stylesMap, failureDiagnostic);
    }
  }

  function connectHostElement(cmpMeta: ComponentMeta, elm: HostElement) {
    // set the "mode" property
    if (!elm.mode) {
      // looks like mode wasn't set as a property directly yet
      // first check if there's an attribute
      // next check the app's global
      elm.mode = domApi.$getAttribute(elm, 'mode') || Context.mode;
    }

    assignHostContentSlots(domApi, elm, cmpMeta.slotMeta);
  }


  function getComponentMeta(elm: Element) {
    // registry tags are always lower-case
    return registry[elm.tagName.toLowerCase()];
  }

  function defineComponent(cmpMeta: ComponentMeta) {
    // default mode and color props
    cmpMeta.membersMeta = cmpMeta.membersMeta || {};

    cmpMeta.membersMeta.mode = { memberType: MEMBER_TYPE.Prop };
    cmpMeta.membersMeta.color = { memberType: MEMBER_TYPE.Prop, attribName: 'color' };

    // registry tags are always lower-case
    const registryTag = cmpMeta.tagNameMeta.toLowerCase();

    if (!globalDefined[registryTag]) {
      globalDefined[registryTag] = true;

      registry[registryTag] = cmpMeta;

      if (cmpMeta.componentModule) {
        // for unit testing
        moduleImports[registryTag] = cmpMeta.componentModule;
      }
    }
  }

  function isDefinedComponent(elm: Element) {
    return !!(globalDefined[elm.tagName.toLowerCase()] || registry[elm.tagName.toLowerCase()]);
  }


  App.loadComponents = function loadComponents(bundleId, importFn) {
    const args = arguments;

    // import component function
    // inject globals
    importFn(moduleImports, h, t, Context, appBuildDir);

    for (var i = 2; i < args.length; i++) {
      parseComponentMeta(registry, moduleImports, args[i], Context.attr);
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


  App.loadStyles = function loadStyles() {
    // jsonp callback from requested bundles
    const args = arguments;
    for (var i = 0; i < args.length; i += 2) {
      stylesMap[args[i]] = args[i + 1];
    }
  };


  function loadBundle(cmpMeta: ComponentMeta, elm: HostElement, cb: Function): void {
    if (cmpMeta.componentModule) {
      // we already have the module loaded
      // (this is probably a unit test)
      cb();
      return;
    }

    const bundleId: string = cmpMeta.bundleIds[elm.mode] || cmpMeta.bundleIds[DEFAULT_STYLE_MODE] || (cmpMeta.bundleIds as any);

    if (loadedBundles[bundleId]) {
      // sweet, we've already loaded this bundle
      cb();

    } else {
      // never seen this bundle before, let's start loading the file
      // and add it to the bundle callbacks to fire when it's loaded
      (bundleCallbacks[bundleId] = bundleCallbacks[bundleId] || []).push(cb);

      let requestBundleId = bundleId;
      if (cmpMeta.encapsulation === ENCAPSULATION.ScopedCss || cmpMeta.encapsulation === ENCAPSULATION.ShadowDom) {
        requestBundleId += '.sc';
      }
      requestBundleId += '.js';

      // create the bundle filePath we'll be reading
      const jsFilePath = normalizePath(config.sys.path.join(appBuildDir, requestBundleId));

      if (!pendingBundleFileReads[jsFilePath]) {
        // not already actively reading this file
        // remember that we're now actively requesting this url
        pendingBundleFileReads[jsFilePath] = true;

        // let's kick off reading the bundle
        // this could come from the cache or a new readFile
        getJsFile(config.sys, ctx, jsFilePath).then(jsContent => {
          // remove it from the list of file reads we're waiting on
          delete pendingBundleFileReads[jsFilePath];

          // run the code in this sandboxed context
          config.sys.vm.runInContext(jsContent, win, { timeout: 10000 });

        }).catch(err => {
          onError(err, RUNTIME_ERROR.LoadBundleError, elm, true);
        });
      }
    }
  }

  function getEventOptions(useCapture?: boolean, usePassive?: boolean) {
    return {
      'capture': !!(useCapture),
      'passive': !!(usePassive)
    };
  }

  function runGlobalScripts() {
    if (!ctx || !ctx.appFiles || !ctx.appFiles.global) {
      return;
    }

    config.sys.vm.runInContext(ctx.appFiles.global, win);
  }

  function onError(err: Error, type: RUNTIME_ERROR, elm: HostElement, appFailure: boolean) {
    const d: Diagnostic = {
      type: 'runtime',
      header: 'Runtime error detected',
      level: 'error',
      messageText: err ? err.message ? err.message : err.toString() : null
    };

    switch (type) {
      case RUNTIME_ERROR.LoadBundleError:
        d.header += ' while loading bundle';
        break;
      case RUNTIME_ERROR.QueueEventsError:
        d.header += ' while running initial events';
        break;
      case RUNTIME_ERROR.WillLoadError:
        d.header += ' during componentWillLoad()';
        break;
      case RUNTIME_ERROR.DidLoadError:
        d.header += ' during componentDidLoad()';
        break;
      case RUNTIME_ERROR.InitInstanceError:
        d.header += ' while initializing instance';
        break;
      case RUNTIME_ERROR.RenderError:
        d.header += ' while rendering';
        break;
      case RUNTIME_ERROR.DidUpdateError:
        d.header += ' while updating';
        break;
    }

    if (elm && elm.tagName) {
      d.header += ': ' + elm.tagName.toLowerCase();
    }

    diagnostics.push(d);

    if (appFailure) {
      appLoaded(d);
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
