import { ComponentController, ComponentMeta, ProxyElement, Renderer } from '../utils/interfaces';
import { Config } from '../utils/config';
import { isDef } from '../utils/helpers';
import { PlatformApi } from '../platform/platform-api';
import { queueUpdate } from './update';


export function connectedCallback(plt: PlatformApi, config: Config, renderer: Renderer, elm: ProxyElement, ctrl: ComponentController, cmpMeta: ComponentMeta) {
  plt.nextTick(() => {
    const tag = cmpMeta.tag;
    const mode = getMode(plt, config, elm, 'mode');
    const cmpMode = cmpMeta.modes[mode];

    plt.loadComponent(cmpMeta, cmpMode, function loadComponentCallback() {
      queueUpdate(plt, config, renderer, elm, ctrl, tag);
    });
  });
}


function getMode(plt: PlatformApi, config: Config, elm: HTMLElement, propName: string): string {
  let value = plt.getProperty(elm, propName);
  if (isDef(value)) {
    return value;
  }

  value = plt.getAttribute(elm, propName);
  if (isDef(value)) {
    return value;
  }

  return config.get(propName);
}
