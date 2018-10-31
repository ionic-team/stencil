import * as d from '../declarations';
import { ENCAPSULATION, MEMBER_TYPE, PROP_TYPE } from './constants';
import { isTsFile } from '../compiler/util';


export function getDefaultBuildConditionals(): d.BuildConditionals {
  return {
    coreId: 'core',
    polyfills: false,
    cssVarShim: true,
    shadowDom: true,
    slotPolyfill: true,
    ssrServerSide: true,
    devInspector: true,
    hotModuleReplacement: true,
    verboseError: true,
    styles: true,
    hostData: true,
    hostTheme: true,
    reflectToAttr: true,
    hasSlot: true,
    hasSvg: true,
    observeAttr: true,
    isDev: true,
    isProd: false,
    profile: false,
    element: true,
    event: true,
    listener: true,
    method: true,
    propConnect: true,
    propContext: true,
    watchCallback: true,
    cmpDidLoad: true,
    cmpWillLoad: true,
    cmpDidUpdate: true,
    cmpWillUpdate: true,
    cmpDidUnload: true,
    clientSide: false,
    externalModuleLoader: false,
    browserModuleLoader: false,
    es5: false
  };
}

export async function setBuildConditionals(
  config: d.Config,
  compilerCtx: d.CompilerCtx,
  coreId: d.BuildCoreIds,
  buildCtx: d.BuildCtx,
  entryModules: d.EntryModule[]
): Promise<d.BuildConditionals> {
  const existingCoreBuild = getLastBuildConditionals(compilerCtx, coreId, buildCtx);
  if (existingCoreBuild) {
    // cool we can use the last build conditionals
    // because it's a rebuild, and was probably only a css or html change
    // if it was a typescript change we need to do a full rebuild again
    return existingCoreBuild;
  }

  // figure out which sections of the core code this build doesn't even need
  const coreBuild = {
    coreId: coreId,
    clientSide: true,
    isDev: !!config.devMode,
    isProd: !config.devMode,
    profile: !!(config.flags && config.flags.profile),

    hasSlot: !!buildCtx.hasSlot,
    hasSvg: !!buildCtx.hasSvg,

    devInspector: config.devInspector,
    hotModuleReplacement: config.devMode,
    verboseError: config.devMode,

    externalModuleLoader: false,
    browserModuleLoader: false,
    polyfills: false,
    es5: false,
    cssVarShim: false,
    ssrServerSide: false,
    shadowDom: false,
    slotPolyfill: false,
    event: false,
    listener: false,
    styles: false,
    hostTheme: false,
    observeAttr: false,
    propConnect: false,
    propContext: false,
    method: false,
    element: false,
    watchCallback: false,
    reflectToAttr: false,
    cmpWillLoad: false,
    cmpDidLoad: false,
    cmpWillUpdate: false,
    cmpDidUpdate: false,
    cmpDidUnload: false,
    hostData: false
  };

  const promises: Promise<void>[] = [];

  entryModules.forEach(bundle => {
    bundle.moduleFiles.forEach(moduleFile => {
      if (moduleFile.cmpMeta) {
        promises.push(setBuildFromComponent(config, compilerCtx, coreBuild, moduleFile));
      }
    });
  });

  await Promise.all(promises);

  if (coreId === 'core') {
    coreBuild.browserModuleLoader = true;
    coreBuild.slotPolyfill = !!coreBuild.slotPolyfill;
    if (coreBuild.slotPolyfill) {
      coreBuild.slotPolyfill = !!(buildCtx.hasSlot);
    }
    compilerCtx.lastBuildConditionalsBrowserEsm = coreBuild;

  } else if (coreId === 'core.pf') {
    coreBuild.browserModuleLoader = true;
    coreBuild.es5 = true;
    coreBuild.polyfills = true;
    coreBuild.cssVarShim = true;
    coreBuild.slotPolyfill = !!(buildCtx.hasSlot);
    compilerCtx.lastBuildConditionalsBrowserEs5 = coreBuild;

  } else if (coreId === 'esm.es5') {
    coreBuild.es5 = true;
    coreBuild.externalModuleLoader = true;
    coreBuild.cssVarShim = true;
    coreBuild.slotPolyfill = true;
    compilerCtx.lastBuildConditionalsEsmEs5 = coreBuild;

  } else if (coreId === 'esm.es2017') {
    coreBuild.externalModuleLoader = true;
    coreBuild.slotPolyfill = !!coreBuild.slotPolyfill;
    if (coreBuild.slotPolyfill) {
      coreBuild.slotPolyfill = !!(buildCtx.hasSlot);
    }
    compilerCtx.lastBuildConditionalsEsmEs2017 = coreBuild;
  }

  coreBuild.slotPolyfill = true;
  coreBuild.hasSvg = true;

  return coreBuild;
}


