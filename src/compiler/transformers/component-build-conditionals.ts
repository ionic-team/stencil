import * as d from '../../declarations';
// import { DEFAULT_STYLE_MODE } from '../../util/constants';


export function gatherComponentBuildConditionals(cmpMeta: d.ComponentCompilerMeta) {

  if (cmpMeta.properties && cmpMeta.properties.length > 0) {
    cmpMeta.hasProp = true;
    cmpMeta.hasPropMutable = cmpMeta.properties.some(p => p.mutable);
    cmpMeta.hasReflectToAttr = cmpMeta.properties.some(p => p.reflectToAttr);
    cmpMeta.hasAttr = cmpMeta.properties.some(p => typeof p.attr === 'string');
    // cmpMeta.hasWatchCallback = cmpMeta.properties.some(p => Array.isArray(p.watchCallbacks) && p.watchCallbacks.length > 0);
  }

  if (cmpMeta.states && cmpMeta.states.length > 0) {
    cmpMeta.hasState = true;

    if (!cmpMeta.hasWatchCallback) {
      // cmpMeta.hasWatchCallback = cmpMeta.states.some(p => Array.isArray(p.watchCallbacks) && p.watchCallbacks.length > 0);
    }
  }

  cmpMeta.hasMember = (cmpMeta.hasProp || cmpMeta.hasState || cmpMeta.hasElement || cmpMeta.hasMethod);

  cmpMeta.isUpdateable = (cmpMeta.hasProp || cmpMeta.hasState);

  // if (cmpMeta.stylesMeta) {
  //   const modeNames = Object.keys(cmpMeta.stylesMeta);
  //   if (modeNames.length > 0) {
  //     cmpMeta.hasStyle = true;
  //     cmpMeta.hasMode = modeNames.filter(m => m !== DEFAULT_STYLE_MODE).length > 0;
  //   }
  // }
}
