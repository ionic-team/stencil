import { Component, PropMeta, ConfigApi, Methods, PlatformApi, ProxyElement, RendererApi, WatchMeta } from '../util/interfaces';
import { queueUpdate } from './update';
import { BOOLEAN_TYPE_CODE, NUMBER_TYPE_CODE } from '../util/data-parse';


export function initProxy(plt: PlatformApi, config: ConfigApi, renderer: RendererApi, elm: ProxyElement, tag: string, instance: Component, props: PropMeta[], methods: Methods, watchers: WatchMeta[]) {
  let i = 0;

  if (methods) {
    for (i = 0; i < methods.length; i++) {
      initMethod(methods[i], elm, instance);
    }
  }

  if (props) {
    instance.$values = {};

    for (i = 0; i < props.length; i++) {
      initProp(props[i].propName, props[i].propType, plt, config, renderer, elm, tag, instance, watchers);
    }
  }
}


function initMethod(methodName: string, elm: ProxyElement, instance: Component) {
  // dom's element instance
  Object.defineProperty(elm, methodName, {
    configurable: true,
    value: instance[methodName].bind(instance)
  });
}


function initProp(propName: string, propType: any, plt: PlatformApi, config: ConfigApi, renderer: RendererApi, elm: ProxyElement, tag: string, instance: Component, watchers: WatchMeta[]) {
  instance.$values[propName] = getInitialValue(config, elm, instance, propType, propName);

  if (watchers) {
    for (var i = 0; i < watchers.length; i++) {
      if (watchers[i].propName === propName) {
        (instance.$watchers = instance.$watchers || []).push(instance[watchers[i].fn].bind(instance));
      }
    }
  }

  function getPropValue() {
    return instance.$values[propName];
  }

  function setPropValue(value: any) {
    if (instance.$values[propName] !== value) {
      instance.$values[propName] = value;

      if (instance.$watchers) {
        for (var i = 0; i < instance.$watchers.length; i++) {
          instance.$watchers[i](value);
        }
      }

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
}


function getInitialValue(config: ConfigApi, elm: ProxyElement, instance: Component, propTypeCode: number, propName: string): any {
  if (elm[propName] !== undefined) {
    return elm[propName];
  }

  if (instance[propName] !== undefined) {
    return instance[propName];
  }

  if (propTypeCode === BOOLEAN_TYPE_CODE) {
    return config.getBoolean(propName);
  }

  if (propTypeCode === NUMBER_TYPE_CODE) {
    return config.getNumber(propName);
  }

  return config.get(propName);
}
