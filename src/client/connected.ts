import { ComponentController, ComponentMeta, ConfigApi, PlatformApi, ProxyElement, RendererApi } from '../util/interfaces';
import { isDef } from '../util/helpers';
import { queueUpdate } from './update';


export function connectedCallback(plt: PlatformApi, config: ConfigApi, renderer: RendererApi, elm: ProxyElement, ctrl: ComponentController, cmpMeta: ComponentMeta) {
  plt.nextTick(() => {
    const tag = cmpMeta.tag;
    const mode = getMode(plt, config, elm, 'mode');
    const cmpMode = cmpMeta.modes[mode];

    plt.loadComponent(cmpMeta, cmpMode, function loadComponentCallback() {
      queueUpdate(plt, config, renderer, elm, ctrl, tag);
    });
  });
}


function getMode(plt: PlatformApi, config: ConfigApi, elm: HTMLElement, propName: string): string {
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
