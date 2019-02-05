import * as d from '@declarations';


export const BUILD: d.Build = {};


export function resetBuildConditionals(b: d.Build) {
  Object.keys(b).forEach(key => {
    if (typeof (b as any)[key] === 'boolean') {
      (b as any)[key] = true;
    } else {
      (b as any)[key] = null;
    }
  });

  b.clientSide = true;
  b.isDev = true;
  b.lazyLoad = true;
  b.member = true;
  b.reflect = true;
  b.scoped = true;
  b.shadowDom = true;
  b.slotPolyfill = true;
  b.svg = true;
  b.updatable = true;
  b.vdomAttribute = true;
  b.vdomClass = true;
  b.vdomStyle = true;
  b.vdomKey = true;
  b.vdomRef = true;
  b.vdomListener = true;
  b.vdomFunctional = true;
  b.vdomText = true;
}
