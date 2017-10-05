import { ComponentInstance, ComponentMeta, ComponentInternalValues,
  DomApi, HostElement, PlatformApi, PropChangeMeta } from '../../util/interfaces';
import { isDef } from '../../util/helpers';
import { MEMBER_TYPE, PROP_CHANGE } from '../../util/constants';
import { parsePropertyValue } from '../../util/data-parse';
import { queueUpdate } from './update';


export function initProxy(plt: PlatformApi, elm: HostElement, instance: ComponentInstance, cmpMeta: ComponentMeta) {
  // used to store instance data internally so that we can add
  // getters/setters with the same name, and then do change detection
  const values: ComponentInternalValues = instance.__values = {};

  if (cmpMeta.propsWillChangeMeta) {
    // this component has prop WILL change methods, so init the object to store them
    values.__propWillChange = {};
  }

  if (cmpMeta.propsDidChangeMeta) {
    // this component has prop DID change methods, so init the object to store them
    values.__propDidChange = {};
  }

  if (cmpMeta.membersMeta) {
    for (var memberName in cmpMeta.membersMeta) {
      // add getters/setters for @Prop()s
      var memberMeta = cmpMeta.membersMeta[memberName];
      var memberType = memberMeta.memberType;

      if (memberType === MEMBER_TYPE.PropContext) {
        // @Prop({ context: 'config' })
        var contextObj = plt.getContextItem(memberMeta.ctrlId);
        if (isDef(contextObj)) {
          defineProperty(instance, memberName, (contextObj.getContext && contextObj.getContext(elm)) || contextObj);
        }

      } else if (memberType === MEMBER_TYPE.PropConnect) {
        // @Prop({ connect: 'ion-loading-ctrl' })
        defineProperty(instance, memberName, plt.propConnect(memberMeta.ctrlId));

      } else if (memberType === MEMBER_TYPE.Method) {
        // add a value getter on the dom's element instance
        // pointed at the instance's method
        defineProperty(elm, memberName, instance[memberName].bind(instance));

      } else if (memberType === MEMBER_TYPE.Element) {
        // add a getter to the element reference using
        // the member name the component meta provided
        defineProperty(instance, memberName, elm);

      } else {
        // @Prop and @State
        initProp(
          memberName,
          memberType,
          memberMeta.attribName,
          memberMeta.propType,
          values,
          plt,
          elm,
          instance,
          cmpMeta.propsWillChangeMeta,
          cmpMeta.propsDidChangeMeta
        );
      }
    }
  }
}


