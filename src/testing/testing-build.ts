import * as d from '../declarations';


export function resetBuildConditionals(b: d.Build) {
  Object.keys(b).forEach(key => {
    if (typeof (b as any)[key] === 'boolean') {
      (b as any)[key] = false;
    } else if (Array.isArray((b as any)[key])) {
      (b as any)[key].length = 0;
    } else {
      (b as any)[key] = null;
    }
  });

  b.appNamespace = 'TestApp';
  b.appNamespaceLower = 'testapp';

  b.vdomAttribute = true;
  b.vdomClass = true;
  b.vdomStyle = true;
  b.vdomFunctional = true;
  b.vdomKey = true;
  b.vdomListener = true;
  b.vdomRef = true;
  b.vdomText = true;
  b.slot = true;
  b.svg = true;
  b.isDev = true;
  b.clientSide = true;

  b.lazyLoad = true;

  return b;
}

export const BUILD = resetBuildConditionals({});
