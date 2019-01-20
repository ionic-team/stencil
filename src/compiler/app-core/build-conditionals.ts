import * as d from '@declarations';
import { pathJoin } from '@utils';
import { sys } from '@sys';


export function getBuildFeatures(cmps: d.ComponentCompilerMeta[]) {
  // const cmps: d.ComponentCompilerMeta[] = [];
  // const moduleFileTree: d.Module[] = [];

  // moduleFiles.forEach(moduleFile => {
  //   loadModuleFileTree(moduleFiles, moduleFileTree, moduleFile);
  // });

  // const cmps = moduleFiles.reduce((cmps, m) => {
  //   cmps.push(...m.cmps);
  //   return cmps;
  // }, [] as d.ComponentCompilerMeta[]);

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
    listener: cmps.some(c => c.hasListener),
    member: cmps.some(c => c.hasMember),
    method: cmps.some(c => c.hasMethod),
    mode: cmps.some(c => c.hasMode),
    noRenderFn: cmps.every(c => !c.hasRenderFn),
    noVdomRender: cmps.every(c => !c.hasVdomRender),
    observeAttr: cmps.some(c => c.hasAttr),
    prop: cmps.some(c => c.hasProp),
    propMutable: cmps.some(c => c.hasPropMutable),
    reflectToAttr: cmps.some(c => c.hasReflectToAttr),
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
  };

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
  b.taskQueue = (b.updatable || b.mode || b.lifecycle || b.lazyLoad || !!config.exposeAppOnReady);
  b.refs = (b.updatable || b.member || b.lifecycle || b.listener);

  b.exposeAppOnReady = (b.lazyLoad && !!config.exposeAppOnReady);
  b.exposeAppRegistry = (b.lazyLoad && !!config.exposeAppRegistry);
  b.exposeReadQueue = !!config.exposeReadQueue;
  b.exposeWriteQueue = (b.taskQueue && !!config.exposeWriteQueue);
  b.exposeEventListener = (b.listener && !!config.exposeEventListener);
  b.exposeRequestAnimationFrame = (b.taskQueue && !!config.exposeRequestAnimationFrame);

  b.coreImportPath = pathJoin(config, sys.compiler.distDir, 'client', 'index.js');
}


// function loadModuleFileTree(allModulesFiles: d.Module[], moduleFileTree: d.Module[], moduleFile: d.Module) {
//   if (moduleFile) {
//     if (!moduleFileTree.includes(moduleFile)) {
//       moduleFileTree.push(moduleFile);
//     }

//     moduleFile.localImports && moduleFile.localImports.forEach(localImport => {
//       const subModuleFile = allModulesFiles.find(moduleFile => {
//         return (moduleFile.sourceFilePath === localImport) ||
//                (moduleFile.sourceFilePath === localImport + '.ts') ||
//                (moduleFile.sourceFilePath === localImport + '.tsx') ||
//                (moduleFile.sourceFilePath === localImport + '.js');
//       });

//       loadModuleFileTree(allModulesFiles, moduleFileTree, subModuleFile);
//     });
//   }
// }


export function getDefaultBuildConditionals() {
  const b: d.Build = {
    allRenderFn: false,
    appNamespace: 'App',
    appNamespaceLower: 'app',
    // cmps: [],
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
    refs: true,
    hasRenderFn: true,
    noRenderFn: false,
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
    isDebug: false,
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
    exposeAppOnReady: true,
    exposeAppRegistry: true,
    exposeReadQueue: true,
    exposeWriteQueue: true,
    exposeEventListener: true,
    exposeRequestAnimationFrame: true,
    syncQueue: false,
    coreImportPath: '.'
  };
  return b;
}

export function resetBuildConditionals(b: d.Build) {
  Object.assign(b, getDefaultBuildConditionals());
}

export const BUILD = getDefaultBuildConditionals();
