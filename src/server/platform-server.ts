import { assignHostContentSlots } from '../core/renderer/slot';
import { BuildConfig, BuildContext, ComponentMeta, ComponentRegistry,
  CoreContext, Diagnostic, DomApi, FilesMap, HostElement,
  PlatformApi, AppGlobal } from '../util/interfaces';
import { createQueueServer } from './queue-server';
import { createRendererPatch } from '../core/renderer/patch';
import { dashToPascalCase } from '../util/helpers';
import { ENCAPSULATION, DEFAULT_STYLE_MODE, MEMBER_TYPE, RUNTIME_ERROR } from '../util/constants';
import { getAppFileName } from '../compiler/app/app-file-naming';
import { h } from '../core/renderer/h';
import { noop } from '../util/helpers';
import { proxyController } from '../core/instance/proxy';


export function createPlatformServer(
  config: BuildConfig,
  win: any,
  doc: any,
  domApi: DomApi,
  diagnostics: Diagnostic[],
  isPrerender: boolean,
  ctx?: BuildContext
): PlatformApi {
  const registry: ComponentRegistry = { 'html': {} };
  const stylesMap: FilesMap = {};
  const controllerComponents: {[tag: string]: HostElement} = {};

  // init build context
  ctx = ctx || {};

  // initialize Core global object
  const Context: CoreContext = {};
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

  // create the app global
  const App: AppGlobal = {};

  // add the h() fn to the app's global namespace
  App.h = h;

  // add the app's global to the window context
  win[config.namespace] = App;

  // keep a global set of tags we've already defined
  const globalDefined: { [tagName: string]: boolean } = win.$definedComponents = win.$definedComponents || {};

  const appWwwDir = config.wwwDir;
  const appBuildDir = config.sys.path.join(config.buildDir, getAppFileName(config));
  Context.publicPath = appBuildDir;

  // create the sandboxed context with a new instance of a V8 Context
  // V8 Context provides an isolated global environment
  config.sys.vm.createContext(ctx, appWwwDir, win);

  // execute the global scripts (if there are any)
  runGlobalScripts();

  // create the platform api which is used throughout common core code
  const plt: PlatformApi = {
    attachStyles: noop,
    connectHostElement,
    defineComponent,
    domApi,
    emitEvent: noop,
    getComponentMeta,
    getContextItem,
    isDefinedComponent,
    loadBundle,
    onError,
    propConnect,
    queue: createQueueServer(),
    tmpDisconnected: false,
  };


  // create the renderer which will be used to patch the vdom
  plt.render = createRendererPatch(plt, domApi);

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

  function connectHostElement(_cmpMeta: ComponentMeta, elm: HostElement) {
    // set the "mode" property
    if (!elm.mode) {
      // looks like mode wasn't set as a property directly yet
      // first check if there's an attribute
      // next check the app's global
      elm.mode = domApi.$getAttribute(elm, 'mode') || Context.mode;
    }

    // pick out all of the light dom nodes from the host element
    assignHostContentSlots(domApi, elm, elm.childNodes);
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
    }
  }

  function isDefinedComponent(elm: Element) {
    return !!(globalDefined[elm.tagName.toLowerCase()] || registry[elm.tagName.toLowerCase()]);
  }


  function loadBundle(cmpMeta: ComponentMeta, modeName: string, cb: Function): void {
    // synchronous in nodejs
    if (!cmpMeta.componentConstructor) {
      try {
        const bundleId: string = (cmpMeta.bundleIds[modeName] || cmpMeta.bundleIds[DEFAULT_STYLE_MODE] || (cmpMeta.bundleIds as any)).es5;

        let requestBundleId = bundleId;
        if (cmpMeta.encapsulation === ENCAPSULATION.ScopedCss || cmpMeta.encapsulation === ENCAPSULATION.ShadowDom) {
          requestBundleId += '.sc';
        }
        requestBundleId += '.js';

        const jsFilePath = config.sys.path.join(appBuildDir, requestBundleId);
        const module = require(jsFilePath);

        cmpMeta.componentConstructor = module[dashToPascalCase(cmpMeta.tagNameMeta)];

      } catch (e) {
        onError(e, RUNTIME_ERROR.LoadBundleError, null, true);
      }

      if (!cmpMeta.componentConstructor) {
        return;
      }
    }

    cb();
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
