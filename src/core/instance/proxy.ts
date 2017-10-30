import { ComponentInstance, ComponentMeta, DomApi, HostElement,
  MembersMeta, PlatformApi, PropChangeMeta } from '../../util/interfaces';
import { MEMBER_TYPE, PROP_CHANGE } from '../../util/constants';
import { noop } from '../../util/helpers';
import { parsePropertyValue } from '../../util/data-parse';
import { queueUpdate } from './update';


export function proxyHostElementPrototype(plt: PlatformApi, membersMeta: MembersMeta, hostPrototype: HostElement) {
  // create getters/setters on the host element prototype to represent the public API
  // the setters allows us to know when data has changed so we can re-render

  membersMeta && Object.keys(membersMeta).forEach(memberName => {
    // add getters/setters
    const memberType = membersMeta[memberName].memberType;

    if (memberType === MEMBER_TYPE.Prop || memberType === MEMBER_TYPE.PropMutable) {
      // @Prop() or @Prop({ mutable: true })
      definePropertyGetterSetter(
        hostPrototype,
        memberName,
        function getHostElementProp() {
          // host element getter (cannot be arrow fn)
          // yup, ugly, srynotsry
          // but its creating _values if it doesn't already exist
          return ((this as HostElement)._values = (this as HostElement)._values || {})[memberName];
        },
        function setHostElementProp(newValue: any) {
          // host element setter (cannot be arrow fn)
          setValue(plt, (this as HostElement), memberName, newValue);
        }
      );

    } else if (memberType === MEMBER_TYPE.Method) {
      // @Method()
      // add a placeholder noop value on the host element's prototype
      // incase this method gets called before setup
      definePropertyValue(hostPrototype, memberName, noop);
    }
  });
}


export function proxyComponentInstance(plt: PlatformApi, cmpMeta: ComponentMeta, elm: HostElement, instance: ComponentInstance) {
  // at this point we've got a specific node of a host element, and created a component class instance
  // and we've already created getters/setters on both the host element and component class prototypes
  // let's upgrade any data that might have been set on the host element already
  // and let's have the getters/setters kick in and do their jobs

  // let's automatically add a reference to the host element on the instance
  instance.__el = elm;

  // create the _values object if it doesn't already exist
  // this will hold all of the internal getter/setter values
  elm._values = elm._values || {};

  cmpMeta.membersMeta && Object.keys(cmpMeta.membersMeta).forEach(memberName => {
    defineMember(plt, cmpMeta, elm, instance, memberName);
  });
}


