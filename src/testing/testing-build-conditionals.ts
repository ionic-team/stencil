import * as d from '@declarations';


export const BUILD = {};


export function resetBuildConditionals(b: d.Build) {
  Object.keys(b).forEach(key => {
    if (typeof (b as any)[key] === 'boolean') {
      (b as any)[key] = false;
    } else {
      (b as any)[key] = null;
    }
  });

  b.appNamespace = 'TestApp';
  b.appNamespaceLower = 'testapp';

  b.isDev = true;
  b.clientSide = true;
  b.lazyLoad = true;
}
