import * as d from '../../declarations';


export function getBuildFeatures(allModulesFiles: d.Module[], appModuleFiles: d.Module[]) {
  const cmps = appModuleFiles.filter(m => m.cmpCompilerMeta != null).map(m => m.cmpCompilerMeta);

  const moduleFileTree: d.Module[] = [];
  appModuleFiles.forEach(moduleFile => {
    loadModuleFileTree(allModulesFiles, moduleFileTree, moduleFile);
  });

  const f: d.BuildFeatures = {
    appModuleFiles: appModuleFiles,
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
    hostData: cmps.some(c => c.hasHostDataFn),
    lifecycle: cmps.some(c => c.hasLifecycle),
    listener: cmps.some(c => c.hasListener),
    member: cmps.some(c => c.hasMember),
    method: cmps.some(c => c.hasMethod),
    mode: cmps.some(c => c.hasMode),
    noRender: cmps.every(cmpMeta => !cmpMeta.hasRenderFn),
    noVdomRender: moduleFileTree.every(m => !m.hasVdomRender),
    observeAttr: cmps.some(c => c.hasAttr),
    prop: cmps.some(c => c.hasProp),
    propMutable: cmps.some(c => c.hasPropMutable),
    reflectToAttr: cmps.some(c => c.hasReflectToAttr),
    render: cmps.some(c => (c.hasRenderFn || c.hasHostDataFn)),
    scoped: cmps.some(c => c.encapsulation === 'scoped'),
    shadowDom: cmps.some(c => c.encapsulation === 'shadow'),
    slot: moduleFileTree.some(m => m.hasSlot),
    state: cmps.some(c => c.hasState),
    style: cmps.some(c => c.hasStyle),
    svg: moduleFileTree.some(m => m.hasSvg),
    updatable: cmps.some(c => c.isUpdateable),
    vdomAttribute: moduleFileTree.some(m => m.hasVdomAttribute),
    vdomClass: moduleFileTree.some(m => m.hasVdomClass),
    vdomFunctional: moduleFileTree.some(m => m.hasVdomFunctional),
    vdomKey: moduleFileTree.some(m => m.hasVdomKey),
    vdomListener: moduleFileTree.some(m => m.hasVdomListener),
    vdomRef: moduleFileTree.some(m => m.hasVdomRef),
    vdomRender: moduleFileTree.some(m => m.hasVdomRender),
    vdomStyle: moduleFileTree.some(m => m.hasVdomStyle),
    vdomText: moduleFileTree.some(m => m.hasVdomText),
    watchCallback: cmps.some(c => c.hasWatchCallback),
  };

  return f;
}


export function updateBuildConditionals(config: d.Config, b: d.Build) {
  b.appNamespace = config.namespace;
  b.appNamespaceLower = config.fsNamespace;
  b.isDev = !!config.devMode;
  b.isProd = !config.devMode;
  b.hotModuleReplacement = b.isDev;
  b.profile = !!(config.flags && config.flags.profile);
  b.taskQueue = (b.updatable || b.mode || b.lifecycle || b.lazyLoad);

  b.exposeTaskQueue = (b.taskQueue && !!config.exposeTaskQueue);
  b.exposeEventListener = (b.listener && !!config.exposeEventListener);
  b.exposeRequestAnimationFrame = (b.taskQueue && !!config.exposeRequestAnimationFrame);
}


function loadModuleFileTree(allModulesFiles: d.ModuleFile[], moduleFileTree: d.ModuleFile[], moduleFile: d.ModuleFile) {
  if (moduleFile) {
    if (!moduleFileTree.includes(moduleFile)) {
      moduleFileTree.push(moduleFile);
    }

    moduleFile.localImports && moduleFile.localImports.forEach(localImport => {
      const subModuleFile = allModulesFiles.find(moduleFile => {
        return (moduleFile.sourceFilePath === localImport) ||
               (moduleFile.sourceFilePath === localImport + '.ts') ||
               (moduleFile.sourceFilePath === localImport + '.tsx') ||
               (moduleFile.sourceFilePath === localImport + '.js');
      });

      loadModuleFileTree(allModulesFiles, moduleFileTree, subModuleFile);
    });
  }
}


export function getDefaultBuildConditionals() {
  const b: d.Build = {
    appNamespace: 'App',
    appNamespaceLower: 'app',
    appModuleFiles: [],
    asyncLifecycle: true,
    connectedCallback: true,
    disconnectedCallback: true,
    polyfills: false,
    shadowDom: true,
    scoped: true,
    slotPolyfill: true,
    prerenderServerSide: true,
    prerenderClientSide: true,
    devInspector: true,
    hotModuleReplacement: true,
    style: true,
    render: true,
    noRender: false,
    hostData: true,
    vdomRender: true,
    noVdomRender: false,
    vdomAttribute: true,
    vdomClass: true,
    vdomStyle: true,
    vdomFunctional: true,
    vdomKey: true,
    vdomListener: true,
    vdomRef: true,
    vdomText: true,
    reflectToAttr: true,
    slot: true,
    svg: true,
    mode: true,
    observeAttr: true,
    isDev: true,
    isProd: false,
    profile: false,
    element: true,
    event: true,
    listener: true,
    method: true,
    prop: true,
    propMutable: true,
    state: true,
    member: true,
    updatable: true,
    watchCallback: true,
    lifecycle: true,
    cmpDidLoad: true,
    cmpWillLoad: true,
    cmpDidUpdate: true,
    cmpWillUpdate: true,
    cmpDidUnload: true,
    clientSide: false,
    externalModuleLoader: false,
    lazyLoad: false,
    es5: false,
    taskQueue: true,
    exposeTaskQueue: true,
    exposeEventListener: true,
    exposeRequestAnimationFrame: true,
    syncQueue: false
  };
  return b;
}
