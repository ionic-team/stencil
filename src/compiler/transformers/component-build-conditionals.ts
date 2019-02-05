import * as d from '@declarations';
import { DEFAULT_STYLE_MODE } from '@utils';


export function setComponentBuildConditionals(cmpMeta: d.ComponentCompilerMeta) {
  if (cmpMeta.properties.length > 0) {
    cmpMeta.hasProp = true;
    cmpMeta.hasPropMutable = cmpMeta.properties.some(p => p.mutable);
    cmpMeta.hasReflect = cmpMeta.properties.some(p => p.reflect);
    console.log(cmpMeta.hasReflect);
    cmpMeta.hasAttribute = cmpMeta.properties.some(p => typeof p.attribute === 'string');
    // TODO
    // cmpMeta.hasWatchCallback = cmpMeta.properties.some(p => Array.isArray(p.watchCallbacks) && p.watchCallbacks.length > 0);
  }

  if (cmpMeta.states.length > 0) {
    cmpMeta.hasState = true;

    if (!cmpMeta.hasWatchCallback) {
      // TODO
      // cmpMeta.hasWatchCallback = cmpMeta.states.some(p => Array.isArray(p.watchCallbacks) && p.watchCallbacks.length > 0);
    }
  }

  if (cmpMeta.methods.length > 0) {
    cmpMeta.hasMethod = true;
  }

  if (cmpMeta.events.length > 0) {
    cmpMeta.hasEvent = true;
  }

  if (cmpMeta.listeners.length > 0) {
    cmpMeta.hasListener = true;
    cmpMeta.hasListenerTargetWindow = cmpMeta.listeners.some(l => l.target === 'window');
    cmpMeta.hasListenerTargetDocument = cmpMeta.listeners.some(l => l.target === 'document');
    cmpMeta.hasListenerTargetBody = cmpMeta.listeners.some(l => l.target === 'body');
    cmpMeta.hasListenerTargetParent = cmpMeta.listeners.some(l => l.target === 'parent');
    cmpMeta.hasListenerTarget = cmpMeta.listeners.some(l => !!l.target);
  }

  cmpMeta.hasMember = (cmpMeta.hasProp || cmpMeta.hasState || cmpMeta.hasElement || cmpMeta.hasMethod);

  cmpMeta.isUpdateable = (cmpMeta.hasProp || cmpMeta.hasState);

  if (cmpMeta.styles.length > 0) {
    cmpMeta.hasStyle = true;
    cmpMeta.hasMode = cmpMeta.styles.some(s => s.modeName !== DEFAULT_STYLE_MODE);
  }

  cmpMeta.hasLifecycle = (cmpMeta.hasComponentWillLoadFn || cmpMeta.hasComponentDidLoadFn || cmpMeta.hasComponentWillUpdateFn || cmpMeta.hasComponentDidUpdateFn || cmpMeta.hasComponentWillRenderFn || cmpMeta.hasComponentDidRenderFn);
}
