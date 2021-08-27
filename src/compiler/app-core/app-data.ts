import {
  BuildConditionals,
  BuildFeatures,
  ComponentCompilerMeta,
  Config,
  Module,
  ModuleMap,
} from '@stencil/core/internal';
import { unique } from '@utils';

export * from '../../app-data';

export const getBuildFeatures = (cmps: ComponentCompilerMeta[]) => {
  const slot = cmps.some((c) => c.htmlTagNames.includes('slot'));
  const shadowDom = cmps.some((c) => c.encapsulation === 'shadow');
  const slotRelocation = cmps.some((c) => c.encapsulation !== 'shadow' && c.htmlTagNames.includes('slot'));
  const f: BuildFeatures = {
    allRenderFn: cmps.every((c) => c.hasRenderFn),
    cmpDidLoad: cmps.some((c) => c.hasComponentDidLoadFn),
    cmpShouldUpdate: cmps.some((c) => c.hasComponentShouldUpdateFn),
    cmpDidUnload: cmps.some((c) => c.hasComponentDidUnloadFn),
    cmpDidUpdate: cmps.some((c) => c.hasComponentDidUpdateFn),
    cmpDidRender: cmps.some((c) => c.hasComponentDidRenderFn),
    cmpWillLoad: cmps.some((c) => c.hasComponentWillLoadFn),
    cmpWillUpdate: cmps.some((c) => c.hasComponentWillUpdateFn),
    cmpWillRender: cmps.some((c) => c.hasComponentWillRenderFn),

    connectedCallback: cmps.some((c) => c.hasConnectedCallbackFn),
    disconnectedCallback: cmps.some((c) => c.hasDisconnectedCallbackFn),
    element: cmps.some((c) => c.hasElement),
    event: cmps.some((c) => c.hasEvent),
    hasRenderFn: cmps.some((c) => c.hasRenderFn),
    lifecycle: cmps.some((c) => c.hasLifecycle),
    asyncLoading: false,
    hostListener: cmps.some((c) => c.hasListener),
    hostListenerTargetWindow: cmps.some((c) => c.hasListenerTargetWindow),
    hostListenerTargetDocument: cmps.some((c) => c.hasListenerTargetDocument),
    hostListenerTargetBody: cmps.some((c) => c.hasListenerTargetBody),
    hostListenerTargetParent: cmps.some((c) => c.hasListenerTargetParent),
    hostListenerTarget: cmps.some((c) => c.hasListenerTarget),
    member: cmps.some((c) => c.hasMember),
    method: cmps.some((c) => c.hasMethod),
    mode: cmps.some((c) => c.hasMode),
    observeAttribute: cmps.some((c) => c.hasAttribute),
    prop: cmps.some((c) => c.hasProp),
    propBoolean: cmps.some((c) => c.hasPropBoolean),
    propNumber: cmps.some((c) => c.hasPropNumber),
    propString: cmps.some((c) => c.hasPropString),
    propMutable: cmps.some((c) => c.hasPropMutable),
    reflect: cmps.some((c) => c.hasReflect),
    scoped: cmps.some((c) => c.encapsulation === 'scoped'),
    shadowDom,
    shadowDelegatesFocus: shadowDom && cmps.some((c) => c.shadowDelegatesFocus),
    slot,
    slotRelocation,
    state: cmps.some((c) => c.hasState),
    style: cmps.some((c) => c.hasStyle),
    svg: cmps.some((c) => c.htmlTagNames.includes('svg')),
    updatable: cmps.some((c) => c.isUpdateable),
    vdomAttribute: cmps.some((c) => c.hasVdomAttribute),
    vdomXlink: cmps.some((c) => c.hasVdomXlink),
    vdomClass: cmps.some((c) => c.hasVdomClass),
    vdomFunctional: cmps.some((c) => c.hasVdomFunctional),
    vdomKey: cmps.some((c) => c.hasVdomKey),
    vdomListener: cmps.some((c) => c.hasVdomListener),
    vdomPropOrAttr: cmps.some((c) => c.hasVdomPropOrAttr),
    vdomRef: cmps.some((c) => c.hasVdomRef),
    vdomRender: cmps.some((c) => c.hasVdomRender),
    vdomStyle: cmps.some((c) => c.hasVdomStyle),
    vdomText: cmps.some((c) => c.hasVdomText),
    watchCallback: cmps.some((c) => c.hasWatchCallback),
    taskQueue: true,
  };
  f.asyncLoading = f.cmpWillUpdate || f.cmpWillLoad || f.cmpWillRender;
  f.vdomAttribute = f.vdomAttribute || f.reflect;
  f.vdomPropOrAttr = f.vdomPropOrAttr || f.reflect;

  return f;
};

