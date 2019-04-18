import * as d from '../../declarations';


export function getBuildFeatures(cmps: d.ComponentCompilerMeta[]) {
  const f: d.BuildFeatures = {
    allRenderFn: cmps.every(c => c.hasRenderFn),
    cmpDidLoad: cmps.some(c => c.hasComponentDidLoadFn),
    cmpDidUnload: cmps.some(c => c.hasComponentDidUnloadFn),
    cmpDidUpdate: cmps.some(c => c.hasComponentDidUpdateFn),
    cmpDidRender: cmps.some(c => c.hasComponentDidRenderFn),
    cmpWillLoad: cmps.some(c => c.hasComponentWillLoadFn),
    cmpWillUpdate: cmps.some(c => c.hasComponentWillUpdateFn),
    cmpWillRender: cmps.some(c => c.hasComponentWillRenderFn),

    connectedCallback: cmps.some(c => c.hasConnectedCallbackFn),
    disconnectedCallback: cmps.some(c => c.hasDisconnectedCallbackFn),
    element: cmps.some(c => c.hasElement),
    event: cmps.some(c => c.hasEvent),
    hasRenderFn: cmps.some(c => c.hasRenderFn),
    lifecycle: cmps.some(c => c.hasLifecycle),
    hostListener: cmps.some(c => c.hasListener),
    hostListenerTargetWindow: cmps.some(c => c.hasListenerTargetWindow),
    hostListenerTargetDocument: cmps.some(c => c.hasListenerTargetDocument),
    hostListenerTargetBody: cmps.some(c => c.hasListenerTargetBody),
    hostListenerTargetParent: cmps.some(c => c.hasListenerTargetParent),
    hostListenerTarget: cmps.some(c => c.hasListenerTarget),
    member: cmps.some(c => c.hasMember),
    method: cmps.some(c => c.hasMethod),
    mode: cmps.some(c => c.hasMode),
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

  return f;
}


export function updateBuildConditionals(config: d.Config, b: d.Build) {
  b.isDebug = (config.logLevel === 'debug');
  b.isDev = !!config.devMode;
  b.lifecycleDOMEvents = !!(b.isDebug || config._isTesting);
  b.profile = !!(config.flags && config.flags.profile);
  b.slotRelocation = !!(b.scoped || (b.hydrateServerSide) || (b.es5 && b.shadowDom));
  b.hotModuleReplacement = !!(config.devMode && config.devServer && config.devServer.hotReplacement);
  b.updatable = (b.updatable || b.hydrateClientSide || b.hotModuleReplacement);
  b.member = (b.member || b.updatable || b.mode || b.lifecycle);
  b.taskQueue = (b.updatable || b.mode || b.lifecycle);
}


export const BUILD: d.Build = {};
