import * as d from '../declarations';
import { assignHostContentSlots } from '../renderer/vdom/slot';
import { createDomApi } from '../renderer/dom-api';
import { createQueueServer } from './queue-server';
import { createRendererPatch } from '../renderer/vdom/patch';
import { DEFAULT_STYLE_MODE, ENCAPSULATION, PROP_TYPE, RUNTIME_ERROR } from '../util/constants';
import { getAppBuildDir } from '../compiler/app/app-file-naming';
import { h } from '../renderer/vdom/h';
import { noop } from '../util/helpers';
import { patchDomApi } from './dom-api-server';
import { proxyController } from '../core/proxy-controller';
import { toDashCase } from '../util/helpers';


export function createPlatformServer(
  config: d.Config,
  outputTarget: d.OutputTargetWww,
  win: any,
  doc: any,
  cmpRegistry: d.ComponentRegistry,
  diagnostics: d.Diagnostic[],
  isPrerender: boolean,
  compilerCtx?: d.CompilerCtx
): d.PlatformApi {
  const loadedBundles: {[bundleId: string]: any} = {};
  const styles: string[] = [];
  const controllerComponents: {[tag: string]: d.HostElement} = {};

  // create the app global
  const App: d.AppGlobal = {};

  const domApi = createDomApi(App, win, doc);

  // init build context
  compilerCtx = compilerCtx || {};

  // the root <html> element is always the top level registered component
  cmpRegistry = Object.assign({ 'html': {}}, cmpRegistry);

  // initialize Core global object
  const Context: d.CoreContext = {};
  Context.addListener = noop;
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

  // add the h() fn to the app's global namespace
  App.h = h;
  App.Context = Context;

  // add the app's global to the window context
  win[config.namespace] = App;

  const appBuildDir = getAppBuildDir(config, outputTarget);
  Context.resourcePath = Context.publicPath = appBuildDir;

  // create the sandboxed context with a new instance of a V8 Context
  // V8 Context provides an isolated global environment
  config.sys.vm.createContext(compilerCtx, outputTarget.dir, win);

  // execute the global scripts (if there are any)
  runGlobalScripts();

  // create the platform api which is used throughout common core code
  const plt: d.PlatformApi = {
    attachStyles: noop,
    connectHostElement,
    defineComponent,
    domApi,
    emitEvent: noop,
    getComponentMeta,
    getContextItem,
    isDefinedComponent,
    loadBundle: loadComponent,
    onError,
    propConnect,
    queue: createQueueServer(),
    tmpDisconnected: false,

    ancestorHostElementMap: new WeakMap(),
    componentAppliedStyles: new WeakMap(),
    defaultSlotsMap: new WeakMap(),
    hasConnectedMap: new WeakMap(),
    hasListenersMap: new WeakMap(),
    hasLoadedMap: new WeakMap(),
    hostElementMap: new WeakMap(),
    instanceMap: new WeakMap(),
    isDisconnectedMap: new WeakMap(),
    isQueuedForUpdate: new WeakMap(),
    namedSlotsMap: new WeakMap(),
    onReadyCallbacksMap: new WeakMap(),
    queuedEvents: new WeakMap(),
    vnodeMap: new WeakMap(),
    valuesMap: new WeakMap()
  };

  // patch dom api like createElement()
  patchDomApi(plt, domApi);

  // create the renderer which will be used to patch the vdom
  plt.render = createRendererPatch(plt, domApi);

  // setup the root node of all things
  // which is the mighty <html> tag
  const rootElm = domApi.$documentElement as d.HostElement;
  rootElm.$rendered = true;
  rootElm.$activeLoading = [];
  rootElm.$initLoad = function appLoadedCallback() {
    plt.hasLoadedMap.set(rootElm, true);
    appLoaded();
  };

  function appLoaded(failureDiagnostic?: d.Diagnostic) {
    if (plt.hasLoadedMap.has(rootElm) || failureDiagnostic) {
      // the root node has loaded
      // and there are no css files still loading
      plt.onAppLoad && plt.onAppLoad(rootElm, styles, failureDiagnostic);
    }
  }

  function connectHostElement(_cmpMeta: d.ComponentMeta, elm: d.HostElement) {
    // set the "mode" property
    if (!elm.mode) {
      // looks like mode wasn't set as a property directly yet
      // first check if there's an attribute
      // next check the app's global
      elm.mode = domApi.$getAttribute(elm, 'mode') || Context.mode;
    }

    // pick out all of the light dom nodes from the host element
    assignHostContentSlots(plt, domApi, elm, elm.childNodes);
  }


  function getComponentMeta(elm: Element) {
    // registry tags are always lower-case
    return cmpRegistry[elm.tagName.toLowerCase()];
  }

  function defineComponent(cmpMeta: d.ComponentMeta) {
    // default mode and color props
    cmpRegistry[cmpMeta.tagNameMeta] = cmpMeta;
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
      callback(bundleExports, ...deps.map(d => loadedBundles[d]));
    } catch (e) {
      onError(e, RUNTIME_ERROR.LoadBundleError, null, true);
    }

    // If name is undefined then this callback was fired by component callback
    if (name === undefined) {
      return;
    }

    loadedBundles[name] = bundleExports;

    // If name contains chunk then this callback was associated with a dependent bundle loading
    // let's add a reference to the constructors on each components metadata
    // each key in moduleImports is a PascalCased tag name
    if (!name.startsWith('./chunk')) {
      Object.keys(bundleExports).forEach(pascalCasedTagName => {
        const cmpMeta = cmpRegistry[toDashCase(pascalCasedTagName)];
        if (cmpMeta) {
          // connect the component's constructor to its metadata
          const componentConstructor = bundleExports[pascalCasedTagName];

          if (!cmpMeta.componentConstructor) {
            // init component constructor
            cmpMeta.componentConstructor = componentConstructor;

            cmpMeta.membersMeta = {
              'color': {}
            };

            if (cmpMeta.componentConstructor.properties) {
              Object.keys(cmpMeta.componentConstructor.properties).forEach(memberName => {
                const constructorProperty = cmpMeta.componentConstructor.properties[memberName];

                if (constructorProperty.type) {
                  cmpMeta.membersMeta[memberName] = {
                    propType: PROP_TYPE.Any
                  };
                }
              });
            }
          }

          if (componentConstructor.style) {
            styles.push(componentConstructor.style);
          }
        }
      });
    }
  }

  /**
   * This function is called anytime a JS file is loaded
   */
  App.loadBundle = function loadBundle(bundleId: string, [, ...dependentsList]: string[], importer: Function) {

    const missingDependents = dependentsList.filter(d => !loadedBundles[d]);
    missingDependents.forEach(d => {
      const fileName = d.replace('.js', '.es5.js');
      loadFile(fileName);
    });

    execBundleCallback(bundleId, dependentsList, importer);
  };


  function isDefinedComponent(elm: Element) {
    return !!(cmpRegistry[elm.tagName.toLowerCase()]);
  }


  plt.attachStyles = function attachStyles(_domApi, _cmpMeta, _modeName, _elm) {/**/};

  // This is executed by the component's connected callback.
  function loadComponent(cmpMeta: d.ComponentMeta, modeName: string, cb: Function, bundleId?: string) {
    bundleId = (typeof cmpMeta.bundleIds === 'string') ?
      cmpMeta.bundleIds :
      cmpMeta.bundleIds[modeName];

    // It is possible the data was loaded from an outside source like tests
    if (cmpRegistry[cmpMeta.tagNameMeta].componentConstructor) {
      cb();

    } else if (loadedBundles[bundleId]) {
      // sweet, we've already loaded this bundle
      cb();

    } else {
      const fileName = getComponentBundleFilename(cmpMeta, modeName);
      loadFile(fileName);
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
    (cmpMeta.bundleIds[modeName] || cmpMeta.bundleIds[DEFAULT_STYLE_MODE]);

  if (cmpMeta.encapsulation === ENCAPSULATION.ScopedCss || cmpMeta.encapsulation === ENCAPSULATION.ShadowDom) {
    bundleId += '.sc';
  }

  // server-side always uses es5 and jsonp callback modules
  bundleId += '.es5.js';

  return bundleId;
}
