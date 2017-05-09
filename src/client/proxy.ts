import { Component, ConfigApi, Methods, PlatformApi, Props, ProxyElement, RendererApi, ComponentMetaWatcher } from '../util/interfaces';
import { queueUpdate } from './update';
import { BOOLEAN_TYPE_CODE, NUMBER_TYPE_CODE } from '../util/data-parse';


export function initProxy(plt: PlatformApi, config: ConfigApi, renderer: RendererApi, elm: ProxyElement, tag: string, instance: Component, props: Props, methods: Methods, watchers: ComponentMetaWatcher[]) {
  if (methods) {
    methods.forEach(methodName => {
      initMethod(methodName, elm, instance);
    });
  }

  instance.$values = {};

  Object.keys(props).forEach(propName => {
    initProp(propName, plt, config, renderer, elm, tag, instance, props, watchers);
  });
}


function initMethod(methodName: string, elm: ProxyElement, instance: Component) {
  // dom's element instance
  Object.defineProperty(elm, methodName, {
    configurable: true,
    value: instance[methodName].bind(instance)
  });
}


function initProp(propName: string, plt: PlatformApi, config: ConfigApi, renderer: RendererApi, elm: ProxyElement, tag: string, instance: Component, props: Props, watchers: ComponentMetaWatcher[]) {
  instance.$values[propName] = getInitialValue(config, elm, instance, props[propName].type, propName);

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
