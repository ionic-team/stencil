import { ComponentMeta, ConfigApi, PlatformApi, ProxyElement, RendererApi } from '../util/interfaces';
import { isDef } from '../util/helpers';
import { queueUpdate } from './update';


export function connectedCallback(plt: PlatformApi, config: ConfigApi, renderer: RendererApi, elm: ProxyElement, cmpMeta: ComponentMeta) {
  plt.nextTick(() => {
    const tag = cmpMeta.tag;

    let cmpMode = cmpMeta.modes[getMode(plt, config, elm, 'mode')];
    if (!cmpMode) {
      cmpMode = cmpMeta.modes.default;
    }

    plt.loadComponent(cmpMode.bundleId, function loadComponentCallback() {
      queueUpdate(plt, config, renderer, elm, tag);
    });
  });
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
