import * as d from '../declarations';
import { queueUpdate } from './update';

let tmpMeta: d.InternalMeta;

export function createInstance(plt: d.PlatformApi, meta: d.InternalMeta, cmpConstructor: d.ComponentConstructor) {
  tmpMeta = meta;
  const instance = new cmpConstructor();
  meta.instance = instance;
  plt.metaInstanceMap.set(instance, meta);
  tmpMeta = undefined;
  return instance;
}

export function initInstanceProto(plt: d.PlatformApi, cmpConstructor: d.ComponentConstructor) {
  if (__BUILD_CONDITIONALS__.event) {
    // add each of the event emitters which wire up instance methods
    // to fire off dom events from the host element
    initEventEmitters(plt, cmpConstructor);
  }
  initProperties(plt, cmpConstructor);
}

function initProperties(plt: d.PlatformApi, cmpConstructor: d.ComponentConstructor) {

  const properties: any = {};
  const props: [string, d.ComponentConstructorProperty][] = Object.entries({
    color: { type: String },
    ...cmpConstructor.properties,
    mode: { type: String },
  });
  props.forEach(([memberName, property]) => {

    function getElement() {
      // component instance prop/state getter
      // get the property value directly from our internal values
      const meta = plt.metaInstanceMap.get(this) || tmpMeta;
      return meta.element;
    }

    function getComponentProp() {
      // component instance prop/state getter
      // get the property value directly from our internal values
      const meta = plt.metaInstanceMap.get(this) || tmpMeta;
      return meta.values.get(memberName);
    }

    function setComponentProp(newValue: any) {
      const meta = plt.metaInstanceMap.get(this) || tmpMeta;
      setValue(plt, meta, meta.element, memberName, newValue);
    }

    if (property.type || property.state === true) {

      // add getter/setter to the component instance
      // these will be pointed to the internal data set from the above checks
      properties[memberName] = definePropertyGetterSetter(
        getComponentProp,
        setComponentProp
      );

    } else if (__BUILD_CONDITIONALS__.element && property.elementRef) {
      // @Element()
      // add a getter to the element reference using
      // the member name the component meta provided
      properties[memberName] = definePropertyGetter(getElement);

    } else if (__BUILD_CONDITIONALS__.propContext && property.context) {
      // @Prop({ context: 'config' })
      // const contextObj = plt.getContextItem(property.context);
      // if (contextObj !== undefined) {
      //   properties[memberName] = definePropertyGetter(getElement)

      //   definePropertyValue(instance, memberName, (contextObj.getContext && contextObj.getContext(element)) || contextObj);
      // }

    } else if (__BUILD_CONDITIONALS__.propConnect && property.connect) {
      // @Prop({ connect: 'ion-loading-ctrl' })
      properties[memberName] = definePropertyValue(plt.propConnect(property.connect));
    }
  });
  Object.defineProperties(cmpConstructor.prototype, properties);
}

export function initEventEmitters(plt: d.PlatformApi, cmpConstructor: d.ComponentConstructor) {
  const cmpEvents = cmpConstructor.events;
  if (cmpEvents) {
    const properties: any = {};
    cmpEvents.forEach(eventMeta => {
      function getEventEmitter() {
        const elm = plt.metaInstanceMap.get(this).element;
        return {
          emit: (data: any) => {
            plt.emitEvent(elm, eventMeta.name, {
              bubbles: eventMeta.bubbles,
              composed: eventMeta.composed,
              cancelable: eventMeta.cancelable,
              detail: data
            });
          }
        };
      }
      properties[eventMeta.method] = definePropertyGetter(getEventEmitter);
    });
    Object.defineProperties(cmpConstructor.prototype, properties);
  }
}

export function setValue(plt: d.PlatformApi, meta: d.InternalMeta, elm: d.HostElement, memberName: string, newVal: any) {
  // get the internal values object, which should always come from the host element instance
  // create the _values object if it doesn't already exist
  const values = meta.values;
  const oldVal = values.get(memberName);

  // check our new property value against our internal value
  if (newVal !== oldVal) {
    // gadzooks! the property's value has changed!!

    // set our new value!
    // https://youtu.be/dFtLONl4cNc?t=22
    values.set(memberName, newVal);

    const instance = meta.instance;

    if (instance) {
      // get an array of method names of watch functions to call
      if (__BUILD_CONDITIONALS__.watchCallback) {
        const watchMethods = values.get(WATCH_CB_PREFIX + memberName);
        if (watchMethods) {
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
      }

      if (!plt.activeRender && elm['s-rn']) {
        // looks like this value actually changed, so we've got work to do!
        // but only if we've already rendered, otherwise just chill out
        // queue that we need to do an update, but don't worry about queuing
        // up millions cuz this function ensures it only runs once
        queueUpdate(plt, meta);
      }
    }
  }
}


export function definePropertyGetter(get: any) {
  // minification shortcut
  return {
    'configurable': true,
    'get': get
  };
}

export function definePropertyValue(value: any) {
  // minification shortcut
  return {
    'configurable': true,
    'value': value
  };
}

export function definePropertyGetterSetter(get: any, set: any) {
  // minification shortcut
  return {
    'configurable': true,
    'get': get,
    'set': set
  };
}

const WATCH_CB_PREFIX = `wc-`;
