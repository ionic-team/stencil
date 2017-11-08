import { BuildContext, ComponentMeta, BuildConditionals, ManifestBundle } from '../../util/interfaces';
import { ENCAPSULATION, MEMBER_TYPE, PROP_TYPE } from '../../util/constants';


export function setBuildConditionals(ctx: BuildContext, manifestBundles: ManifestBundle[]) {
  // figure out which sections of the core code this build doesn't even need
  const coreBuild: BuildConditionals = ({} as any);

  manifestBundles.forEach(manifestBundle => {
    manifestBundle.moduleFiles.forEach(moduleFile => {
      if (moduleFile.cmpMeta) {
        setBuildFromComponentMeta(coreBuild, moduleFile.cmpMeta);
        setBuildFromComponentContent(coreBuild, ctx.jsFiles[moduleFile.jsFilePath]);
      }
    });
  });

  return coreBuild;
}


export function setBuildFromComponentMeta(coreBuild: BuildConditionals, cmpMeta: ComponentMeta) {
  if (!cmpMeta) return;

  if (cmpMeta.membersMeta) {
    const memberNames = Object.keys(cmpMeta.membersMeta);
    memberNames.forEach(memberName => {
      const memberType = cmpMeta.membersMeta[memberName].memberType;
      const propType = cmpMeta.membersMeta[memberName].propType;

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
    });
  }

  if (cmpMeta.eventsMeta && cmpMeta.eventsMeta.length) {
    coreBuild.event = true;
  }

  if (cmpMeta.listenersMeta && cmpMeta.listenersMeta.length) {
    coreBuild.listener = true;
  }

  if (cmpMeta.encapsulation === ENCAPSULATION.ShadowDom) {
    coreBuild.shadowDom = true;

  } else if (cmpMeta.slotMeta) {
    // not using shadow dom
    // and this component is using a slot
    coreBuild.customSlot = true;
  }

  if (cmpMeta.encapsulation === ENCAPSULATION.ScopedCss) {
    coreBuild.scopedCss = true;
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

  if (!coreBuild.render) {
    coreBuild.render = (jsText.indexOf('render') > -1);
  }

  if (!coreBuild.svg) {
    jsText = jsText.toLowerCase();
    coreBuild.svg = (jsText.indexOf('svg') > -1);
  }
}