export const updateComponentBuildConditionals = (moduleMap: ModuleMap, cmps: ComponentCompilerMeta[]) => {
  cmps.forEach((cmp) => {
    const importedModules = getModuleImports(moduleMap, cmp.sourceFilePath, []);
    importedModules.forEach((importedModule) => {
      // if the component already has a boolean true value it'll keep it
      // otherwise we get the boolean value from the imported module
      cmp.hasVdomAttribute = cmp.hasVdomAttribute || importedModule.hasVdomAttribute;
      cmp.hasVdomPropOrAttr = cmp.hasVdomPropOrAttr || importedModule.hasVdomPropOrAttr;
      cmp.hasVdomXlink = cmp.hasVdomXlink || importedModule.hasVdomXlink;
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

    cmp.htmlAttrNames = unique(cmp.htmlAttrNames);
    cmp.htmlTagNames = unique(cmp.htmlTagNames);
    cmp.potentialCmpRefs = unique(cmp.potentialCmpRefs);
  });
};

const getModuleImports = (moduleMap: ModuleMap, filePath: string, importedModules: Module[]) => {
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

  if (moduleFile != null && !importedModules.some((m) => m.sourceFilePath === moduleFile.sourceFilePath)) {
    importedModules.push(moduleFile);

    moduleFile.localImports.forEach((localImport) => {
      getModuleImports(moduleMap, localImport, importedModules);
    });
  }
  return importedModules;
};

export const updateBuildConditionals = (config: Config, b: BuildConditionals) => {
  b.isDebug = config.logLevel === 'debug';
  b.isDev = !!config.devMode;
  b.isTesting = !!config._isTesting;
  b.devTools = b.isDev && !config._isTesting;
  b.profile = !!config.profile;
  b.hotModuleReplacement = !!(
    config.devMode &&
    config.devServer &&
    config.devServer.reloadStrategy === 'hmr' &&
    !config._isTesting
  );
  b.updatable = b.updatable || b.hydrateClientSide || b.hotModuleReplacement;
  b.member = b.member || b.updatable || b.mode || b.lifecycle;
  b.constructableCSS = !b.hotModuleReplacement || !!config._isTesting;
  b.asyncLoading = !!(b.asyncLoading || b.lazyLoad || b.taskQueue || b.initializeNextTick);
  b.cssAnnotations = true;
  b.appendChildSlotFix = config.extras.appendChildSlotFix;
  b.slotChildNodesFix = config.extras.slotChildNodesFix;
  b.cloneNodeFix = config.extras.cloneNodeFix;
  b.dynamicImportShim = config.extras.dynamicImportShim;
  b.lifecycleDOMEvents = !!(b.isDebug || config._isTesting || config.extras.lifecycleDOMEvents);
  b.safari10 = config.extras.safari10;
  b.scriptDataOpts = config.extras.scriptDataOpts;
  b.shadowDomShim = config.extras.shadowDomShim;
  b.attachStyles = true;
  b.invisiblePrehydration = typeof config.invisiblePrehydration === 'undefined' ? true : config.invisiblePrehydration;
  if (b.shadowDomShim) {
    b.slotRelocation = b.slot;
  }
  if (config.hydratedFlag) {
    b.hydratedAttribute = config.hydratedFlag.selector === 'attribute';
    b.hydratedClass = config.hydratedFlag.selector === 'class';
  } else {
    b.hydratedAttribute = false;
    b.hydratedClass = false;
  }
};
