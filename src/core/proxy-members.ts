import * as d from '../declarations';
import { isDef } from '../util/helpers';
import { parsePropertyValue } from '../util/data-parse';
import { queueUpdate } from './update';


export function defineMember(
  plt: d.PlatformApi,
  property: d.ComponentConstructorProperty,
  elm: d.HostElement,
  instance: d.ComponentInstance,
  memberName: string,
  hostSnapshot: d.HostSnapshot,
  hostAttributes?: d.HostSnapshotAttributes,
  hostAttrValue?: string
) {

  function getComponentProp(this: d.ComponentInstance, values?: any) {
    // component instance prop/state getter
    // get the property value directly from our internal values
    values = plt.valuesMap.get(plt.hostElementMap.get(this));
    return values && values[memberName];
  }

  function setComponentProp(this: d.ComponentInstance, newValue: any, elm?: d.HostElement) {
    // component instance prop/state setter (cannot be arrow fn)
    elm = plt.hostElementMap.get(this);

    if (elm) {
      if (property.state || property.mutable) {
        setValue(plt, elm, memberName, newValue);

      } else if (__BUILD_CONDITIONALS__.verboseError) {
        console.warn(`@Prop() "${memberName}" on "${elm.tagName}" cannot be modified.`);
      }
    }
  }

  if (property.type || property.state) {
    const values = plt.valuesMap.get(elm);

    if (!property.state) {
      if (property.attr && (values[memberName] === undefined || values[memberName] === '')) {
        // check the prop value from the host element attribute
        if ((hostAttributes = hostSnapshot && hostSnapshot.$attributes) && isDef(hostAttrValue = hostAttributes[property.attr])) {
          // looks like we've got an attribute value
          // let's set it to our internal values
          values[memberName] = parsePropertyValue(property.type, hostAttrValue);
        }
      }

      if (__BUILD_CONDITIONALS__.clientSide) {
        // client-side
        // within the browser, the element's prototype
        // already has its getter/setter set, but on the
        // server the prototype is shared causing issues
        // so instead the server's elm has the getter/setter
        // directly on the actual element instance, not its prototype
        // so on the browser we can use "hasOwnProperty"
        if (elm.hasOwnProperty(memberName)) {
          // @Prop or @Prop({mutable:true})
          // property values on the host element should override
          // any default values on the component instance
          if (values[memberName] === undefined) {
            values[memberName] = parsePropertyValue(property.type, (elm as any)[memberName]);
          }

          // for the client only, let's delete its "own" property
          // this way our already assigned getter/setter on the prototype kicks in
          // the very special case is to NOT do this for "mode"
          if (memberName !== 'mode') {
            delete (elm as any)[memberName];
          }
        }

      } else {
        // server-side
        // server-side elm has the getter/setter
        // on the actual element instance, not its prototype
        // on the server we cannot accurately use "hasOwnProperty"
        // instead we'll do a direct lookup to see if the
        // constructor has this property
        if (elementHasProperty(plt, elm, memberName)) {
          // @Prop or @Prop({mutable:true})
          // property values on the host element should override
          // any default values on the component instance
          if (values[memberName] === undefined) {
            values[memberName] = (elm as any)[memberName];
          }
        }
      }
    }

    if (instance.hasOwnProperty(memberName) && values[memberName] === undefined) {
      // @Prop() or @Prop({mutable:true}) or @State()
      // we haven't yet got a value from the above checks so let's
      // read any "own" property instance values already set
      // to our internal value as the source of getter data
      // we're about to define a property and it'll overwrite this "own" property
      values[memberName] = (instance as any)[memberName];
    }

    if (property.watchCallbacks) {
      values[WATCH_CB_PREFIX + memberName] = property.watchCallbacks.slice();
    }

    // add getter/setter to the component instance
    // these will be pointed to the internal data set from the above checks
    definePropertyGetterSetter(
      instance,
      memberName,
      getComponentProp,
      setComponentProp
    );

  } else if (__BUILD_CONDITIONALS__.element && property.elementRef) {
    // @Element()
    // add a getter to the element reference using
    // the member name the component meta provided
    definePropertyValue(instance, memberName, elm);

  } else if (__BUILD_CONDITIONALS__.method && property.method) {
    // @Method()
    // add a property "value" on the host element
    // which we'll bind to the instance's method
    definePropertyValue(elm, memberName, function() {
      return Promise.resolve(instance[memberName](...arguments));
    });

  } else if (__BUILD_CONDITIONALS__.propContext && property.context) {
    // @Prop({ context: 'config' })
    const contextObj = plt.getContextItem(property.context);
    if (contextObj !== undefined) {
      definePropertyValue(instance, memberName, (contextObj.getContext && contextObj.getContext(elm)) || contextObj);
    }

  } else if (__BUILD_CONDITIONALS__.propConnect && property.connect) {
    // @Prop({ connect: 'ion-loading-ctrl' })
    definePropertyValue(instance, memberName, plt.propConnect(property.connect));
  }
}


