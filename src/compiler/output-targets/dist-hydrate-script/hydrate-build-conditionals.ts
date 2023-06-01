import type * as d from '../../../declarations';
import { getBuildFeatures } from '../../app-core/app-data';

export const getHydrateBuildConditionals = (cmps: d.ComponentCompilerMeta[]) => {
  const build = getBuildFeatures(cmps) as d.BuildConditionals;

  build.slotRelocation = true;
  build.lazyLoad = true;
  build.hydrateServerSide = true;
  build.hydrateClientSide = true;
  build.isDebug = false;
  build.isDev = false;
  build.isTesting = false;
  build.devTools = false;
  build.lifecycleDOMEvents = false;
  build.profile = false;
  build.hotModuleReplacement = false;
  build.updatable = true;
  build.member = true;
  build.constructableCSS = false;
  build.asyncLoading = true;
  build.appendChildSlotFix = false;
  build.slotChildNodesFix = false;
  build.cloneNodeFix = false;
  build.cssAnnotations = true;
  // TODO(STENCIL-854): Remove code related to legacy shadowDomShim field
  build.shadowDomShim = true;
  build.hydratedAttribute = false;
  build.hydratedClass = true;
  build.scriptDataOpts = false;
  build.attachStyles = true;

  return build;
};
