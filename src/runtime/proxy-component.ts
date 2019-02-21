import * as d from '@declarations';
import { BUILD } from '@build-conditionals';
import { getHostRef } from '@platform';
import { MEMBER_FLAGS, MEMBER_TYPE } from '../utils/constants';
import { getValue, setValue } from './set-value';
import { componentOnReady } from './component-on-ready';
import { connectedCallback } from './connected-callback';
import { disconnectedCallback } from './disconnected-callback';


export const proxyNative = (Cstr: any, cmpMeta: d.ComponentRuntimeMeta) => {
  Cstr.prototype.connectedCallback = function() {
    connectedCallback(this, cmpMeta);
  };
  Cstr.prototype.connectedCallback = function() {
    disconnectedCallback(this);
  };
  return proxyComponent(Cstr, cmpMeta, 1, 1);
};

export const proxyComponent = (Cstr: d.ComponentConstructor, cmpMeta: d.ComponentRuntimeMeta, isElementConstructor: 0 | 1, proxyState: 0 | 1) => {
  if (BUILD.member && cmpMeta.cmpMembers) {
    if (BUILD.watchCallback && Cstr.watchers) {
      cmpMeta.watchers = Cstr.watchers;
    }
    if (!BUILD.lazyLoad) {
      Cstr.cmpMeta = cmpMeta;
    }
    // It's better to have a const than two Object.entries()
    const members = Object.entries(cmpMeta.cmpMembers);

    members.forEach(([memberName, [memberFlags]]) => {
      if ((BUILD.prop && (memberFlags & MEMBER_FLAGS.Prop)) || (BUILD.state && proxyState && (memberFlags & MEMBER_FLAGS.State))) {
        // proxyComponent - prop
        Object.defineProperty((Cstr as any).prototype, memberName,
          {
            get(this: d.RuntimeRef) {
              // proxyComponent, get value
              return getValue(this, memberName);
            },
            set(this: d.RuntimeRef, newValue) {
              // proxyComponent, set value
              setValue(this, memberName, newValue, cmpMeta);
            },
            configurable: true,
            enumerable: true
          }
        );

      } else if (BUILD.lazyLoad && BUILD.method && isElementConstructor && (memberFlags & MEMBER_TYPE.Method)) {
        // proxyComponent - method
        Object.defineProperty((Cstr as any).prototype, memberName, {
          value(this: d.HostElement) {
            const ref = getHostRef(this);
            const args = arguments;
            return componentOnReady(ref).then(() => ref.lazyInstance[memberName].apply(ref.lazyInstance, args));
          }
        });
      }
    });
    if (BUILD.observeAttribute && (!BUILD.lazyLoad || isElementConstructor)) {
      const attrNameToPropName = new Map();

      if (BUILD.reflect) {
        cmpMeta.attrsToReflect = [];
      }

      (Cstr as any).prototype.attributeChangedCallback = function(attrName: string, _oldValue: string, newValue: string) {
        const propName = attrNameToPropName.get(attrName);
        this[propName] = newValue === null && typeof this[propName] === 'boolean'
          ? false
          : newValue;
      };

      // create an array of attributes to observe
      // and also create a map of html attribute name to js property name
      Cstr.observedAttributes = members
        .filter(([_, m]) => m[0] & MEMBER_FLAGS.HasAttribute) // filter to only keep props that should match attributes
        .map(([propName, m]) => {
          const attribute = m[1] || propName;
          attrNameToPropName.set(attribute, propName);
          if (BUILD.reflect && m[0] & MEMBER_FLAGS.ReflectAttr) {
            cmpMeta.attrsToReflect.push([propName, attribute]);
          }
          return attribute;
        });
    }
  }
  return Cstr;
};
