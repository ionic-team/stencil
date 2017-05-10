import { ComponentMeta, ConfigApi, PlatformApi, ProxyElement, RendererApi } from '../util/interfaces';
import { isDef } from '../util/helpers';
import { queueUpdate } from './update';


export function connectedCallback(plt: PlatformApi, config: ConfigApi, renderer: RendererApi, elm: ProxyElement, cmpMeta: ComponentMeta) {

  // Begin stack ide
  window.componentStack = window.componentStack || [];
  window.componentStack = window.componentStack.reduce((stack, item, index) => {
    if (item.contains(elm)) {
      return stack.concat(item);
    }

    return stack;
  }, []);

  var parent = window.componentStack[0];

  if (parent) {
    if (parent.$children.hasOwnProperty(elm.nodeName)) {
      parent.$children[elm.nodeName] += 1;
    } else {
      parent.$children[elm.nodeName] = 1;
    }
  }

  elm.$children = {};
  elm.$parent = parent;
  window.componentStack.unshift(elm);

  // End stack idea
  if (!elm.$tmpDisconnected) {
    plt.nextTick(() => {
      const tag = cmpMeta.tag;

      console.log(elm.nodeName, 'connectedCallback nextTick');
      const cmpMode = cmpMeta.modes.find(m => m.modeName === getMode(plt, config, elm, 'mode') || m.modeName === 'default');

      plt.loadBundle(cmpMode.bundleId, cmpMeta.priority, function loadComponentCallback() {
        queueUpdate(plt, config, renderer, elm, tag);
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
