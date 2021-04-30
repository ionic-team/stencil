import type * as d from '../declarations';
import { BUILD } from '@app-data';
import { consoleDevWarn, getHostRef, plt } from '@platform';
import { getValue, setValue } from './set-value';
import { HOST_FLAGS, MEMBER_FLAGS } from '../utils/constants';
import { PROXY_FLAGS } from './runtime-constants';

export const proxyComponent = (Cstr: d.ComponentConstructor, cmpMeta: d.ComponentRuntimeMeta, flags: number) => {
  if (BUILD.member && cmpMeta.$members$) {
    if (BUILD.watchCallback && Cstr.watchers) {
      cmpMeta.$watchers$ = Cstr.watchers;
    }
    // It's better to have a const than two Object.entries()
    const members = Object.entries(cmpMeta.$members$);
    const prototype = (Cstr as any).prototype;

    members.map(([memberName, [memberFlags]]) => {
      if ((BUILD.prop || BUILD.state) && (memberFlags & MEMBER_FLAGS.Prop || ((!BUILD.lazyLoad || flags & PROXY_FLAGS.proxyState) && memberFlags & MEMBER_FLAGS.State))) {
        if ((memberFlags & MEMBER_FLAGS.Getter) === 0) {
          // proxyComponent - prop
          Object.defineProperty(prototype, memberName, {
            get(this: d.RuntimeRef) {
              // proxyComponent, get value
              return getValue(this, memberName);
            },
            set(this: d.RuntimeRef, newValue) {
              // only during dev time
              if (BUILD.isDev) {
                const ref = getHostRef(this);
                if (
                  // we are proxying the instance (not element)
                  (flags & PROXY_FLAGS.isElementConstructor) === 0 &&
                  // the element is not constructing
                  (ref.$flags$ & HOST_FLAGS.isConstructingInstance) === 0 &&
                  // the member is a prop
                  (memberFlags & MEMBER_FLAGS.Prop) !== 0 &&
                  // the member is not mutable
                  (memberFlags & MEMBER_FLAGS.Mutable) === 0
                ) {
                  consoleDevWarn(`@Prop() "${memberName}" on <${cmpMeta.$tagName$}> is immutable but was modified from within the component.\nMore information: https://stenciljs.com/docs/properties#prop-mutability`);
                }
              }
              // proxyComponent, set value
              setValue(this, memberName, newValue, cmpMeta);
            },
            configurable: true,
            enumerable: true,
          });
        } else if (flags & PROXY_FLAGS.isElementConstructor && memberFlags & MEMBER_FLAGS.Getter) {
          if (BUILD.lazyLoad) {
            // lazy maps the element get / set to the class get / set

            // proxyComponent - lazy prop getter
            Object.defineProperty(prototype, memberName, {
              get(this: d.RuntimeRef) {
                const ref = getHostRef(this);
                const instance = BUILD.lazyLoad ? ref.$lazyInstance$ : prototype;
                return instance[memberName];
              },
              configurable: true,
              enumerable: true,
            });
            if (memberFlags & MEMBER_FLAGS.Setter) {
              // proxyComponent - lazy prop setter
              Object.defineProperty(prototype, memberName, {
                set(this: d.RuntimeRef, newValue) {
                  const ref = getHostRef(this);
                  const setVal = (init = false) => {
                    ref.$lazyInstance$[memberName] = newValue;
                    setValue(this, memberName, ref.$lazyInstance$[memberName], cmpMeta, !init);
                  };
                  // If there's a value from an attribute, (before the class is defined), queue & set async
                  if (ref.$lazyInstance$) { setVal(); }
                  else { ref.$onInstancePromise$.then(() => setVal(true)); }
                }
              })
            }
          } else if (memberFlags & MEMBER_FLAGS.Setter) {
            // non-lazy setter - amends original set to fire update

            // proxyComponent - non-lazy prop setter
            const origSetter =  Object.getOwnPropertyDescriptor(prototype, memberName).set;
            Object.defineProperty(prototype, memberName, {
              set(this: d.RuntimeRef, newValue) {
                const ref = getHostRef(this);
                origSetter.apply(this, [newValue]);
                setValue(this, memberName, ref.$hostElement$[(memberName as keyof d.HostElement)], cmpMeta);
              }
            });
          }
        }
      } else if (BUILD.lazyLoad && BUILD.method && flags & PROXY_FLAGS.isElementConstructor && memberFlags & MEMBER_FLAGS.Method) {
        // proxyComponent - method
        Object.defineProperty(prototype, memberName, {
          value(this: d.HostElement, ...args: any[]) {
            const ref = getHostRef(this);
            return ref.$onInstancePromise$.then(() => ref.$lazyInstance$[memberName](...args));
          },
        });
      }
    });

    if (BUILD.observeAttribute && (!BUILD.lazyLoad || flags & PROXY_FLAGS.isElementConstructor)) {
      const attrNameToPropName = new Map();

      prototype.attributeChangedCallback = function (attrName: string, _oldValue: string, newValue: string) {
        plt.jmp(() => {
          const propName = attrNameToPropName.get(attrName);
          this[propName] = newValue === null && typeof this[propName] === 'boolean' ? false : newValue;
        });
      };

      // create an array of attributes to observe
      // and also create a map of html attribute name to js property name
      Cstr.observedAttributes = members
        .filter(([_, m]) => m[0] & MEMBER_FLAGS.HasAttribute) // filter to only keep props that should match attributes
        .map(([propName, m]) => {
          const attrName = m[1] || propName;
          attrNameToPropName.set(attrName, propName);
          if (BUILD.reflect && m[0] & MEMBER_FLAGS.ReflectAttr) {
            cmpMeta.$attrsToReflect$.push([propName, attrName]);
          }
          return attrName;
        });
    }
  }

  return Cstr;
};
