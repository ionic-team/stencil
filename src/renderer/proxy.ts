import { TYPE_BOOLEAN, TYPE_NUMBER } from '../util/constants';
import { Component, PropMeta, ConfigApi, MethodMeta, PlatformApi, ProxyElement, RendererApi, StateMeta, WatchMeta } from '../util/interfaces';
import { queueUpdate } from './update';


export function initProxy(plt: PlatformApi, config: ConfigApi, renderer: RendererApi, elm: ProxyElement, instance: Component, props: PropMeta[], states: StateMeta[], methods: MethodMeta[], watchers: WatchMeta[]) {
  let i = 0;

  if (methods) {
    // instances will already have the methods on them
    // but you can also expose methods to the proxy element
    // using @Method(). Think of like .focus() for an element.
    for (i = 0; i < methods.length; i++) {
      initMethod(methods[i], elm, instance);
    }
  }

  // used to store instance data internally so that we can add
  // getters/setters with the same name, and then do change detection
  instance.$values = {};

  if (states) {
    // add getters/setters to instance properties that are not already set as @Prop()
    // these are instance properties that should trigger a render update when
    // they change. Like @Prop(), except data isn't passed in and is only state data.
    // Unlike @Prop, state properties do not add getters/setters to the proxy element
    // and initial values are not checked against the proxy element or config
    for (i = 0; i < states.length; i++) {
      initProp(states[i], null, instance, plt, config, renderer, elm, watchers, false);
    }
  }

  for (i = 0; i < props.length; i++) {
    // add getters/setters for @Prop()s
    initProp(props[i].propName, props[i].propType, instance, plt, config, renderer, elm, watchers, false);
  }
}


function initMethod(methodName: string, elm: ProxyElement, instance: Component) {
  // add a getter on the dom's element instance
  // pointed at the instance's method
  Object.defineProperty(elm, methodName, {
    configurable: true,
    value: instance[methodName].bind(instance)
  });
}


function initProp(propName: string, propType: any, instance: Component, plt: PlatformApi, config: ConfigApi, renderer: RendererApi, elm: ProxyElement, watchers: WatchMeta[], isState: boolean) {
  if (isState) {
    // @State() property, so copy the value directly from the instance
    // before we create getters/setters on this same property name
    instance.$values[propName] = instance[propName];

  } else {
    // @Prop() property, so check initial value from the proxy element, instance
    // and config, before we create getters/setters on this same property name
    instance.$values[propName] = getInitialValue(config, elm, instance, propType, propName);
  }

  if (watchers) {
    // there are watchers for this property so any time this property
    // changes, we should also fire off this @Watch() method
    for (var i = 0; i < watchers.length; i++) {
      if (watchers[i].propName === propName) {
        (instance.$watchers = instance.$watchers || []).push(instance[watchers[i].fn].bind(instance));
      }
    }
  }

  function getPropValue() {
    // get the property value directly from our internal values
    return instance.$values[propName];
  }

  function setPropValue(value: any) {
    // TODO: account for Arrays/Objects

    // check our new property value against our internal value
    if (instance.$values[propName] !== value) {

      // looks like this value actually changed, we've got work to do!
      instance.$values[propName] = value;

      if (instance.$watchers) {
        // this instance has @Watch() methods
        for (var i = 0; i < instance.$watchers.length; i++) {
          // fire off all of the watch methods for this property
          instance.$watchers[i] && instance.$watchers[i](value);
        }
      }

      // queue that we need to do an update, don't worry
      // about queuing up millions cuz this function
      // ensures it only runs once
      queueUpdate(plt, config, renderer, elm);
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


function getInitialValue(config: ConfigApi, elm: any, instance: Component, propTypeCode: number, propName: string): any {
  if (elm[propName] !== undefined) {
    // looks like we've got an initial value on the proxy element
    return elm[propName];
  }

  if (instance[propName] !== undefined) {
    // looks like we've got an initial value on the instance already
    return instance[propName];
  }

  if (propTypeCode === TYPE_BOOLEAN) {
    // this is a boolean property, so let's see if we can get a
    // boolean value from the config using this property name
    return config.getBoolean(propName);
  }

  if (propTypeCode === TYPE_NUMBER) {
    // this is a number property, so let's see if we can get a
    // number value from the config using this property name
    return config.getNumber(propName);
  }

  // let's see if we can get a default config value for this property name
  return config.get(propName);
}
