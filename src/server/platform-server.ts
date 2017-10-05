import { assignHostContentSlots } from '../core/renderer/slot';
import { BuildConfig, BuildContext, ComponentMeta, ComponentRegistry,
  CoreContext, Diagnostic, FilesMap, HostElement,
  ModuleCallbacks, PlatformApi, AppGlobal } from '../util/interfaces';
import { createDomApi } from '../core/renderer/dom-api';
import { createDomControllerServer } from './dom-controller-server';
import { createQueueServer } from './queue-server';
import { createRendererPatch } from '../core/renderer/patch';
import { getAppFileName } from '../compiler/app/app-core';
import { getCssFile, getJsFile, normalizePath } from '../compiler/util';
import { h, t } from '../core/renderer/h';
import { MEMBER_TYPE, RUNTIME_ERROR } from '../util/constants';
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
  const registry: ComponentRegistry = { 'HTML': {} };
  const moduleImports: {[tag: string]: any} = {};
  const moduleCallbacks: ModuleCallbacks = {};
  const loadedModules: {[moduleId: string]: boolean} = {};
  const pendingModuleFileReads: {[url: string]: boolean} = {};
  const pendingStyleFileReads: {[url: string]: boolean} = {};
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
    queue: createQueueServer(),
    tmpDisconnected: false,
    emitEvent: noop,
    getEventOptions,
    onError
  };


  // create the renderer which will be used to patch the vdom
  plt.render = createRendererPatch(plt, domApi);

  // setup the root node of all things
  // which is the mighty <html> tag
  const rootElm = <HostElement>domApi.$documentElement;
  rootElm._hasRendered = true;
  rootElm._activelyLoadingChildren = [];
  rootElm._initLoad = function appLoadedCallback() {
    rootElm._hasLoaded = true;
    appLoaded();
  };

  function appLoaded(failureDiagnostic?: Diagnostic) {
    if ((rootElm._hasLoaded && Object.keys(pendingStyleFileReads).length === 0) || failureDiagnostic) {
      // the root node has loaded
      // and there are no css files still loading
      plt.onAppLoad && plt.onAppLoad(rootElm, stylesMap, failureDiagnostic);
    }
  }

  function connectHostElement(elm: HostElement, slotMeta: number) {
    // set the "mode" property
    if (!elm.mode) {
      // looks like mode wasn't set as a property directly yet
      // first check if there's an attribute
      // next check the app's global
      elm.mode = domApi.$getAttribute(elm, 'mode') || Context.mode;
    }

    assignHostContentSlots(domApi, elm, slotMeta);
  }


  function getComponentMeta(elm: Element) {
    // registry tags are always UPPER-CASE
    return registry[elm.tagName.toUpperCase()];
  }

  function defineComponent(cmpMeta: ComponentMeta) {
    // default mode and color props
    cmpMeta.membersMeta = cmpMeta.membersMeta || {};

    cmpMeta.membersMeta.mode = { memberType: MEMBER_TYPE.Prop };
    cmpMeta.membersMeta.color = { memberType: MEMBER_TYPE.Prop, attribName: 'color' };

    // registry tags are always UPPER-CASE
    const registryTag = cmpMeta.tagNameMeta.toUpperCase();
    registry[registryTag] = cmpMeta;

    if (cmpMeta.componentModule) {
      // for unit testing
      moduleImports[registryTag] = cmpMeta.componentModule;
    }
  }


  App.loadComponents = function loadComponents(module, importFn) {
    const args = arguments;

    // import component function
    // inject globals
    importFn(moduleImports, h, t, Context, appBuildDir);

    for (var i = 2; i < args.length; i++) {
      parseComponentMeta(registry, moduleImports, args[i], Context.attr);
    }

    // fire off all the callbacks waiting on this bundle to load
    var callbacks = moduleCallbacks[module];
    if (callbacks) {
      for (i = 0; i < callbacks.length; i++) {
        callbacks[i]();
      }
      delete moduleCallbacks[module];
    }

    // remember that we've already loaded this bundle
    loadedModules[module] = true;
  };


  function loadBundle(cmpMeta: ComponentMeta, elm: HostElement, cb: Function): void {
    loadModuleStyles(cmpMeta, elm);

    if (cmpMeta.componentModule) {
      // we already have the module loaded
      // (this is probably a unit test)
      cb();
      return;
    }

    const moduleId = cmpMeta.moduleId;

    if (loadedModules[moduleId]) {
      // sweet, we've already loaded this module
      cb();

    } else {
      // never seen this module before, let's start loading the file
      // and add it to the bundle callbacks to fire when it's loaded
      if (moduleCallbacks[moduleId]) {
        moduleCallbacks[moduleId].push(cb);
      } else {
        moduleCallbacks[moduleId] = [cb];
      }

      // create the module filePath we'll be reading
      const jsFilePath = normalizePath(config.sys.path.join(appBuildDir, `${moduleId}.js`));

      if (!pendingModuleFileReads[jsFilePath]) {
        // not already actively reading this file
        // remember that we're now actively requesting this url
        pendingModuleFileReads[jsFilePath] = true;

        // let's kick off reading the module
        // this could come from the cache or a new readFile
        getJsFile(config.sys, ctx, jsFilePath).then(jsContent => {
          // remove it from the list of file reads we're waiting on
          delete pendingModuleFileReads[jsFilePath];

          // run the code in this sandboxed context
          config.sys.vm.runInContext(jsContent, win, { timeout: 10000 });

        }).catch(err => {
          const d = onError(RUNTIME_ERROR.LoadBundleError, err, elm);
          appLoaded(d);
        });
      }
    }
  }


  function loadModuleStyles(cmpMeta: ComponentMeta, elm: HostElement) {
    // we need to load this component's css file
    // we're already figured out and set "mode" as a property to the element
    let styleId: any = cmpMeta.styleIds && (cmpMeta.styleIds[elm.mode] || cmpMeta.styleIds.$);
    if (!styleId && cmpMeta.stylesMeta) {
      const stylesMeta = cmpMeta.stylesMeta[elm.mode] || cmpMeta.stylesMeta.$;
      if (stylesMeta) {
        styleId = stylesMeta.styleId;
      }
    }
    if (styleId) {
      // we've got a style id to load up
      // create the style filePath we'll be reading
      const styleFilePath = normalizePath(config.sys.path.join(appBuildDir, `${styleId}.css`));

      if (!stylesMap[styleFilePath]) {
        // this style hasn't been added to our collection yet

        if (!pendingStyleFileReads[styleFilePath]) {
          // we're not already actively opening this file
          pendingStyleFileReads[styleFilePath] = true;

          getCssFile(config.sys, ctx, styleFilePath).then(cssContent => {
            delete pendingStyleFileReads[styleFilePath];

            // finished reading the css file
            // let's add the content to our collection
            stylesMap[styleFilePath] = cssContent;

            // check if the entire app is done loading or not
            // and if this was the last thing the app was waiting on
            appLoaded();

          }).catch(err => {
            const d = onError(RUNTIME_ERROR.LoadBundleError, err, elm);
            appLoaded(d);
          });
        }
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

  function onError(type: RUNTIME_ERROR, err: Error, elm: HostElement) {
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

    return d;
  }

  function propConnect(ctrlTag: string) {
    return proxyController(domApi, controllerComponents, ctrlTag);
  }

  function getContextItem(contextKey: string) {
    return Context[contextKey];
  }

  return plt;
}