export function getLastBuildConditionals(compilerCtx: d.CompilerCtx, coreId: d.BuildCoreIds, buildCtx: d.BuildCtx) {
  if (buildCtx.isRebuild && Array.isArray(buildCtx.filesChanged)) {
    // this is a rebuild and we do have lastBuildConditionals already
    const hasChangedTsFile = buildCtx.filesChanged.some(filePath => {
      return isTsFile(filePath);
    });

    if (!hasChangedTsFile) {
      // we didn't have a typescript change
      // so it's ok to use the lastBuildConditionals
      if (coreId === 'core' && compilerCtx.lastBuildConditionalsBrowserEsm) {
        return compilerCtx.lastBuildConditionalsBrowserEsm;
      }

      if (coreId === 'core.pf' && compilerCtx.lastBuildConditionalsBrowserEs5) {
        return compilerCtx.lastBuildConditionalsBrowserEs5;
      }

      if (coreId === 'esm.es5' && compilerCtx.lastBuildConditionalsEsmEs5) {
        return compilerCtx.lastBuildConditionalsEsmEs5;
      }

      if (coreId === 'esm.es2017' && compilerCtx.lastBuildConditionalsEsmEs2017) {
        return compilerCtx.lastBuildConditionalsEsmEs2017;
      }
    }
  }

  // we've gotta do a full rebuild of the build conditionals object again
  return null;
}


async function setBuildFromComponent(config: d.Config, compilerCtx: d.CompilerCtx, coreBuild: d.BuildConditionals, moduleFile: d.ModuleFile) {
  setBuildFromComponentMeta(coreBuild, moduleFile.cmpMeta);

  if (moduleFile.jsFilePath) {
    try {
      const jsText = await compilerCtx.fs.readFile(moduleFile.jsFilePath);
      setBuildFromComponentContent(coreBuild, jsText);

    } catch (e) {
      config.logger.debug(`setBuildFromComponent: ${moduleFile.jsFilePath}: ${e}`);
    }
  }
}


export function setBuildFromComponentMeta(coreBuild: d.BuildConditionals, cmpMeta: d.ComponentMeta) {
  if (!cmpMeta) {
    return;
  }

  coreBuild.shadowDom = coreBuild.shadowDom || cmpMeta.encapsulationMeta === ENCAPSULATION.ShadowDom;
  coreBuild.slotPolyfill = coreBuild.slotPolyfill || cmpMeta.encapsulationMeta !== ENCAPSULATION.ShadowDom;
  coreBuild.event = coreBuild.event || !!(cmpMeta.eventsMeta && cmpMeta.eventsMeta.length > 0);
  coreBuild.listener = coreBuild.listener || !!(cmpMeta.listenersMeta && cmpMeta.listenersMeta.length > 0);
  coreBuild.styles = coreBuild.styles || !!cmpMeta.stylesMeta;
  coreBuild.hostTheme = coreBuild.hostTheme || !!(cmpMeta.hostMeta && cmpMeta.hostMeta.theme);

  if (cmpMeta.membersMeta) {
    const memberNames = Object.keys(cmpMeta.membersMeta);

    memberNames.forEach(memberName => {
      const memberMeta = cmpMeta.membersMeta[memberName];
      const memberType = memberMeta.memberType;
      const propType = memberMeta.propType;

      if (memberType === MEMBER_TYPE.Prop || memberType === MEMBER_TYPE.PropMutable) {
        if (propType === PROP_TYPE.String || propType === PROP_TYPE.Number || propType === PROP_TYPE.Boolean || propType === PROP_TYPE.Any) {
          coreBuild.observeAttr = true;
        }

      } else if (memberType === MEMBER_TYPE.PropConnect) {
        coreBuild.propConnect = true;

      } else if (memberType === MEMBER_TYPE.PropContext) {
        coreBuild.propContext = true;

      } else if (memberType === MEMBER_TYPE.Method) {
        coreBuild.method = true;

      } else if (memberType === MEMBER_TYPE.Element) {
        coreBuild.element = true;
      }

      if (memberMeta.watchCallbacks && memberMeta.watchCallbacks.length > 0) {
        coreBuild.watchCallback = true;
      }

      if (memberMeta.reflectToAttrib) {
        coreBuild.reflectToAttr = true;
      }
    });
  }
}


export function setBuildFromComponentContent(coreBuild: d.BuildConditionals, jsText: string) {
  if (typeof jsText !== 'string') {
    return;
  }

  // hacky to do it this way...yeah
  // but with collections the components may have been
  // built many moons ago, so we don't want to lock ourselves
  // into a very certain way that components can be parsed
  // so here we're just doing raw string checks, and there
  // wouldn't be any harm if a build section was included when it
  // wasn't needed, but these keywords are all pretty unique already

  coreBuild.cmpWillLoad = coreBuild.cmpWillLoad || jsText.includes('componentWillLoad');
  coreBuild.cmpDidLoad = coreBuild.cmpDidLoad || jsText.includes('componentDidLoad');
  coreBuild.cmpWillUpdate = coreBuild.cmpWillUpdate || jsText.includes('componentWillUpdate');
  coreBuild.cmpDidUpdate = coreBuild.cmpDidUpdate || jsText.includes('componentDidUpdate');
  coreBuild.cmpDidUnload = coreBuild.cmpDidUnload || jsText.includes('componentDidUnload');
  coreBuild.hostData = coreBuild.hostData || jsText.includes('hostData');
}
