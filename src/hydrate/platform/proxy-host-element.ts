import { consoleError, getHostRef } from '@platform';
import { getValue, parsePropertyValue, setValue } from '@runtime';
import { CMP_FLAGS, MEMBER_FLAGS } from '@utils';

import type * as d from '../../declarations';

export function proxyHostElement(elm: d.HostElement, cmpMeta: d.ComponentRuntimeMeta): void {
  if (typeof elm.componentOnReady !== 'function') {
    elm.componentOnReady = componentOnReady;
  }
  if (typeof elm.forceUpdate !== 'function') {
    elm.forceUpdate = forceUpdate;
  }
  if (cmpMeta.$flags$ & CMP_FLAGS.shadowDomEncapsulation) {
    (elm as any).shadowRoot = elm;
  }

  if (cmpMeta.$members$ != null) {
    const hostRef = getHostRef(elm);

    const members = Object.entries(cmpMeta.$members$);

    members.forEach(([memberName, m]) => {
      const memberFlags = m[0];

      if (memberFlags & MEMBER_FLAGS.Prop) {
        const attributeName = m[1] || memberName;
        const attrValue = elm.getAttribute(attributeName);

        if (attrValue != null) {
          const parsedAttrValue = parsePropertyValue(attrValue, memberFlags);
          hostRef.$instanceValues$.set(memberName, parsedAttrValue);
        }

        const ownValue = (elm as any)[memberName];
        if (ownValue !== undefined) {
          // we've got an actual value already set on the host element
          // let's add that to our instance values and pull it off the element
          // so the getter/setter kicks in instead, but still getting this value
          hostRef.$instanceValues$.set(memberName, ownValue);
          delete (elm as any)[memberName];
        }

        if ((memberFlags & MEMBER_FLAGS.Getter) === 0) {
          // create the getter/setter on the host element for this property name
          Object.defineProperty(elm, memberName, {
            get(this: d.RuntimeRef) {
              // proxyComponent, get value
              return getValue(this, memberName);
            },
            set(this: d.RuntimeRef, newValue) {
              // proxyComponent, set value
              setValue(this, memberName, newValue, cmpMeta);
            },
            configurable: true,
            enumerable: true,
          });
        } else {
          // lazy maps the element get / set to the class get / set
          // proxyComponent - lazy prop getter
          Object.defineProperty(elm, memberName, {
            get(this: d.RuntimeRef) {
              const ref = getHostRef(this);
              return ref?.$lazyInstance$ ? ref.$lazyInstance$[memberName] : undefined;
            },
            configurable: true,
            enumerable: true,
          });
          if (memberFlags & MEMBER_FLAGS.Setter) {
            // proxyComponent - lazy prop setter
            Object.defineProperty(elm, memberName, {
              set(this: d.RuntimeRef, newValue) {
                const ref = getHostRef(this);
                if (!ref) return;

                const setVal = (init = false) => {
                  if (ref.$lazyInstance$) ref.$lazyInstance$[memberName] = newValue;
                  setValue(this, memberName, newValue, cmpMeta, !init);
                };
                // If there's a value from an attribute, (before the class is defined), queue & set async
                if (ref.$lazyInstance$) {
                  setVal();
                } else if (ref.$onInstancePromise$) {
                  ref.$onInstancePromise$.then(() => setVal(true));
                }
              },
            });
          }
        }
      } else if (memberFlags & MEMBER_FLAGS.Method) {
        Object.defineProperty(elm, memberName, {
          value(this: d.HostElement, ...args: any[]) {
            const ref = getHostRef(this);
            return ref.$onInstancePromise$.then(() => ref.$lazyInstance$[memberName](...args)).catch(consoleError);
          },
        });
      }
    });
  }
}

function componentOnReady(this: d.HostElement) {
  return getHostRef(this).$onReadyPromise$;
}

function forceUpdate(this: d.HostElement) {
  /**/
}
