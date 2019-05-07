import * as d from '../declarations';
import { BUILD } from '@build-conditionals';
import { getHostRef } from '@platform';
import { getValue, setValue } from './set-value';
import { MEMBER_FLAGS } from '../utils/constants';

export const proxyComponent = (Cstr: d.ComponentConstructor, cmpMeta: d.ComponentRuntimeMeta, isElementConstructor: 0 | 1, proxyState: 0 | 1) => {
  if (BUILD.member && cmpMeta.$members$) {
    if (BUILD.watchCallback && Cstr.watchers) {
      cmpMeta.$watchers$ = Cstr.watchers;
    }
    // It's better to have a const than two Object.entries()
    const members = Object.entries(cmpMeta.$members$);

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

      } else if (BUILD.lazyLoad && BUILD.method && isElementConstructor && (memberFlags & MEMBER_FLAGS.Method)) {
        // proxyComponent - method
        Object.defineProperty((Cstr as any).prototype, memberName, {
          value(this: d.HostElement, ...args: any[]) {
            const ref = getHostRef(this);
            return ref.$onReadyPromise$.then(() => ref.$lazyInstance$[memberName](...args));
          }
        });
      }
    });

    if (BUILD.observeAttribute && (!BUILD.lazyLoad || isElementConstructor)) {
      const attrNameToPropName = new Map();

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
