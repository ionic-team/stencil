import { BuildConditionals, BuildCtx, CompilerCtx, ComponentMeta, Config, EntryModule, ModuleFile } from '../../declarations';
import { ENCAPSULATION, MEMBER_TYPE, PROP_TYPE } from '../../util/constants';


export async function setBuildConditionals(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, entryModules: EntryModule[]) {
  // figure out which sections of the core code this build doesn't even need
  const coreBuild: BuildConditionals = ({} as any);
  coreBuild.clientSide = true;
  coreBuild.isDev = !!config.devMode;
  coreBuild.isProd = !config.devMode;

  coreBuild.svg = !!buildCtx.hasSvg;

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

  return coreBuild;
}


async function setBuildFromComponent(config: Config, compilerCtx: CompilerCtx, coreBuild: BuildConditionals, moduleFile: ModuleFile) {
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


export function setBuildFromComponentMeta(coreBuild: BuildConditionals, cmpMeta: ComponentMeta) {
  if (!cmpMeta) return;

  if (cmpMeta.encapsulation === ENCAPSULATION.ShadowDom) {
    coreBuild.shadowDom = true;
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


export function setBuildFromComponentContent(coreBuild: BuildConditionals, jsText: string) {
  if (typeof jsText !== 'string') return;

  // hacky to do it this way...yeah
  // but with collections the components may have been
  // built many moons ago, so we don't want to lock ourselves
  // into a very certain way that components can be parsed
  // so here we're just doing raw string checks, and there
  // wouldn't be any harm if a build section was included when it
  // wasn't needed, but these keywords are all pretty unique already

  if (!coreBuild.cmpWillLoad) {
    coreBuild.cmpWillLoad = (jsText.indexOf('componentWillLoad') > -1);
  }

  if (!coreBuild.cmpDidLoad) {
    coreBuild.cmpDidLoad = (jsText.indexOf('componentDidLoad') > -1);
  }

  if (!coreBuild.cmpWillUpdate) {
    coreBuild.cmpWillUpdate = (jsText.indexOf('componentWillUpdate') > -1);
  }

  if (!coreBuild.cmpDidUpdate) {
    coreBuild.cmpDidUpdate = (jsText.indexOf('componentDidUpdate') > -1);
  }

  if (!coreBuild.cmpDidUnload) {
    coreBuild.cmpDidUnload = (jsText.indexOf('componentDidUnload') > -1);
  }

  if (!coreBuild.hostData) {
    coreBuild.hostData = (jsText.indexOf('hostData') > -1);
  }

}
