import * as d from '../../declarations';


export function getBuildFeatures(cmps: d.ComponentCompilerMeta[]) {
  const slot = cmps.some(c => c.htmlTagNames.includes('slot'));
  const f: d.BuildFeatures = {
    allRenderFn: cmps.every(c => c.hasRenderFn),
    cmpDidLoad: cmps.some(c => c.hasComponentDidLoadFn),
    cmpShouldUpdate:  cmps.some(c => c.hasComponentShouldUpdateFn),
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
    propBoolean: cmps.some(c => c.hasPropBoolean),
    propNumber: cmps.some(c => c.hasPropNumber),
    propString: cmps.some(c => c.hasPropString),
    propMutable: cmps.some(c => c.hasPropMutable),
    reflect: cmps.some(c => c.hasReflect),
    scoped: cmps.some(c => c.encapsulation === 'scoped'),
    shadowDom: cmps.some(c => c.encapsulation === 'shadow'),
    slot,
    slotRelocation: slot, // TODO: cmps.some(c => c.htmlTagNames.includes('slot') && c.encapsulation !== 'shadow'),
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


export function updateComponentBuildConditionals(moduleMap: d.ModuleMap, cmps: d.ComponentCompilerMeta[]) {
  cmps.forEach(cmp => {
    const importedModules = getModuleImports(moduleMap, cmp.sourceFilePath, []);
    importedModules.forEach(importedModule => {
      // if the component already has a boolean true value it'll keep it
      // otherwise we get the boolean value from the imported module
      cmp.hasVdomAttribute = cmp.hasVdomAttribute || importedModule.hasVdomAttribute;
      cmp.hasVdomClass = cmp.hasVdomClass || importedModule.hasVdomClass;
      cmp.hasVdomFunctional = cmp.hasVdomFunctional || importedModule.hasVdomFunctional;
      cmp.hasVdomKey = cmp.hasVdomKey || importedModule.hasVdomKey;
      cmp.hasVdomListener = cmp.hasVdomListener || importedModule.hasVdomListener;
      cmp.hasVdomRef = cmp.hasVdomRef || importedModule.hasVdomRef;
      cmp.hasVdomRender = cmp.hasVdomRender || importedModule.hasVdomRender;
      cmp.hasVdomStyle = cmp.hasVdomStyle || importedModule.hasVdomStyle;
      cmp.hasVdomText = cmp.hasVdomText || importedModule.hasVdomText;
      cmp.htmlAttrNames.push(...importedModule.htmlAttrNames);
      cmp.htmlTagNames.push(...importedModule.htmlTagNames);
      cmp.potentialCmpRefs.push(...importedModule.potentialCmpRefs);
    });
  });
}


function getModuleImports(moduleMap: d.ModuleMap, filePath: string, importedModules: d.Module[]) {
  let moduleFile = moduleMap.get(filePath);
  if (moduleFile == null) {
    moduleFile = moduleMap.get(filePath + '.tsx');
    if (moduleFile == null) {
      moduleFile = moduleMap.get(filePath + '.ts');
      if (moduleFile == null) {
        moduleFile = moduleMap.get(filePath + '.js');
      }
    }
  }

  if (moduleFile != null && !importedModules.some(m => m.sourceFilePath === moduleFile.sourceFilePath)) {
    importedModules.push(moduleFile);

    moduleFile.localImports.forEach(localImport => {
      getModuleImports(moduleMap, localImport, importedModules);
    });
  }
  return importedModules;
}


export function updateBuildConditionals(config: d.Config, b: d.Build) {
  b.isDebug = (config.logLevel === 'debug');
  b.isDev = !!config.devMode;
  b.lifecycleDOMEvents = !!(b.isDebug || config._isTesting || config._lifecycleDOMEvents);
  b.profile = !!(config.flags && config.flags.profile);
  b.hotModuleReplacement = !!(config.devMode && config.devServer && config.devServer.reloadStrategy === 'hmr' && !config._isTesting);
  b.updatable = (b.updatable || b.hydrateClientSide || b.hotModuleReplacement);
  b.member = (b.member || b.updatable || b.mode || b.lifecycle);
  b.taskQueue = (b.updatable || b.mode || b.lifecycle);
  b.constructableCSS = !b.hotModuleReplacement || !!config._isTesting;
  b.initializeNextTick = true; // config.outputTargets.some(isOutputTargetAngular);
  b.cssAnnotations = true;
}


export const BUILD: d.Build = {};
export const NAMESPACE = 'app';
