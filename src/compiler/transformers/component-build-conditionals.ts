import * as d from '../../declarations';
// import { DEFAULT_STYLE_MODE } from '../../util/constants';


export function gatherComponentBuildConditionals(cmpMeta: d.ComponentCompilerMeta) {
  const features = cmpMeta.features;
  if (cmpMeta.properties.length > 0) {
    features.hasProp = true;
    features.hasPropMutable = cmpMeta.properties.some(p => p.mutable);
    features.hasReflectToAttr = cmpMeta.properties.some(p => p.reflectToAttr);
    features.hasAttr = cmpMeta.properties.some(p => typeof p.attr === 'string');
    // cmpMeta.hasWatchCallback = cmpMeta.properties.some(p => Array.isArray(p.watchCallbacks) && p.watchCallbacks.length > 0);
  }

  if (cmpMeta.states.length > 0) {
    features.hasState = true;

    if (!features.hasWatchCallback) {
      // cmpMeta.hasWatchCallback = cmpMeta.states.some(p => Array.isArray(p.watchCallbacks) && p.watchCallbacks.length > 0);
    }
  }

  features.hasMember = (features.hasProp || features.hasState || features.hasElement || features.hasMethod);

  features.isUpdateable = (features.hasProp || features.hasState);

  // if (cmpMeta.stylesMeta) {
  //   const modeNames = Object.keys(cmpMeta.stylesMeta);
  //   if (modeNames.length > 0) {
  //     cmpMeta.hasStyle = true;
  //     cmpMeta.hasMode = modeNames.filter(m => m !== DEFAULT_STYLE_MODE).length > 0;
  //   }
  // }
}