export function defineMember(plt: PlatformApi, cmpMeta: ComponentMeta, elm: HostElement, instance: ComponentInstance, memberName: string) {
  const memberMeta = cmpMeta.membersMeta[memberName];
  const memberType = memberMeta.memberType;

  function getComponentProp() {
    // component instance prop/state getter
    // get the property value directly from our internal values
    const elm: HostElement = (this as ComponentInstance).__el;
    return elm._values[memberName];
  }

  function setComponentProp(newValue: any) {
    // component instance prop/state setter (cannot be arrow fn)
    const elm: HostElement = (this as ComponentInstance).__el;

    if (memberType !== MEMBER_TYPE.Prop) {
      setValue(plt, elm, memberName, newValue);

    } else {
      console.warn(`@Prop() "${memberName}" on "${elm.tagName}" cannot be modified.`);
    }
  }

  if (memberType === MEMBER_TYPE.Prop || memberType === MEMBER_TYPE.State || memberType === MEMBER_TYPE.PropMutable) {

    if (memberType !== MEMBER_TYPE.State) {
      if (memberMeta.attribName && (elm._values[memberName] === undefined || elm._values[memberName] === '')) {
        // check the prop value from the host element attribute
        const hostAttrValue = elm.getAttribute(memberMeta.attribName);
        if (hostAttrValue != null) {
          // looks like we've got an attribute value
          // let's set it to our internal values
          elm._values[memberName] = parsePropertyValue(memberMeta.propType, hostAttrValue);
        }
      }
      if (elm.hasOwnProperty(memberName)) {
        // @Prop or @Prop({mutable:true})
        // property values on the host element should override
        // any default values on the component instance
        if (elm._values[memberName] === undefined) {
          elm._values[memberName] = (elm as any)[memberName];
        }

        if (plt.isClient) {
          // within the browser, the element's prototype
          // already has its getter/setter set, but on the
          // server the prototype is shared causing issues
          // so instead the server's elm has the getter/setter
          // on the actual element instance, not its prototype
          // for the client, let's delete its "own" property
          delete (elm as any)[memberName];
        }
      }
    }

    if (instance.hasOwnProperty(memberName) && elm._values[memberName] === undefined) {
      // @Prop() or @Prop({mutable:true}) or @State()
      // we haven't yet got a value from the above checks so let's
      // read any "own" property instance values already set
      // to our internal value as the source of getter data
      // we're about to define a property and it'll overwrite this "own" property
      elm._values[memberName] = (instance as any)[memberName];
    }

    // add getter/setter to the component instance
    // these will be pointed to the internal data set from the above checks
    definePropertyGetterSetter(
      instance,
      memberName,
      getComponentProp,
      setComponentProp
    );

    // add watchers to props if they exist
    proxyPropChangeMethods(cmpMeta.propsWillChangeMeta, PROP_WILL_CHG, elm, instance, memberName);
    proxyPropChangeMethods(cmpMeta.propsDidChangeMeta, PROP_DID_CHG, elm, instance, memberName);

  } else if (memberType === MEMBER_TYPE.Element) {
    // @Element()
    // add a getter to the element reference using
    // the member name the component meta provided
    definePropertyValue(instance, memberName, elm);

  } else if (memberType === MEMBER_TYPE.Method) {
    // @Method()
    // add a property "value" on the host element
    // which we'll bind to the instance's method
    definePropertyValue(elm, memberName, instance[memberName].bind(instance));

  } else if (memberType === MEMBER_TYPE.PropContext) {
    // @Prop({ context: 'config' })
    var contextObj = plt.getContextItem(memberMeta.ctrlId);
    if (contextObj) {
      definePropertyValue(instance, memberName, (contextObj.getContext && contextObj.getContext(elm)) || contextObj);
    }

  } else if (memberType === MEMBER_TYPE.PropConnect) {
    // @Prop({ connect: 'ion-loading-ctrl' })
    definePropertyValue(instance, memberName, plt.propConnect(memberMeta.ctrlId));
  }
}


export function proxyPropChangeMethods(propChangeMeta: PropChangeMeta[], prefix: string, elm: HostElement, instance: ComponentInstance, memberName: string) {
  // there are prop WILL change methods for this component
  const propChangeMthd = propChangeMeta && propChangeMeta.find(m => m[PROP_CHANGE.PropName] === memberName);

  if (propChangeMthd) {
    // cool, we should watch for changes to this property
    // let's bind their watcher function and add it to our list
    // of watchers, so any time this property changes we should
    // also fire off their method
    elm._values[prefix + memberName] = (instance as any)[propChangeMthd[PROP_CHANGE.MethodName]].bind(instance);
  }
}


export function setValue(plt: PlatformApi, elm: HostElement, memberName: string, newVal: any) {
  // get the internal values object, which should always come from the host element instance
  // create the _values object if it doesn't already exist
  const internalValues = (elm._values = elm._values || {});

  // check our new property value against our internal value
  const oldVal = internalValues[memberName];

  if (newVal !== oldVal) {
    // gadzooks! the property's value has changed!!

    if (internalValues[PROP_WILL_CHG + memberName]) {
      // this instance is watching for when this property WILL change
      internalValues[PROP_WILL_CHG + memberName](newVal, oldVal);
    }

    // set our new value!
    // https://youtu.be/dFtLONl4cNc?t=22
    internalValues[memberName] = newVal;

    if (internalValues[PROP_DID_CHG + memberName]) {
      // this instance is watching for when this property DID change
      internalValues[PROP_DID_CHG + memberName](newVal, oldVal);
    }

    if (elm.$instance && !plt.activeRender) {
      // looks like this value actually changed, so we've got work to do!
      // but only if we've already created an instance, otherwise just chill out
      // queue that we need to do an update, but don't worry about queuing
      // up millions cuz this function ensures it only runs once
      queueUpdate(plt, elm);
    }
  }
}


function definePropertyValue(obj: any, propertyKey: string, value: any) {
  // minification shortcut
  Object.defineProperty(obj, propertyKey, {
    'configurable': true,
    'value': value
  });
}


function definePropertyGetterSetter(obj: any, propertyKey: string, get: any, set: any) {
  // minification shortcut
  Object.defineProperty(obj, propertyKey, {
    'configurable': true,
    'get': get,
    'set': set
  });
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


const PROP_WILL_CHG = '$$wc';
const PROP_DID_CHG = '$$dc';
