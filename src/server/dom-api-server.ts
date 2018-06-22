import * as d from '../declarations';
import { initHostElement } from '../core/init-host-element';
import { initHostSnapshot } from '../core/host-snapshot';


export function patchDomApi(config: d.Config, plt: d.PlatformApi, domApi: d.DomApi) {

  const orgCreateElement = domApi.$createElement;
  domApi.$createElement = (tagName: string) => {
    const elm = orgCreateElement(tagName) as d.HostElement;

    const cmpMeta = plt.getComponentMeta(elm);
    if (cmpMeta && !cmpMeta.componentConstructor) {
      initHostElement(plt, cmpMeta, elm, config.namespace);
      const hostSnapshot = initHostSnapshot(domApi, cmpMeta, elm);
      plt.hostSnapshotMap.set(elm, hostSnapshot);
      plt.requestBundle(cmpMeta, elm);
    }

    return elm;
  };

}
