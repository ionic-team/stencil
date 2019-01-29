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

    Object.entries(cmpMeta.cmpMembers).forEach(([memberName, memberData]) => {

      if ((BUILD.prop || BUILD.state) && ((memberData[0] & MEMBER_FLAGS.PropLike) || proxyState)) {
        // proxyComponent - prop
        Object.defineProperty((Cstr as any).prototype, memberName,
          {
            get(this: d.HostElement) {
              // proxyComponent, get value
              return getHostRef(this).instanceValues.get(memberName);
            },
            set(this: d.HostElement, newValue) {
              // proxyComponent, set value
              setValue(this, memberName, newValue, cmpMeta);
            },
            configurable: true,
            enumerable: true
          }
        );

      } else if (BUILD.lazyLoad && BUILD.method && isElementConstructor && (memberData[0] & MEMBER_TYPE.Method)) {
        // proxyComponent - method
        Object.defineProperty((Cstr as any).prototype, memberName, {
          value(instance?: any) {
            if (BUILD.lazyLoad) {
              if ((instance = getHostRef(this).lazyInstance)) {
                // lazy host method proxy
                return instance[memberName].apply(instance, arguments);
              }

            } else {
              return this[memberName].apply(this, arguments);
            }
          }
        });

      } else if (BUILD.event && (memberData[0] & MEMBER_TYPE.Event)) {
        // proxyComponent - event
        Object.defineProperty((Cstr as any).prototype, memberName, {
          get(this: d.HostElement) {
            const elm = this;
            return {
              emit: (data: any) => elm.dispatchEvent(new CustomEvent(
                memberName,
                {
                  detail: data,
                  // bubbles
                }
              ))
            };
          }
        });
      }
    });
  }

  return Cstr;
};
