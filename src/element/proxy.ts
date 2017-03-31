import { Config } from '../utils/config';
import { ComponentController, ComponentMeta, Props, ProxyElement, Renderer } from '../utils/interfaces';
import { getPropValue, toCamelCase, toDashCase } from '../utils/helpers';
import { PlatformApi } from '../platform/platform-api';
import { queueUpdate } from './update';


export function initProps(plt: PlatformApi, config: Config, renderer: Renderer, elm: ProxyElement, ctrl: ComponentController, tag: string, props: Props) {
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


function getInitialValue(plt: PlatformApi, config: Config, elm: HTMLElement, props: Props, propName: string): any {
  let value = elm[propName];
  if (value !== undefined) {
    return value;
  }

  value = plt.getAttribute(elm, toCamelCase(propName));
  if (value !== undefined) {
    return getPropValue(props[propName].type, value);
  }

  value = config.get(propName);
  if (value !== undefined) {
    return value;
  }
}


export function initComponentMeta(tag: string, data: any[]) {
  const modeBundleIds = data[0];
  const props = data[1] || {};

  const cmpMeta: ComponentMeta = {
    tag: tag,
    modes: {},
    props: props
  };

  let keys = Object.keys(modeBundleIds);
  for (var i = 0; i < keys.length; i++) {
    cmpMeta.modes[keys[i]] = {
      bundleId: modeBundleIds[keys[i]]
    };
  }

  keys = cmpMeta.tag.split('-');
  keys.shift();
  cmpMeta.hostCss = keys.join('-');

  props.color = {};
  props.mode = {};

  const observedAttributes = cmpMeta.observedAttributes = cmpMeta.observedAttributes || [];

  keys = Object.keys(props);
  for (i = 0; i < keys.length; i++) {
    observedAttributes.push(toDashCase(keys[i]));
  }

  return cmpMeta;
}
