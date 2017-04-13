import { ComponentController, ConfigApi, PlatformApi, Props, ProxyElement, RendererApi } from '../util/interfaces';
import { getPropValue, toCamelCase } from '../util/helpers';
import { queueUpdate } from './update';


export function initProps(plt: PlatformApi, config: ConfigApi, renderer: RendererApi, elm: ProxyElement, ctrl: ComponentController, tag: string, props: Props) {
  const instance = ctrl.instance;
  const lastPropValues: {[propName: string]: any} = {};


  Object.keys(props).forEach(propName => {
    lastPropValues[propName] = getInitialValue(plt, config, elm, props, propName);

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
        console.error(`${propName}: passed in property values cannot be changed`);
      }
    });

  });
}


function getInitialValue(plt: PlatformApi, config: ConfigApi, elm: HTMLElement, props: Props, propName: string): any {
  let value = elm[propName];
  if (value !== undefined) {
    return value;
  }

  value = plt.$getAttribute(elm, toCamelCase(propName));
  if (value !== null && value !== '') {
    return getPropValue(props[propName].type, value);
  }

  value = config.get(propName);
  if (value !== null) {
    return value;
  }
}
