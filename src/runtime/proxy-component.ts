import * as d from '../declarations';
import { BUILD } from '@build-conditionals';
import { getHostRef, plt } from '@platform';
import { getValue, setValue } from './set-value';
import { MEMBER_FLAGS } from '../utils/constants';
import { PROXY_FLAGS } from './runtime-constants';
import { STENCIL_DEV_MODE } from './profile';

export const proxyComponent = (Cstr: d.ComponentConstructor, cmpMeta: d.ComponentRuntimeMeta, flags: number) => {
  if (BUILD.member && cmpMeta.$members$) {
    if (BUILD.watchCallback && Cstr.watchers) {
      cmpMeta.$watchers$ = Cstr.watchers;
    }
    // It's better to have a const than two Object.entries()
    const members = Object.entries(cmpMeta.$members$);
    const prototype = (Cstr as any).prototype;

    members.forEach(([memberName, [memberFlags]]) => {
      if ((BUILD.prop || BUILD.state) && (
        (memberFlags & MEMBER_FLAGS.Prop) ||
        (
          (!BUILD.lazyLoad || flags & PROXY_FLAGS.proxyState) &&
          (memberFlags & MEMBER_FLAGS.State)
        )
      )) {
        // proxyComponent - prop
        Object.defineProperty(prototype, memberName,
          {
            get(this: d.RuntimeRef) {
              // proxyComponent, get value
              return getValue(this, memberName);
            },
            set(this: d.RuntimeRef, newValue) {
              if (
                // only during dev time
                (BUILD.isDev) &&
                // we are proxing the instance (not element)
                (flags & PROXY_FLAGS.isElementConstructor) === 0 &&
                // the member is a non-mutable prop
                (memberFlags & (MEMBER_FLAGS.Prop | MEMBER_FLAGS.Mutable)) === MEMBER_FLAGS.Prop
              ) {
                console.warn(...STENCIL_DEV_MODE, `@Prop() "${memberName}" on "${cmpMeta.$tagName$}" cannot be modified.\nFurther information: https://stenciljs.com/docs/properties#prop-mutability`);
              }
              // proxyComponent, set value
              setValue(this, memberName, newValue, cmpMeta);
            },
            configurable: true,
            enumerable: true
          }
        );

      } else if (BUILD.lazyLoad && BUILD.method && (flags & PROXY_FLAGS.isElementConstructor) && (memberFlags & MEMBER_FLAGS.Method)) {
        // proxyComponent - method
        Object.defineProperty(prototype, memberName, {
          value(this: d.HostElement, ...args: any[]) {
            const ref = getHostRef(this);
            return ref.$onInstancePromise$.then(() => ref.$lazyInstance$[memberName](...args));
          }
        });
      }
    });

    if (BUILD.observeAttribute && (!BUILD.lazyLoad || flags & PROXY_FLAGS.isElementConstructor)) {
      const attrNameToPropName = new Map();

      prototype.attributeChangedCallback = function(attrName: string, _oldValue: string, newValue: string) {
        plt.jmp(() => {
          const propName = attrNameToPropName.get(attrName);
          this[propName] = newValue === null && typeof this[propName] === 'boolean'
            ? false
            : newValue;
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
