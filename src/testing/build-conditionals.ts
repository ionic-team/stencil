import * as d from '../declarations';


export const BUILD: d.Build = {};


export function resetBuildConditionals(b: d.Build) {
  Object.keys(b).forEach(key => {
    (b as any)[key] = true;
  });

  b.isDev = true;
  b.lazyLoad = true;
  b.member = true;
  b.reflect = true;
  b.scoped = true;
  b.shadowDom = true;
  b.slotRelocation = true;
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
  b.hydrateClientSide = false;
  b.hydrateServerSide = false;
}
