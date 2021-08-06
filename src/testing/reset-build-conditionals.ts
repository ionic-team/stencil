import type * as d from '@stencil/core/internal';

export function resetBuildConditionals(b: d.BuildConditionals) {
  Object.keys(b).forEach((key) => {
    (b as any)[key] = true;
  });

  b.isDev = true;
  b.isTesting = true;
  b.isDebug = false;
  b.lazyLoad = true;
  b.member = true;
  b.reflect = true;
  b.scoped = true;
  b.shadowDom = true;
  b.slotRelocation = true;
  b.asyncLoading = true;
  b.svg = true;
  b.updatable = true;
  b.vdomAttribute = true;
  b.vdomClass = true;
  b.vdomFunctional = true;
  b.vdomKey = true;
  b.vdomPropOrAttr = true;
  b.vdomRef = true;
  b.vdomListener = true;
  b.vdomStyle = true;
  b.vdomText = true;
  b.vdomXlink = true;
  b.allRenderFn = false;
  b.devTools = false;
  b.hydrateClientSide = false;
  b.hydrateServerSide = false;
  b.cssAnnotations = false;
  b.style = false;
  b.hydratedAttribute = false;
  b.hydratedClass = true;
  b.cloneNodeFix = false;
  b.dynamicImportShim = false;
  b.hotModuleReplacement = false;
  b.safari10 = false;
  b.scriptDataOpts = false;
}
