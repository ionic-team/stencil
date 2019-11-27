import * as d from '@stencil/core/internal';


export function resetBuildConditionals(b: d.BuildConditionals) {
  Object.keys(b).forEach(key => {
    (b as any)[key] = true;
  });

  b.isDev = true;
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
  b.vdomXlink = true;
  b.vdomClass = true;
  b.vdomStyle = true;
  b.vdomKey = true;
  b.vdomRef = true;
  b.vdomListener = true;
  b.vdomFunctional = true;
  b.vdomText = true;
  b.allRenderFn = false;
  b.devTools = false;
  b.hydrateClientSide = false;
  b.hydrateServerSide = false;
  b.cssAnnotations = false;
  b.style = false;
}
