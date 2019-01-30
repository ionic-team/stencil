import * as d from '@declarations';
import { BUILD } from '@build-conditionals';
import { getHostRef } from '@platform';
import { MEMBER_FLAGS, MEMBER_TYPE } from '../utils/constants';
import { setValue } from './set-value';


export const proxyComponent = (Cstr: d.ComponentConstructor, cmpMeta: d.ComponentRuntimeMeta, isElementConstructor: 0 | 1, proxyState: 0 | 1) => {

  if (BUILD.member && cmpMeta.cmpMembers) {

    if (!BUILD.lazyLoad) {
      Cstr.cmpMeta = cmpMeta;
    }

    if (BUILD.observeAttribute && isElementConstructor) {
      cmpMeta.attrNameToPropName = new Map();

      if (BUILD.reflect) {
        cmpMeta.propNameToAttrName = new Map();
      }

      // create an array of attributes to observe
      // and also create a map of html attribute name to js property name
      Cstr.observedAttributes = Object.entries(cmpMeta.cmpMembers)
        .filter(([_, m]) => m[0] & MEMBER_FLAGS.HasAttribute) // filter to only keep props that should match attributes
        .map(([propName, m]) => {
          const attribute = m[1] || propName;
          cmpMeta.attrNameToPropName.set(attribute, propName);

          if (BUILD.reflect) {
            cmpMeta.propNameToAttrName.set(propName, attribute);
          }

          return attribute;
        });

      (Cstr as any).prototype.attributeChangedCallback = function(attrName: string, _oldValue: string, newValue: string) {
        if (!cmpMeta.isReflectingAttribute) {
          this[cmpMeta.attrNameToPropName.get(attrName)] = newValue;
        }
      };
    }
    Object.entries(cmpMeta.cmpMembers).forEach(([memberName, [memberFlags]]) => {

      if ((BUILD.prop && (memberFlags & MEMBER_FLAGS.Prop)) || (BUILD.state && proxyState && (memberFlags & MEMBER_FLAGS.State))) {
        // proxyComponent - prop
        Object.defineProperty((Cstr as any).prototype, memberName,
          {
            get(this: d.RuntimeRef) {
              // proxyComponent, get value
              return getHostRef(this).instanceValues.get(memberName);
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
          value() {
            if (BUILD.lazyLoad) {
              const instance = getHostRef(this).lazyInstance;
              if (instance) {
                // lazy host method proxy
                return instance[memberName].apply(instance, arguments);
              }

            } else {
              return this[memberName].apply(this, arguments);
            }
          }
        });

      } else if (BUILD.event && (memberFlags & MEMBER_TYPE.Event)) {
        // proxyComponent - event
        const eventMeta = {
          bubbles: !!(memberFlags & MEMBER_FLAGS.EventBubbles),
          composed: !!(memberFlags & MEMBER_FLAGS.EventComposed),
          cancelable: !!(memberFlags & MEMBER_FLAGS.EventCancellable)
        };
        Object.defineProperty((Cstr as any).prototype, memberName, {
          get(this: d.RuntimeRef) {
            const el = (BUILD.lazyLoad
              ? (isElementConstructor ? this : getHostRef(this).hostElement)
              : this) as d.HostElement;

            return {
              emit: (detail: any) => el.dispatchEvent(
                new CustomEvent(memberName, { ...eventMeta, detail}
              ))
            };
          }
        });
      }
    });
  }

  return Cstr;
};
