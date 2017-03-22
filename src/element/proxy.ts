import { isNumber, isUndef, isString, toCamelCase } from '../utils/helpers';
import { Config } from '../utils/config';
import { PlatformApi } from '../platform/platform-api';
import { ComponentController, ComponentMeta, PropOptions, ProxyElement, Renderer } from '../utils/interfaces';
import { update } from './update';


export function initState(plt: PlatformApi, config: Config, renderer: Renderer, elm: ProxyElement, ctrl: ComponentController, cmpMeta: ComponentMeta) {
  const instance = ctrl.instance;
  const state = ctrl.state = {};
  const props = cmpMeta.props || {};

  // all components have mode and color props
  props.mode = true;
  props.color = true;


  Object.keys(props).forEach(propName => {
    propName = toCamelCase(propName);

    if (isUndef(instance[propName])) {
      // no instance value, so get it from the element
      state[propName] = elm[propName];

    } else if (isUndef(elm[propName])) {
      // no element value, so get it from from instance
      // but also be sure to set the element to have the same value
      // before we assign the getters/setters
      state[propName] = elm[propName] = instance[propName];
    }

    function getState() {
      return state[propName];
    }

    function setState(value: any) {
      value = getValue(props[propName], value);

      if (state[propName] !== value) {
        state[propName] = value;

        update(plt, config, renderer, elm, ctrl, cmpMeta);
      }
    }

    Object.defineProperty(elm, propName, {
      get: getState,
      set: setState
    });

    Object.defineProperty(instance, propName, {
      get: getState,
      set: setState
    });

  });
}


function getValue(propOpts: PropOptions, value: any): any {
  if (propOpts.type === 'boolean') {
    if (isString(value)) {
      return (value !== 'false')
    }
    return !!value;
  }

  if (propOpts.type === 'number') {
    if (isNumber(value)) {
      return value;
    }
    return parseFloat(value);
  }

  return value;
}
