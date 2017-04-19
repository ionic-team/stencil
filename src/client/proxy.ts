import { Component, ConfigApi, PlatformApi, Props, ProxyElement, RendererApi, Watches } from '../util/interfaces';
import { queueUpdate } from './update';


export function initProps(plt: PlatformApi, config: ConfigApi, renderer: RendererApi, elm: ProxyElement, tag: string, instance: Component, props: Props, watches: Watches) {
  const propValues: {[propName: string]: any} = {};


  Object.keys(props).forEach(propName => {
    const watcher: Function = (watches[propName]) ? instance[watches[propName].fn].bind(instance) : null;

    propValues[propName] = getInitialValue(config, elm, instance, props[propName].type, propName);

    function getPropValue() {
      return propValues[propName];
    }

    function setPropValue(value: any) {
      if (propValues[propName] !== value) {
        propValues[propName] = value;

        watcher && watcher(value);

        queueUpdate(plt, config, renderer, elm, tag);
      }
    }

    // dom's element instance
    Object.defineProperty(elm, propName, {
      configurable: true,
      get: getPropValue,
      set: setPropValue
    });

    // user's component class instance
    Object.defineProperty(instance, propName, {
      configurable: true,
      get: getPropValue,
      set: setPropValue
    });

  });
}


function getInitialValue(config: ConfigApi, elm: HTMLElement, instance: Component, propType: string, propName: string): any {
  if (elm[propName] !== undefined) {
    return elm[propName];
  }

  if (instance[propName] !== undefined) {
    return instance[propName];
  }

  if (propType === 'boolean') {
    return config.getBoolean(propName);
  }

  if (propType === 'number') {
    return config.getNumber(propName);
  }

  return config.get(propName);
}
