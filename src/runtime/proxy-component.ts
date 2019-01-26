import * as d from '@declarations';
import { BUILD } from '@build-conditionals';
import { getHostRef } from '@platform';
import { MEMBER_TYPE } from '../utils/constants';
import { setValue } from './set-value';


export const proxyComponent = (Cstr: d.ComponentConstructor, cmpMeta?: d.ComponentRuntimeMeta, isElementConstructor?: boolean, proxyState?: boolean) => {

  if (BUILD.member && cmpMeta.members) {

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
      Cstr.observedAttributes = Object.entries(cmpMeta.members)
        .filter(([_, m]) => m[2]) // filter to only keep props that should match attributes
        .map(([propName, m]) => {
            // if > 0, then we already know attr name the same as the prop name
            // if not > 0, then let's use the attr name given (probably has a dash in it)
            cmpMeta.attrNameToPropName.set(
              m[2] = (m[2] > 0 ? propName : m[2]
            ) as string, propName);

            if (BUILD.reflect) {
              cmpMeta.propNameToAttrName.set(propName, m[2]);
            }

            return m[2];
          }
        );

      (Cstr as any).prototype.attributeChangedCallback = function(attrName: string, _oldValue: string, newValue: string) {
        if (!cmpMeta.isReflectingAttribute) {
          this[cmpMeta.attrNameToPropName.get(attrName.toLowerCase())] = newValue;
        }
      };
    }

    Object.entries(cmpMeta.members).forEach(([memberName, memberData]) => {

      if ((BUILD.prop && ((memberData[0] === MEMBER_TYPE.Prop) || (memberData[0] === MEMBER_TYPE.PropMutable))) || (BUILD.state && (memberData[0] === MEMBER_TYPE.State) && proxyState)) {
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

      } else if (BUILD.lazyLoad && BUILD.method && isElementConstructor && (memberData[0] === MEMBER_TYPE.Method)) {
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

      } else if (BUILD.event && (memberData[0] === MEMBER_TYPE.Event)) {
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
