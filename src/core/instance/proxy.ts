import { Component, ComponentActiveValues, ComponentActivePropChanges, HostElement, PropMeta,
  MethodMeta, PlatformApi, StateMeta, PropChangeMeta } from '../../util/interfaces';
import { parsePropertyValue } from '../../util/data-parse';
import { PROP_CHANGE_METHOD_NAME, PROP_CHANGE_PROP_NAME } from '../../util/constants';
import { queueUpdate } from './update';


export function initProxy(plt: PlatformApi, elm: HostElement, instance: Component, props: PropMeta[], states: StateMeta[], methods: MethodMeta[], propWillChangeMeta: PropChangeMeta[], propDidChangeMeta: PropChangeMeta[]) {
  let i = 0;

  if (methods) {
    // instances will already have the methods on them
    // but you can also expose methods to the proxy element
    // using @Method(). Think of like .focus() for an element.
    for (; i < methods.length; i++) {
      initMethod(methods[i], elm, instance);
    }
  }

  // used to store instance data internally so that we can add
  // getters/setters with the same name, and then do change detection
  instance.__values = {};

  if (propWillChangeMeta) {
    // this component has prop WILL change methods, so init the object to store them
    elm._propWillChange = {};
  }

  if (propDidChangeMeta) {
    // this component has prop DID change methods, so init the object to store them
    elm._propDidChange = {};
  }

  if (states) {
    // add getters/setters to instance properties that are not already set as @Prop()
    // these are instance properties that should trigger a render update when
    // they change. Like @Prop(), except data isn't passed in and is only state data.
    // Unlike @Prop, state properties do not add getters/setters to the proxy element
    // and initial values are not checked against the proxy element or config
    for (i = 0; i < states.length; i++) {
      initProperty(false, true, '', states[i], 0, instance, instance.__values, plt, elm, elm._propWillChange, propWillChangeMeta, elm._propDidChange, propDidChangeMeta);
    }
  }

  for (i = 0; i < props.length; i++) {
    // add getters/setters for @Prop()s
    initProperty(true, props[i].isStateful, props[i].attribName, props[i].propName, props[i].propType, instance, instance.__values, plt, elm, elm._propWillChange, propWillChangeMeta, elm._propDidChange, propDidChangeMeta);
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


function initProperty(
  isProp: boolean,
  isStateful: boolean,
  attrName: string,
  propName: string,
  propType: number,
  instance: Component,
  internalValues: ComponentActiveValues,
  plt: PlatformApi,
  elm: HostElement,
  internalPropWillChanges: ComponentActivePropChanges,
  propWillChangeMeta: PropChangeMeta[],
  internalPropDidChanges: ComponentActivePropChanges,
  propDidChangeMeta: PropChangeMeta[]
) {

  if (isProp) {
    // @Prop() property, so check initial value from the proxy element, instance
    // and config, before we create getters/setters on this same property name
    const hostAttrValue = elm.getAttribute(attrName);
    if (hostAttrValue !== null) {
      // looks like we've got an initial value from the attribute
      internalValues[propName] = parsePropertyValue(propType, hostAttrValue);

    } else if ((<any>elm)[propName] !== undefined) {
      // looks like we've got an initial value on the proxy element
      internalValues[propName] = parsePropertyValue(propType, (<any>elm)[propName]);

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

  let i = 0;
  if (propWillChangeMeta) {
    // there are prop WILL change methods for this component
    for (i = 0; i < propWillChangeMeta.length; i++) {
      if (propWillChangeMeta[i][PROP_CHANGE_PROP_NAME] === propName) {
        // cool, we should watch for changes to this property
        // let's bind their watcher function and add it to our list
        // of watchers, so any time this property changes we should
        // also fire off their @PropWillChange() method
        internalPropWillChanges[propName] = (<any>instance)[propWillChangeMeta[i][PROP_CHANGE_METHOD_NAME]].bind(instance);
      }
    }
  }

  if (propDidChangeMeta) {
    // there are prop DID change methods for this component
    for (i = 0; i < propDidChangeMeta.length; i++) {
      if (propDidChangeMeta[i][PROP_CHANGE_PROP_NAME] === propName) {
        // cool, we should watch for changes to this property
        // let's bind their watcher function and add it to our list
        // of watchers, so any time this property changes we should
        // also fire off their @PropDidChange() method
        internalPropDidChanges[propName] = (<any>instance)[propDidChangeMeta[i][PROP_CHANGE_METHOD_NAME]].bind(instance);
      }
    }
  }

  function getValue() {
    // get the property value directly from our internal values
    return internalValues[propName];
  }

  function setValue(newVal: any) {
    // check our new property value against our internal value
    const oldVal = internalValues[propName];

    // TODO: account for Arrays/Objects
    if (newVal !== oldVal) {
      // gadzooks! the property's value has changed!!

      if (internalPropWillChanges && internalPropWillChanges[propName]) {
        // this instance is watching for when this property WILL change
        internalPropWillChanges[propName](newVal, oldVal);
      }

      // set our new value!
      internalValues[propName] = newVal;

      if (internalPropDidChanges && internalPropDidChanges[propName]) {
        // this instance is watching for when this property DID change
        internalPropDidChanges[propName](newVal, oldVal);
      }

      // looks like this value actually changed, we've got work to do!
      // queue that we need to do an update, don't worry
      // about queuing up millions cuz this function
      // ensures it only runs once
      queueUpdate(plt, elm);
    }
  }

  function setInstanceValue(newVal: any) {
    if (isStateful) {
      // this prop can keep state, mainly used for inputs
      // so update the host element's property directly
      // which will end up updating the proxied instance
      setValue(newVal);

    } else {
      // this is not a stateful prop
      // so do not update the instance or host element
      console.warn(`@Prop() "${propName}" on "${elm.tagName.toLowerCase()}" cannot be modified.`);
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
