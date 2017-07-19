import { assignHostContentSlots } from '../core/renderer/slot';
import { BuildContext } from '../compiler/interfaces';
import { ComponentMeta, ComponentRegistry,
  DomApi, DomControllerApi, FilesMap, HostElement, ListenOptions, Logger,
  ModuleCallbacks, PlatformApi, ProjectGlobal, StencilSystem } from '../util/interfaces';
import { createRenderer } from '../core/renderer/patch';
import { getCssFile, getJsFile, normalizePath } from '../compiler/util';
import { h, t } from '../core/renderer/h';
import { initGlobal } from './global-server';
import { noop } from '../util/helpers';
import { parseComponentMeta } from '../util/data-parse';


export function createPlatformServer(
  sys: StencilSystem,
  logger: Logger,
  projectNamespace: string,
  Gbl: ProjectGlobal,
  win: any,
  domApi: DomApi,
  dom: DomControllerApi,
  projectBuildDir: string,
  ctx?: BuildContext
): PlatformApi {
  const registry: ComponentRegistry = { 'HTML': {} };
  const moduleImports: {[tag: string]: any} = {};
  const moduleCallbacks: ModuleCallbacks = {};
  const loadedModules: {[moduleId: string]: boolean} = {};
  const pendingModuleFileReads: {[url: string]: boolean} = {};
  const pendingStyleFileReads: {[url: string]: boolean} = {};
  const stylesMap: FilesMap = {};


  const plt: PlatformApi = {
    defineComponent,
    getComponentMeta,
    loadBundle,
    connectHostElement,
    queue: Gbl.QueueCtrl,
    tmpDisconnected: false,
    isServer: true,
    emitEvent: noop,
    getEventOptions
  };

  // create the renderer which will be used to patch the vdom
  plt.render = createRenderer(plt, domApi);

  const injectedGlobal = initGlobal(dom);

  // add the project's global to the window context
  win[projectNamespace] = Gbl;

  // create the sandboxed context with a new instance of a V8 Context
  // V8 Context provides an isolated global environment
  sys.vm.createContext(win);


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
      // next check the project's global, such as Ionic.mode
      elm.mode = domApi.$getAttribute(elm, 'mode') || Gbl.mode;
    }

    assignHostContentSlots(domApi, elm, slotMeta);
  }


  function getComponentMeta(elm: Element) {
    return registry[elm.tagName];
  }

  function defineComponent(cmpMeta: ComponentMeta) {
    registry[cmpMeta.tagNameMeta] = cmpMeta;

    if (cmpMeta.componentModuleMeta) {
      // for unit testing
      moduleImports[cmpMeta.tagNameMeta] = cmpMeta.componentModuleMeta;
    }
  }


  Gbl.defineComponents = function defineComponents(module, importFn) {
    const args = arguments;

    // import component function
    // inject globals
    importFn(moduleImports, h, t, projectBuildDir, injectedGlobal);

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
    if (cmpMeta.componentModuleMeta) {
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
      const jsFilePath = normalizePath(sys.path.join(projectBuildDir, `${moduleId}.js`));

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
          logger.error(`loadBundle, module read: ${err}`);
        });
      }

      // we also need to load this component's css file
      // we're already figured out and set "mode" as a property to the element
      const styleId = cmpMeta.styleIds[elm.mode] || cmpMeta.styleIds.$;
      if (styleId) {
        // we've got a style id to load up
        // create the style filePath we'll be reading
        const styleFilePath = normalizePath(sys.path.join(projectBuildDir, `${styleId}.css`));

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
              logger.error(`loadBundle, style read: ${err}`);
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

  return plt;
}
