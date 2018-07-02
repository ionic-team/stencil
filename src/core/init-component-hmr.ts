import * as d from '../declarations';
import { initHostSnapshot } from './host-snapshot';


export function initComponentHmr(plt: d.PlatformApi, cmpMeta: d.ComponentMeta, elm: d.HostElement, hmrVersionId: string) {
  // keep the existing state
  // forget the constructor
  cmpMeta.componentConstructor = null;

  // forget the instance
  const instance = plt.instanceMap.get(elm);
  if (instance) {
    plt.hostElementMap.delete(instance);
    plt.instanceMap.delete(elm);
  }

  plt.hostSnapshotMap.set(elm, initHostSnapshot(plt.domApi, cmpMeta, elm));

  // request the bundle again
  plt.requestBundle(cmpMeta, elm, hmrVersionId);
}
