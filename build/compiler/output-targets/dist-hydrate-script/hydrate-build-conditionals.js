import { getBuildFeatures } from '../../app-core/app-data';
export const getHydrateBuildConditionals = (cmps) => {
    const build = getBuildFeatures(cmps);
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
    // TODO(STENCIL-914): remove this option when `experimentalSlotFixes` is the default behavior
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
//# sourceMappingURL=hydrate-build-conditionals.js.map