function initProp(
  memberName: string,
  memberType: number,
  attribName: string,
  propType: number,
  internalValues: ComponentInternalValues,
  plt: PlatformApi,
  elm: HostElement,
  instance: ComponentInstance,
  propWillChangeMeta: PropChangeMeta[],
  propDidChangeMeta: PropChangeMeta[]
) {

  if (memberType === MEMBER_TYPE.State) {
    // @State() property, so copy the value directly from the instance
    // before we create getters/setters on this same property name
    internalValues[memberName] = (<any>instance)[memberName];

  } else {
    // @Prop() property, so check initial value from the proxy element and instance
    // before we create getters/setters on this same property name
    // we do this for @Prop({ mutable: true }) also
    const hostAttrValue = elm.getAttribute(attribName);
    if (hostAttrValue !== null) {
      // looks like we've got an initial value from the attribute
      internalValues[memberName] = parsePropertyValue(propType, hostAttrValue);

    } else if ((<any>elm)[memberName] !== undefined) {
      // looks like we've got an initial value on the proxy element
      internalValues[memberName] = parsePropertyValue(propType, (<any>elm)[memberName]);

    } else if ((<any>instance)[memberName] !== undefined) {
      // looks like we've got an initial value on the instance already
      internalValues[memberName] = (<any>instance)[memberName];
    }
  }

  let i = 0;
  if (propWillChangeMeta) {
    // there are prop WILL change methods for this component
    for (; i < propWillChangeMeta.length; i++) {
      if (propWillChangeMeta[i][PROP_CHANGE.PropName] === memberName) {
        // cool, we should watch for changes to this property
        // let's bind their watcher function and add it to our list
        // of watchers, so any time this property changes we should
        // also fire off their @PropWillChange() method
        internalValues.__propWillChange[memberName] = (<any>instance)[propWillChangeMeta[i][PROP_CHANGE.MethodName]].bind(instance);
      }
    }
  }

  if (propDidChangeMeta) {
    // there are prop DID change methods for this component
    for (i = 0; i < propDidChangeMeta.length; i++) {
      if (propDidChangeMeta[i][PROP_CHANGE.PropName] === memberName) {
        // cool, we should watch for changes to this property
        // let's bind their watcher function and add it to our list
        // of watchers, so any time this property changes we should
        // also fire off their @PropDidChange() method
        internalValues.__propDidChange[memberName] = (<any>instance)[propDidChangeMeta[i][PROP_CHANGE.MethodName]].bind(instance);
      }
    }
  }

  function getValue() {
    // get the property value directly from our internal values
    return internalValues[memberName];
  }

  function setValue(newVal: any) {
    // check our new property value against our internal value
    const oldVal = internalValues[memberName];

    // TODO: account for Arrays/Objects
    if (newVal !== oldVal) {
      // gadzooks! the property's value has changed!!

      if (internalValues.__propWillChange && internalValues.__propWillChange[memberName]) {
        // this instance is watching for when this property WILL change
        internalValues.__propWillChange[memberName](newVal, oldVal);
      }

      // set our new value!
      internalValues[memberName] = newVal;

      if (internalValues.__propDidChange && internalValues.__propDidChange[memberName]) {
        // this instance is watching for when this property DID change
        internalValues.__propDidChange[memberName](newVal, oldVal);
      }

      // looks like this value actually changed, we've got work to do!
      // queue that we need to do an update, don't worry
      // about queuing up millions cuz this function
      // ensures it only runs once
      queueUpdate(plt, elm);
    }
  }

  if (memberType === MEMBER_TYPE.Prop || memberType === MEMBER_TYPE.PropMutable) {
    // @Prop() or @Prop({ mutable: true })
    // have both getters and setters on the DOM element
    // @State() getters and setters should not be assigned to the element
    defineProperty(elm, memberName, undefined, getValue, setValue);
  }

  if (memberType === MEMBER_TYPE.PropMutable || memberType === MEMBER_TYPE.State) {
    // @Prop({ mutable: true }) or @State()
    // have both getters and setters on the instance
    defineProperty(instance, memberName, undefined, getValue, setValue);

  } else if (memberType === MEMBER_TYPE.Prop) {
    // @Prop() only has getters, but not setters on the instance
    defineProperty(instance, memberName, undefined, getValue, function invalidSetValue() {
      // this is not a stateful @Prop()
      // so do not update the instance or host element
      // TODO: remove this warning in prod mode
      console.warn(`@Prop() "${memberName}" on "${elm.tagName.toLowerCase()}" cannot be modified.`);
    });
  }

}


function defineProperty(obj: any, propertyKey: string, value: any, getter?: any, setter?: any) {
  // minification shortcut
  const descriptor: PropertyDescriptor = {
    configurable: true
  };
  if (value !== undefined) {
    descriptor.value = value;

  } else {
    if (getter) {
      descriptor.get = getter;
    }
    if (setter) {
      descriptor.set = setter;
    }
  }
  Object.defineProperty(obj, propertyKey, descriptor);
}

export function proxyController(domApi: DomApi, controllerComponents: { [tag: string]: HostElement }, ctrlTag: string) {
  return {
    'create': proxyProp(domApi, controllerComponents, ctrlTag, 'create'),
    'componentOnReady': proxyProp(domApi, controllerComponents, ctrlTag, 'componentOnReady')
  };
}

export function loadComponent(domApi: DomApi, controllerComponents: { [tag: string]: HostElement }, ctrlTag: string): Promise<any> {
  return new Promise(resolve => {
    let ctrlElm = controllerComponents[ctrlTag];
    if (!ctrlElm) {
      ctrlElm = domApi.$body.querySelector(ctrlTag) as HostElement;
    }
    if (!ctrlElm) {
      ctrlElm = controllerComponents[ctrlTag] = domApi.$createElement(ctrlTag) as any;
      domApi.$appendChild(domApi.$body, ctrlElm);
    }
    ctrlElm.componentOnReady(resolve);
  });
}

function proxyProp(domApi: DomApi, controllerComponents: { [tag: string]: HostElement }, ctrlTag: string, proxyMethodName: string) {
  return function () {
    const args = arguments;
    return loadComponent(domApi, controllerComponents, ctrlTag)
      .then(ctrlElm => ctrlElm[proxyMethodName].apply(ctrlElm, args));
  };
}
