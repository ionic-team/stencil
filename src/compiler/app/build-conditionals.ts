import * as d from '../../declarations';
import { ENCAPSULATION, MEMBER_TYPE, PROP_TYPE } from '../../util/constants';
import { isTsFile } from '../util';


export async function setBuildConditionals(
  config: d.Config,
  compilerCtx: d.CompilerCtx,
  coreId: 'core' | 'core.pf',
  buildCtx: d.BuildCtx,
  entryModules: d.EntryModule[]
) {
  const existingCoreBuild = getLastBuildConditionals(compilerCtx, coreId, buildCtx);
  if (existingCoreBuild) {
    // cool we can use the last build conditionals
    // because it's a rebuild, and was probably only a css or html change
    // if it was a typescript change we need to do a full rebuild again
    return existingCoreBuild;
  }

  // figure out which sections of the core code this build doesn't even need
  const coreBuild: d.BuildConditionals = ({} as any);
  coreBuild.coreId = coreId;
  coreBuild.clientSide = true;
  coreBuild.isDev = !!config.devMode;
  coreBuild.isProd = !config.devMode;

  coreBuild.hasSlot = !!buildCtx.hasSlot;
  coreBuild.hasSvg = !!buildCtx.hasSvg;

  coreBuild.devInspector = config.devInspector;
  coreBuild.verboseError = config.devMode;

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
    coreBuild.slotPolyfill = !!coreBuild.slotPolyfill;
    if (coreBuild.slotPolyfill) {
      coreBuild.slotPolyfill = !!(buildCtx.hasSlot);
    }
    compilerCtx.lastBuildConditionalsEsm = coreBuild;

  } else if (coreId === 'core.pf') {
    coreBuild.es5 = true;
    coreBuild.polyfills = true;
    coreBuild.cssVarShim = true;
    coreBuild.slotPolyfill = !!(buildCtx.hasSlot);
    compilerCtx.lastBuildConditionalsEs5 = coreBuild;
  }

  coreBuild.slotPolyfill = true;
  coreBuild.hasSvg = true;

  return coreBuild;
}


export function getLastBuildConditionals(compilerCtx: d.CompilerCtx, coreId: 'core' | 'core.pf', buildCtx: d.BuildCtx) {
  if (compilerCtx.isRebuild && Array.isArray(buildCtx.filesChanged)) {
    // this is a rebuild and we do have lastBuildConditionals already
    const hasChangedTsFile = buildCtx.filesChanged.some(filePath => {
      return isTsFile(filePath);
    });

    if (!hasChangedTsFile) {
      // we didn't have a typescript change
      // so it's ok to use the lastBuildConditionals
      if (coreId === 'core' && compilerCtx.lastBuildConditionalsEsm) {
        return compilerCtx.lastBuildConditionalsEsm;
      }

      if (coreId === 'core.pf' && compilerCtx.lastBuildConditionalsEs5) {
        return compilerCtx.lastBuildConditionalsEs5;
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
  if (!cmpMeta) return;

  if (cmpMeta.encapsulation === ENCAPSULATION.ShadowDom) {
    coreBuild.shadowDom = true;
  } else {
    coreBuild.slotPolyfill = true;
  }

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

      if (memberMeta.reflectToAttr) {
        coreBuild.reflectToAttr = true;
      }
    });
  }

  if (cmpMeta.eventsMeta && cmpMeta.eventsMeta.length) {
    coreBuild.event = true;
  }

  if (cmpMeta.listenersMeta && cmpMeta.listenersMeta.length) {
    coreBuild.listener = true;
  }

  if (cmpMeta.stylesMeta) {
    coreBuild.styles = true;
  }

  if (cmpMeta.hostMeta && cmpMeta.hostMeta.theme) {
    coreBuild.hostTheme = true;
  }
}


export function setBuildFromComponentContent(coreBuild: d.BuildConditionals, jsText: string) {
  if (typeof jsText !== 'string') return;

  // hacky to do it this way...yeah
  // but with collections the components may have been
  // built many moons ago, so we don't want to lock ourselves
  // into a very certain way that components can be parsed
  // so here we're just doing raw string checks, and there
  // wouldn't be any harm if a build section was included when it
  // wasn't needed, but these keywords are all pretty unique already

  if (!coreBuild.cmpWillLoad) {
    coreBuild.cmpWillLoad = (jsText.includes('componentWillLoad'));
  }

  if (!coreBuild.cmpDidLoad) {
    coreBuild.cmpDidLoad = (jsText.includes('componentDidLoad'));
  }

  if (!coreBuild.cmpWillUpdate) {
    coreBuild.cmpWillUpdate = (jsText.includes('componentWillUpdate'));
  }

  if (!coreBuild.cmpDidUpdate) {
    coreBuild.cmpDidUpdate = (jsText.includes('componentDidUpdate'));
  }

  if (!coreBuild.cmpDidUnload) {
    coreBuild.cmpDidUnload = (jsText.includes('componentDidUnload'));
  }

  if (!coreBuild.hostData) {
    coreBuild.hostData = (jsText.includes('hostData'));
  }

}
