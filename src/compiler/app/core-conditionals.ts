import { ComponentMeta, CoreBuildConditionals, ManifestBundle } from '../../util/interfaces';
import { ENCAPSULATION, MEMBER_TYPE, PROP_TYPE } from '../../util/constants';


export function setCoreBuildConditionals(coreBuild: CoreBuildConditionals, manifestBundles: ManifestBundle[]) {
  // figure out which sections of the core code this build doesn't even need
  manifestBundles.forEach(manifestBundle => {
    manifestBundle.moduleFiles.forEach(moduleFile => {
      setComponentCoreBuild(coreBuild, moduleFile.cmpMeta);
    });
  });
}


export function setComponentCoreBuild(coreBuild: CoreBuildConditionals, cmpMeta: ComponentMeta) {
  if (!cmpMeta || !cmpMeta.membersMeta) return;

  const memberNames = Object.keys(cmpMeta.membersMeta);
  memberNames.forEach(memberName => {
    const memberType = cmpMeta.membersMeta[memberName].memberType;
    const propType = cmpMeta.membersMeta[memberName].propType;

    if (memberType === MEMBER_TYPE.Prop || memberType === MEMBER_TYPE.PropMutable) {
      coreBuild._build_prop = true;

      if (propType === PROP_TYPE.String || propType === PROP_TYPE.Number || propType === PROP_TYPE.Boolean) {
        coreBuild._build_observe_attr = true;
      }

    } else if (memberType === MEMBER_TYPE.State) {
      coreBuild._build_state = true;

    } else if (memberType === MEMBER_TYPE.PropConnect) {
      coreBuild._build_prop = true;
      coreBuild._build_prop_connect = true;

    } else if (memberType === MEMBER_TYPE.PropContext) {
      coreBuild._build_prop = true;
      coreBuild._build_prop_context = true;

    } else if (memberType === MEMBER_TYPE.Method) {
      coreBuild._build_method = true;

    } else if (memberType === MEMBER_TYPE.Element) {
      coreBuild._build_element = true;
    }
  });

  if (!coreBuild._build_event) {
    coreBuild._build_event = !!(cmpMeta.eventsMeta && cmpMeta.eventsMeta.length);
  }

  if (!coreBuild._build_listener) {
    coreBuild._build_listener = !!(cmpMeta.listenersMeta && cmpMeta.listenersMeta.length);
  }

  if (!coreBuild._build_shadow_dom) {
    coreBuild._build_shadow_dom = (cmpMeta.encapsulation === ENCAPSULATION.ShadowDom);
  }

  if (!coreBuild._build_scoped_css) {
    coreBuild._build_scoped_css = (cmpMeta.encapsulation === ENCAPSULATION.ScopedCss);
  }

  if (!coreBuild._build_styles) {
    coreBuild._build_styles = !!cmpMeta.stylesMeta;
  }
}
