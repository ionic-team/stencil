import { ComponentMeta, ConfigApi, PlatformApi, ProxyElement, RendererApi } from '../util/interfaces';
import { isDef } from '../util/helpers';
import { queueUpdate } from './update';
import { LOW_PRIORITY } from '../util/constants';


export function connectedCallback(plt: PlatformApi, config: ConfigApi, renderer: RendererApi, elm: ProxyElement, cmpMeta: ComponentMeta) {
  if (!elm.$tmpDisconnected) {
    plt.nextTick(() => {
      const tag = cmpMeta.tag;

      // console.log(elm.nodeName, 'connectedCallback nextTick');
      const cmpMode = cmpMeta.modes.find(m => m.modeName === getMode(plt, config, elm, 'mode') || m.modeName === 'default');

      plt.loadBundle(cmpMode.bundleId, cmpMeta.priority, function loadComponentCallback() {
        queueUpdate(plt, config, renderer, elm, tag, LOW_PRIORITY);
      });
    });
  }
}


function getMode(plt: PlatformApi, config: ConfigApi, elm: ProxyElement, propName: string): string {
  let value = elm[propName];
  if (isDef(value)) {
    return value;
  }

  value = plt.$getAttribute(elm, propName);
  if (isDef(value)) {
    return value;
  }

  return config.get(propName, 'md');
}
