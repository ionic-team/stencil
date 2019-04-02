import * as d from '../declarations';
import { initElementListeners } from './listeners';
import { initHostSnapshot } from './host-snapshot';


export function hmrStart(plt: d.PlatformApi, cmpMeta: d.ComponentMeta, elm: d.HostElement, hmrVersionId: string) {
  // ¯\_(ツ)_/¯
  // keep the existing state
  // forget the constructor
  cmpMeta.componentConstructor = null;

  // no sir, this component has never loaded, not once, ever
  plt.isCmpLoaded.delete(elm);
  plt.isCmpReady.delete(elm);

  // forget the instance
  const instance = plt.instanceMap.get(elm);
  if (instance) {
    plt.hostElementMap.delete(instance);
    plt.instanceMap.delete(elm);
  }

  // detatch any event listeners that may have been added
  // because we're not passing an exact event name it'll
  // remove all of this element's event, which is good
  plt.domApi.$removeEventListener(elm);
  plt.hasListenersMap.delete(elm);
  cmpMeta.listenersMeta = null;

  // create a callback for when this component finishes hmr
  elm['s-hmr-load'] = () => {
    // finished hmr for this element
    delete elm['s-hmr-load'];
    hmrFinish(plt, cmpMeta, elm);
  };

  // create the new host snapshot from the element
  plt.hostSnapshotMap.set(elm, initHostSnapshot(plt.domApi, cmpMeta, elm));

  // request the bundle again
  plt.requestBundle(cmpMeta, elm, hmrVersionId);
}


export function hmrFinish(plt: d.PlatformApi, cmpMeta: d.ComponentMeta, elm: d.HostElement) {
  if (!plt.hasListenersMap.has(elm)) {
    plt.hasListenersMap.set(elm, true);

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
