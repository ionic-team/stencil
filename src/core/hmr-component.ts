import * as d from '../declarations';
import { initElementListeners } from './listeners';
import { initHostSnapshot } from './host-snapshot';


export function hmrStart(plt: d.PlatformApi, cmpMeta: d.ComponentMeta, elm: d.HostElement, hmrVersionId: string) {
  // ¯\_(ツ)_/¯
  // keep the existing state
  // forget the constructor
  const meta = plt.metaHostMap.get(elm);
  cmpMeta.componentConstructor = null;

  // no sir, this component has never loaded, not once, ever
  meta.isCmpLoaded = false;
  meta.isCmpReady = false;

  // forget the instance
  const instance = meta.instance;
  if (instance) {
    plt.metaInstanceMap.delete(instance);
    meta.instance = undefined;
  }

  // detatch any event listeners that may have been added
  // because we're not passing an exact event name it'll
  // remove all of this element's event, which is good
  plt.domApi.$removeEventListener(elm);
  meta.hasListeners = false;
  cmpMeta.listenersMeta = null;

  // create a callback for when this component finishes hmr
  elm['s-hmr-load'] = () => {
    // finished hmr for this element
    delete elm['s-hmr-load'];
    hmrFinish(plt, meta, cmpMeta, elm);
  };

  // create the new host snapshot from the element
  meta.hostSnapshot = initHostSnapshot(plt.domApi, cmpMeta, elm);

  // request the bundle again
  plt.requestBundle(cmpMeta, meta, hmrVersionId);
}


export function hmrFinish(plt: d.PlatformApi, meta: d.InternalMeta, cmpMeta: d.ComponentMeta, elm: d.HostElement) {
  if (!meta.hasListeners) {
    meta.hasListeners = true;

    // initElementListeners works off of cmp metadata
    // but we just got new data from the constructor
    // so let's update the cmp metadata w/ constructor listener data
    if (cmpMeta.componentConstructor && cmpMeta.componentConstructor.listeners) {
      cmpMeta.listenersMeta = cmpMeta.componentConstructor.listeners.map(lstn => {
        const listenerMeta: d.ListenMeta = {
          eventMethodName: lstn.method,
          eventName: lstn.name,
          eventCapture: !!lstn.capture,
          eventPassive: !!lstn.passive,
          eventDisabled: !!lstn.disabled,
        };
        return listenerMeta;
      });

      initElementListeners(plt, elm);
    }
  }
}
