import { Component, ComponentActiveValues, ComponentActiveWatchers, HostElement, PropMeta,
  MethodMeta, PlatformApi, StateMeta, WatchMeta } from '../../util/interfaces';
import { queueUpdate } from './update';


export function initProxy(plt: PlatformApi, elm: HostElement, instance: Component, props: PropMeta[], states: StateMeta[], methods: MethodMeta[], watchers: WatchMeta[]) {
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
  instance.__values = {};

  if (watchers) {
    // this component has watchers, so init the object to store them
    elm._watchers = {};
  }

  if (states) {
    // add getters/setters to instance properties that are not already set as @Prop()
    // these are instance properties that should trigger a render update when
    // they change. Like @Prop(), except data isn't passed in and is only state data.
    // Unlike @Prop, state properties do not add getters/setters to the proxy element
    // and initial values are not checked against the proxy element or config
    for (i = 0; i < states.length; i++) {
      initProperty(false, states[i], instance, instance.__values, elm._watchers, plt, elm, watchers);
    }
  }

  for (i = 0; i < props.length; i++) {
    // add getters/setters for @Prop()s
    initProperty(true, props[i].propName, instance, instance.__values, elm._watchers, plt, elm, watchers);
  }
}


function initMethod(methodName: string, elm: HostElement, instance: Component) {
  // add a getter on the dom's element instance
  // pointed at the instance's method
  Object.defineProperty(elm, methodName, {
    configurable: true,
    value: (<any>instance)[methodName].bind(instance)
  });
}


function initProperty(isProp: boolean, propName: string, instance: Component, internalValues: ComponentActiveValues, internalWatchers: ComponentActiveWatchers, plt: PlatformApi, elm: HostElement, watchersMeta: WatchMeta[]) {
  if (isProp) {
    // @Prop() property, so check initial value from the proxy element, instance
    // and config, before we create getters/setters on this same property name
    if ((<any>elm)[propName] !== undefined) {
      // looks like we've got an initial value on the proxy element
      internalValues[propName] = (<any>elm)[propName];

    } else if ((<any>instance)[propName] !== undefined) {
      // looks like we've got an initial value on the instance already
      internalValues[propName] = (<any>instance)[propName];

    } else if (propName === 'mode') {
      // special case for just "mode" property
      // which all component automatically get
      internalValues[propName] = plt.config.get(propName);
    }

  } else {
    // @State() property, so copy the value directly from the instance
    // before we create getters/setters on this same property name
    internalValues[propName] = (<any>instance)[propName];
  }

  if (watchersMeta) {
    // there are watchers for this component
    for (var i = 0; i < watchersMeta.length; i++) {
      if (watchersMeta[i].propName === propName) {
        // cool, we should watch for changes to this property
        // let's bind their watcher function and add it to our list
        // of watchers, so any time this property changes we should
        // also fire off their @Watch() method
        internalWatchers[propName] = (<any>instance)[watchersMeta[i].fn].bind(instance);
      }
    }
  }

  function getValue() {
    // get the property value directly from our internal values
    return internalValues[propName];
  }

  function setValue(newVal: any) {
    // TODO: account for Arrays/Objects

    // check our new property value against our internal value
    const oldVal = internalValues[propName];
    if (newVal === oldVal || (newVal !== newVal && oldVal !== oldVal)) {
      return;
    }

    // looks like this value actually changed, we've got work to do!
    internalValues[propName] = newVal;

    if (internalWatchers && internalWatchers[propName]) {
      // this instance has @Watch() methods and a
      // watch method for this property
      internalWatchers[propName](newVal);
    }

    // queue that we need to do an update, don't worry
    // about queuing up millions cuz this function
    // ensures it only runs once
    queueUpdate(plt, elm);
  }

  function setInstanceValue(newVal: any) {
    if (isProp) {
      console.warn(`@Prop() "${propName}" on "${elm.tagName.toLowerCase()}" cannot be modified.`);
    } else {
      setValue(newVal);
    }
  }

  // dom's element instance
  Object.defineProperty(elm, propName, {
    configurable: true,
    get: getValue,
    set: setValue
  });

  // user's component class instance
  Object.defineProperty(instance, propName, {
    configurable: true,
    get: getValue,
    set: setInstanceValue
  });
}
