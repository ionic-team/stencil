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
  // TODO(STENCIL-914): remove this option when `experimentalSlotFixes` is the default behavior
  build.appendChildSlotFix = false;
  // TODO(STENCIL-914): remove this option when `experimentalSlotFixes` is the default behavior
  build.slotChildNodesFix = false;
  // TODO(STENCIL-914): remove this option when `experimentalSlotFixes` is the default behavior
  build.experimentalSlotFixes = false;
  // TODO(STENCIL-1086): remove this option when it's the default behavior
  build.experimentalScopedSlotChanges = false;
  // TODO(STENCIL-914): remove this option when `experimentalSlotFixes` is the default behavior
  build.cloneNodeFix = false;
  build.cssAnnotations = true;
  // TODO(STENCIL-854): Remove code related to legacy shadowDomShim field
  build.shadowDomShim = true;
  build.hydratedAttribute = false;
  build.hydratedClass = true;
  // TODO(STENCIL-1305): remove this option
  build.scriptDataOpts = false;
  build.attachStyles = true;

  return build;
};
