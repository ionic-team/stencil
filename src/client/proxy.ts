import { ComponentController, ConfigApi, PlatformApi, Props, ProxyElement, RendererApi } from '../util/interfaces';
import { queueUpdate } from './update';


export function initProps(plt: PlatformApi, config: ConfigApi, renderer: RendererApi, elm: ProxyElement, ctrl: ComponentController, tag: string, props: Props) {
  const instance = ctrl.instance;
  const lastPropValues: {[propName: string]: any} = {};


  Object.keys(props).forEach(propName => {
    lastPropValues[propName] = getInitialValue(config, elm, props[propName].type, propName);

    function getPropValue() {
      return lastPropValues[propName];
    }

    // dom's element instance
    Object.defineProperty(elm, propName, {
      get: getPropValue,
      set: function setPropValue(value: any) {
        if (lastPropValues[propName] !== value) {
          lastPropValues[propName] = value;

          queueUpdate(plt, config, renderer, elm, ctrl, tag);
        }
      }
    });

    // user's component instance
    Object.defineProperty(instance, propName, {
      get: getPropValue,
      set: function invalidSetProperty() {
        console.error(`${propName}: passed in props cannot be changed`);
      }
    });

  });
}


function getInitialValue(config: ConfigApi, elm: HTMLElement, propType: string, propName: string): any {
  if (elm[propName] !== undefined) {
    return elm[propName];
  }

  if (propType === 'boolean') {
    return config.getBoolean(propName);
  }

  if (propType === 'number') {
    return config.getNumber(propName);
  }

  return config.get(propName);
}
