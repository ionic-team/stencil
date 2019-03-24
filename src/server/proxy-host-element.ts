import * as d from '../declarations';
import { consoleError, getHostRef } from '@platform';
import { getValue, parsePropertyValue, setValue } from '@runtime';
import { MEMBER_TYPE } from '@utils';


export function proxyHostElement(elm: d.HostElement, cmpMeta: d.ComponentRuntimeMeta) {

  if (typeof elm.componentOnReady !== 'function') {
    elm.componentOnReady = componentOnReady;
  }
  if (typeof elm.forceUpdate !== 'function') {
    elm.forceUpdate = forceUpdate;
  }

  if (cmpMeta.m != null) {
    const hostRef = getHostRef(elm);

    const members = Object.entries(cmpMeta.m);

    members.forEach(([memberName, m]) => {
      const memberFlags = m[0];

      if (memberFlags & MEMBER_TYPE.Prop) {
        const attributeName = (m[1] || memberName);
        const attrValue = elm.getAttribute(attributeName);

        if (attrValue != null) {
          const parsedAttrValue = parsePropertyValue(attrValue, memberFlags);
          hostRef.$instanceValues$.set(memberName, parsedAttrValue);
        }

        Object.defineProperty(elm, memberName,
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

      } else if (memberFlags & MEMBER_TYPE.Method) {
        Object.defineProperty(elm, memberName, {
          value(this: d.HostElement) {
            const ref = getHostRef(this);
            const args = arguments;
            return ref.$onReadyPromise$.then(() => ref.$lazyInstance$[memberName].apply(ref.$lazyInstance$, args)).catch(consoleError);
          }
        });
      }
    });
  }
}


function componentOnReady(this: d.HostElement) {
  return getHostRef(this).$onReadyPromise$;
}

function forceUpdate(this: d.HostElement) {/**/}
