import * as d from '@declarations';


export function getBuildFeatures(cmps: d.ComponentCompilerMeta[]) {
  const f: d.BuildFeatures = {
    allRenderFn: cmps.every(c => c.hasRenderFn),
    asyncLifecycle: cmps.some(c => c.hasAsyncLifecycle),
    cmpDidLoad: cmps.some(c => c.hasComponentDidLoadFn),
    cmpDidUnload: cmps.some(c => c.hasComponentWillUnloadFn),
    cmpDidUpdate: cmps.some(c => c.hasComponentDidUpdateFn),
    cmpWillLoad: cmps.some(c => c.hasComponentWillLoadFn),
    cmpWillUpdate: cmps.some(c => c.hasComponentWillUpdateFn),
    connectedCallback: cmps.some(c => c.hasConnectedCallbackFn),
    disconnectedCallback: cmps.some(c => c.hasDisonnectedCallbackFn),
    element: cmps.some(c => c.hasElement),
    event: cmps.some(c => c.hasEvent),
    hasRenderFn: cmps.some(c => (c.hasRenderFn || c.hasHostDataFn)),
    hostData: cmps.some(c => c.hasHostDataFn),
    lifecycle: cmps.some(c => c.hasLifecycle),
    hostListener: cmps.some(c => c.hasListener),
    member: cmps.some(c => c.hasMember),
    method: cmps.some(c => c.hasMethod),
    mode: cmps.some(c => c.hasMode),
    noRenderFn: cmps.every(c => !c.hasRenderFn),
    noVdomRender: cmps.every(c => !c.hasVdomRender),
    observeAttribute: cmps.some(c => c.hasAttribute),
    prop: cmps.some(c => c.hasProp),
    propMutable: cmps.some(c => c.hasPropMutable),
    reflect: cmps.some(c => c.hasReflect),
    scoped: cmps.some(c => c.encapsulation === 'scoped'),
    shadowDom: cmps.some(c => c.encapsulation === 'shadow'),
    slot: cmps.some(c => c.htmlTagNames.includes('slot')),
    state: cmps.some(c => c.hasState),
    style: cmps.some(c => c.hasStyle),
    svg: cmps.some(c => c.htmlTagNames.includes('svg')),
    updatable: cmps.some(c => c.isUpdateable),
    vdomAttribute: cmps.some(c => c.hasVdomAttribute),
    vdomClass: cmps.some(c => c.hasVdomClass),
    vdomFunctional: cmps.some(c => c.hasVdomFunctional),
    vdomKey: cmps.some(c => c.hasVdomKey),
    vdomListener: cmps.some(c => c.hasVdomListener),
    vdomRef: cmps.some(c => c.hasVdomRef),
    vdomRender: cmps.some(c => c.hasVdomRender),
    vdomStyle: cmps.some(c => c.hasVdomStyle),
    vdomText: cmps.some(c => c.hasVdomText),
    watchCallback: cmps.some(c => c.hasWatchCallback),
    taskQueue: true,
  };

  f.member = (f.member || f.updatable || f.mode || f.lifecycle);
  f.taskQueue = (f.updatable || f.mode || f.lifecycle);

  return f;
}


export function updateBuildConditionals(config: d.Config, b: d.Build) {
  b.appNamespace = config.namespace;
  b.appNamespaceLower = config.fsNamespace;
  b.isDebug = config.logLevel === 'debug';
  b.isDev = !!config.devMode;
  b.isProd = !config.devMode;
  b.hotModuleReplacement = b.isDev;
  b.profile = !!(config.flags && config.flags.profile);

  b.exposeAppOnReady = (b.lazyLoad && !!config.exposeAppOnReady);
  b.exposeAppRegistry = (b.lazyLoad && !!config.exposeAppRegistry);
  b.exposeReadQueue = !!config.exposeReadQueue;
  b.exposeWriteQueue = (b.taskQueue && !!config.exposeWriteQueue);
  b.exposeEventListener = (b.hostListener && !!config.exposeEventListener);
  b.exposeRequestAnimationFrame = (b.taskQueue && !!config.exposeRequestAnimationFrame);
}


export const BUILD: d.Build = {};