export function setValue(plt: d.PlatformApi, elm: d.HostElement, memberName: string, newVal: any, values?: any, instance?: d.ComponentInstance, watchMethods?: string[]) {
  // get the internal values object, which should always come from the host element instance
  // create the _values object if it doesn't already exist
  values = plt.valuesMap.get(elm);
  if (!values) {
    plt.valuesMap.set(elm, values = {});
  }

  const oldVal = values[memberName];

  // check our new property value against our internal value
  if (newVal !== oldVal) {
    // gadzooks! the property's value has changed!!

    // set our new value!
    // https://youtu.be/dFtLONl4cNc?t=22
    values[memberName] = newVal;

    instance = plt.instanceMap.get(elm);

    if (instance) {
      // get an array of method names of watch functions to call
      watchMethods = values[WATCH_CB_PREFIX + memberName];

      if (__BUILD_CONDITIONALS__.watchCallback && watchMethods) {
        // this instance is watching for when this property changed
        for (let i = 0; i < watchMethods.length; i++) {
          try {
            // fire off each of the watch methods that are watching this property
            instance[watchMethods[i]].call(instance, newVal, oldVal, memberName);
          } catch (e) {
            console.error(e);
          }
        }
      }

      if (!plt.activeRender && elm['s-rn']) {
        // looks like this value actually changed, so we've got work to do!
        // but only if we've already rendered, otherwise just chill out
        // queue that we need to do an update, but don't worry about queuing
        // up millions cuz this function ensures it only runs once
        queueUpdate(plt, elm);
      }
    }
  }
}


export function definePropertyValue(obj: any, propertyKey: string, value: any) {
  // minification shortcut
  Object.defineProperty(obj, propertyKey, {
    'configurable': true,
    'value': value
  });
}


export function definePropertyGetterSetter(obj: any, propertyKey: string, get: any, set: any) {
  // minification shortcut
  Object.defineProperty(obj, propertyKey, {
    'configurable': true,
    'get': get,
    'set': set
  });
}


const WATCH_CB_PREFIX = `wc-`;


export function elementHasProperty(plt: d.PlatformApi, elm: d.HostElement, memberName: string) {
  // within the browser, the element's prototype
  // already has its getter/setter set, but on the
  // server the prototype is shared causing issues
  // so instead the server's elm has the getter/setter
  // directly on the actual element instance, not its prototype
  // so at the time of this function being called, the server
  // side element is unaware if the element has this property
  // name. So for server-side only, do this trick below
  // don't worry, this runtime code doesn't show on the client
  let hasOwnProperty = elm.hasOwnProperty(memberName);
  if (!hasOwnProperty) {
    // element doesn't
    const cmpMeta = plt.getComponentMeta(elm);
    if (cmpMeta) {
      if (cmpMeta.componentConstructor && cmpMeta.componentConstructor.properties) {
        // if we have the constructor property data, let's check that
        const member = cmpMeta.componentConstructor.properties[memberName];
        hasOwnProperty = !!(member && member.type);
      }
      if (!hasOwnProperty && cmpMeta.membersMeta) {
        // if we have the component's metadata, let's check that
        const member = cmpMeta.membersMeta[memberName];
        hasOwnProperty = !!(member && member.propType);
      }
    }
  }
  return hasOwnProperty;
}
