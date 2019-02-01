import * as d from '@declarations';


export const BUILD: d.Build = {};


export function resetBuildConditionals(b: d.Build) {
  Object.keys(b).forEach(key => {
    if (typeof (b as any)[key] === 'boolean') {
      (b as any)[key] = false;
    } else {
      (b as any)[key] = null;
    }
  });

  b.isDev = true;
  b.clientSide = true;
  b.lazyLoad = true;
}
