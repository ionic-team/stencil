import { DomApi, HostElement, PlatformApi } from '../declarations';
import { noop } from '../util/helpers';


export function patchDomApi(plt: PlatformApi, domApi: DomApi) {

  const orgCreateElement = domApi.$createElement;
  domApi.$createElement = (tagName: string) => {
    const elm = orgCreateElement(tagName) as HostElement;

    const cmpMeta = plt.getComponentMeta(elm);
    if (cmpMeta && !cmpMeta.componentConstructor) {
      plt.connectHostElement(cmpMeta, elm);
      plt.loadBundle(cmpMeta, elm.mode, noop);
    }

    return elm;
  };

}
