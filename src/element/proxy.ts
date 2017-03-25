import { Config } from '../utils/config';
import { ComponentController, ComponentInstance, ComponentMeta, ProxyElement, Renderer } from '../utils/interfaces';
import { isDef, isNumber, isString, toCamelCase, toDashCase } from '../utils/helpers';
import { PlatformApi } from '../platform/platform-api';
import { queueUpdate } from './update';


export function initState(plt: PlatformApi, config: Config, renderer: Renderer, elm: ProxyElement, ctrl: ComponentController, cmpMeta: ComponentMeta) {
  const instance = ctrl.instance;
  const state = ctrl.state = {};
  const props = cmpMeta.props;


  Object.keys(props).forEach(propName => {
    const propType = props[propName].type;

    state[propName] = getInitialValue(plt, config, elm, instance, propName);

    function getState() {
      return state[propName];
    }

    function setState(value: any) {
      value = getPropValue(propType, value);

      if (state[propName] !== value) {
        state[propName] = value;

        queueUpdate(plt, config, renderer, elm, ctrl, cmpMeta);
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


function getPropValue(propType: string, value: any): any {
  if (propType === 'boolean') {
    if (isString(value)) {
      return (value !== 'false')
    }
    return !!value;
  }

  if (propType === 'number') {
    if (isNumber(value)) {
      return value;
    }
    try {
      return parseFloat(value);
    } catch (e) {}
    return NaN;
  }

  return value;
}


function getInitialValue(plt: PlatformApi, config: Config, elm: HTMLElement, instance: ComponentInstance, propName: string) {
  let value = plt.getProperty(elm, propName);
  if (isDef(value)) {
    return value;
  }

  value = plt.getAttribute(elm, toCamelCase(propName));
  if (isDef(value)) {
    return value;
  }

  if (isDef(instance[propName])) {
    plt.setProperty(elm, propName, instance[propName]);
    return instance[propName];
  }

  value = config.get(propName);
  if (isDef(value)) {
    return value;
  }
}


export function initComponentMeta(tag: string, data: any[]) {
  const modeIds = data[0];
  const props = data[1] || {};

  const cmpMeta: ComponentMeta = {
    tag: tag,
    modes: {},
    props: props
  };

  let keys = Object.keys(modeIds);
  for (var i = 0; i < keys.length; i++) {
    cmpMeta.modes[keys[i]] = {
      id: modeIds[keys[i]]
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
