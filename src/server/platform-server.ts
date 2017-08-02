import { assignHostContentSlots } from '../core/renderer/slot';
import { BuildContext, ComponentMeta, ComponentRegistry,
  CoreGlobal, Diagnostic, FilesMap, HostElement, ListenOptions,
  ModuleCallbacks, PlatformApi, AppGlobal, StencilSystem } from '../util/interfaces';
import { createDomApi } from '../core/renderer/dom-api';
import { createDomControllerServer } from './dom-controller-server';
import { createQueueServer } from './queue-server';
import { createRenderer } from '../core/renderer/patch';
import { getCssFile, getJsFile, normalizePath } from '../compiler/util';
import { h, t } from '../core/renderer/h';
import { DID_LOAD_ERROR, INIT_INSTANCE_ERROR, INITIAL_LOAD_ERROR, LOAD_BUNDLE_ERROR, QUEUE_EVENTS_ERROR, RENDER_ERROR, WILL_LOAD_ERROR } from '../util/constants';
import { noop } from '../util/helpers';
import { parseComponentMeta } from '../util/data-parse';


export function createPlatformServer(
  sys: StencilSystem,
  appNamespace: string,
  win: any,
  appBuildDir: string,
  diagnostics: Diagnostic[],
  ctx?: BuildContext
): PlatformApi {
  const registry: ComponentRegistry = { 'HTML': {} };
  const moduleImports: {[tag: string]: any} = {};
  const moduleCallbacks: ModuleCallbacks = {};
  const loadedModules: {[moduleId: string]: boolean} = {};
  const pendingModuleFileReads: {[url: string]: boolean} = {};
  const pendingStyleFileReads: {[url: string]: boolean} = {};
  const stylesMap: FilesMap = {};


  // initialize Core global object
  const Core: CoreGlobal = {};
  Core.addListener = noop;
  Core.enableListener = noop;
  Core.emit = noop;
  Core.dom = createDomControllerServer();
  Core.isClient = false;
  Core.isServer = true;

  // add the Core global to the window context
  // Note: "Core" is not on the window context on the client-side
  win.Core = Core;

  // create the app global
  const App: AppGlobal = {};

  // add the app's global to the window context
  win[appNamespace] = App;

  // create the sandboxed context with a new instance of a V8 Context
  // V8 Context provides an isolated global environment
  sys.vm.createContext(win);

  // execute the global scripts (if there are any)
  runGlobalScripts();

  // create the DOM api which we'll use during hydrate
  const domApi = createDomApi(win.document);

  // create the platform api which is used throughout common core code
  const plt: PlatformApi = {
    defineComponent,
    getComponentMeta,
    loadBundle,
    connectHostElement,
    queue: createQueueServer(),
    tmpDisconnected: false,
    emitEvent: noop,
    getEventOptions,
    onError
  };


  // create the renderer which will be used to patch the vdom
  plt.render = createRenderer(plt, domApi);

  // setup the root node of all things
  // which is the mighty <html> tag
  const rootNode = <HostElement>domApi.$documentElement;
  rootNode._activelyLoadingChildren = [];
  rootNode._initLoad = function appLoadedCallback() {
    // check we've only fully loaded when all of the styles have loaded also
    if (plt.onAppLoad && Object.keys(pendingStyleFileReads).length === 0) {
      rootNode._hasLoaded = true;

      plt.onAppLoad(rootNode, stylesMap);
    }
  };

  function connectHostElement(elm: HostElement, slotMeta: number) {
    // set the "mode" property
    if (!elm.mode) {
      // looks like mode wasn't set as a property directly yet
      // first check if there's an attribute
      // next check the app's global
      elm.mode = domApi.$getAttribute(elm, 'mode') || Core.mode;
    }

    assignHostContentSlots(domApi, elm, slotMeta);
  }


  function getComponentMeta(elm: Element) {
    // registry tags are always UPPER-CASE
    return registry[elm.tagName.toUpperCase()];
  }

  function defineComponent(cmpMeta: ComponentMeta) {
    // registry tags are always UPPER-CASE
    const registryTag = cmpMeta.tagNameMeta.toUpperCase();
    registry[registryTag] = cmpMeta;

    if (cmpMeta.componentModule) {
      // for unit testing
      moduleImports[registryTag] = cmpMeta.componentModule;
    }
  }


  App.defineComponents = function defineComponents(module, importFn) {
    const args = arguments;

    // import component function
    // inject globals
    importFn(moduleImports, h, t, Core, appBuildDir);

    for (var i = 2; i < args.length; i++) {
      parseComponentMeta(registry, moduleImports, args[i]);
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
      const jsFilePath = normalizePath(sys.path.join(appBuildDir, `${moduleId}.js`));

      if (!pendingModuleFileReads[jsFilePath]) {
        // not already actively reading this file
        // remember that we're now actively requesting this url
        pendingModuleFileReads[jsFilePath] = true;

        // let's kick off reading the module
        // this could come from the cache or a new readFile
        getJsFile(sys, ctx, jsFilePath).then(jsContent => {
          // remove it from the list of file reads we're waiting on
          delete pendingModuleFileReads[jsFilePath];

          // run the code in this sandboxed context
          sys.vm.runInContext(jsContent, win, { timeout: 10000 });

        }).catch(err => {
          onError(LOAD_BUNDLE_ERROR, err, elm);
        });
      }

      // we also need to load this component's css file
      // we're already figured out and set "mode" as a property to the element
      const styleId = cmpMeta.styleIds && (cmpMeta.styleIds[elm.mode] || cmpMeta.styleIds.$);
      if (styleId) {
        // we've got a style id to load up
        // create the style filePath we'll be reading
        const styleFilePath = normalizePath(sys.path.join(appBuildDir, `${styleId}.css`));

        if (!stylesMap[styleFilePath]) {
          // this style hasn't been added to our collection yet

          if (!pendingStyleFileReads[styleFilePath]) {
            // we're not already actively opening this file
            pendingStyleFileReads[styleFilePath] = true;

            getCssFile(sys, ctx, styleFilePath).then(cssContent => {
              delete pendingStyleFileReads[styleFilePath];

              // finished reading the css file
              // let's add the content to our collection
              stylesMap[styleFilePath] = cssContent;

              // check if the entire app is done loading or not
              // and if this was the last thing the app was waiting on
              rootNode._initLoad();

            }).catch(err => {
              onError(LOAD_BUNDLE_ERROR, err, elm);
            });
          }
        }
      }
    }
  }

  function getEventOptions(opts: ListenOptions) {
    return {
      'capture': !!(opts && opts.capture),
      'passive': !(opts && opts.passive === false)
    };
  }

  function runGlobalScripts() {
    if (!ctx.appFiles.global) {
      return;
    }

    sys.vm.runInContext(ctx.appFiles.global, win);
  }

  function onError(type: number, err: Error, elm: HostElement) {
    const d: Diagnostic = {
      type: 'runtime',
      header: 'Runtime error detected',
      level: 'error',
      messageText: err ? err.message ? err.message : err.toString() : null
    };

    switch (type) {
      case LOAD_BUNDLE_ERROR:
        d.header += ' while loading bundle';
        break;
      case QUEUE_EVENTS_ERROR:
        d.header += ' while running initial events';
        break;
      case WILL_LOAD_ERROR:
        d.header += ' during componentWillLoad()';
        break;
      case DID_LOAD_ERROR:
        d.header += ' during componentDidLoad()';
        break;
      case INIT_INSTANCE_ERROR:
        d.header += ' while initializing instance';
        break;
      case RENDER_ERROR:
        d.header += ' while rendering';
        break;
      case INITIAL_LOAD_ERROR:
        d.header += ' during initial load';
        break;
    }

    if (elm && elm.tagName) {
      d.header += ': ' + elm.tagName.toLowerCase();
    }

    diagnostics.push(d);
  }

  return plt;
}
