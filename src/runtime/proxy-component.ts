import { BUILD } from '@app-data';
import { consoleDevWarn, getHostRef, plt } from '@platform';
import { CMP_FLAGS } from '@utils';

import type * as d from '../declarations';
import { HOST_FLAGS, MEMBER_FLAGS } from '../utils/constants';
import { FORM_ASSOCIATED_CUSTOM_ELEMENT_CALLBACKS, PROXY_FLAGS } from './runtime-constants';
import { getValue, setValue } from './set-value';

/**
 * Attach a series of runtime constructs to a compiled Stencil component
 * constructor, including getters and setters for the `@Prop` and `@State`
 * decorators, callbacks for when attributes change, and so on.
 *
 * @param Cstr the constructor for a component that we need to process
 * @param cmpMeta metadata collected previously about the component
 * @param flags a number used to store a series of bit flags
 * @returns a reference to the same constructor passed in (but now mutated)
 */
export const proxyComponent = (
  Cstr: d.ComponentConstructor,
  cmpMeta: d.ComponentRuntimeMeta,
  flags: number,
): d.ComponentConstructor => {
  const prototype = (Cstr as any).prototype;

  /**
   * proxy form associated custom element lifecycle callbacks
   * @ref https://web.dev/articles/more-capable-form-controls#lifecycle_callbacks
   */
  if (BUILD.formAssociated && cmpMeta.$flags$ & CMP_FLAGS.formAssociated && flags & PROXY_FLAGS.isElementConstructor) {
    FORM_ASSOCIATED_CUSTOM_ELEMENT_CALLBACKS.forEach((cbName) =>
      Object.defineProperty(prototype, cbName, {
        value(this: d.HostElement, ...args: any[]) {
          const hostRef = getHostRef(this);
          const elm = BUILD.lazyLoad ? hostRef.$hostElement$ : this;
          const instance: d.ComponentInterface = BUILD.lazyLoad ? hostRef.$lazyInstance$ : elm;
          if (!instance) {
            hostRef.$onReadyPromise$.then((instance: d.ComponentInterface) => {
              const cb = instance[cbName];
              typeof cb === 'function' && cb.call(instance, ...args);
            });
          } else {
            const cb = instance[cbName];
            typeof cb === 'function' && cb.call(instance, ...args);
          }
        },
      }),
    );
  }

  if ((BUILD.member && cmpMeta.$members$) || (BUILD.watchCallback && (cmpMeta.$watchers$ || Cstr.watchers))) {
    if (BUILD.watchCallback && Cstr.watchers && !cmpMeta.$watchers$) {
      cmpMeta.$watchers$ = Cstr.watchers;
    }
    // It's better to have a const than two Object.entries()
    const members = Object.entries(cmpMeta.$members$ ?? {});
    members.map(([memberName, [memberFlags]]) => {
      if (
        (BUILD.prop || BUILD.state) &&
        (memberFlags & MEMBER_FLAGS.Prop ||
          ((!BUILD.lazyLoad || flags & PROXY_FLAGS.proxyState) && memberFlags & MEMBER_FLAGS.State))
      ) {
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
                (ref && ref.$flags$ & HOST_FLAGS.isConstructingInstance) === 0 &&
                // the member is a prop
                (memberFlags & MEMBER_FLAGS.Prop) !== 0 &&
                // the member is not mutable
                (memberFlags & MEMBER_FLAGS.Mutable) === 0
              ) {
                consoleDevWarn(
                  `@Prop() "${memberName}" on <${cmpMeta.$tagName$}> is immutable but was modified from within the component.\nMore information: https://stenciljs.com/docs/properties#prop-mutability`,
                );
              }
            }
            // proxyComponent, set value
            setValue(this, memberName, newValue, cmpMeta);
          },
          configurable: true,
          enumerable: true,
        });
      } else if (
        BUILD.lazyLoad &&
        BUILD.method &&
        flags & PROXY_FLAGS.isElementConstructor &&
        memberFlags & MEMBER_FLAGS.Method
      ) {
        // proxyComponent - method
        Object.defineProperty(prototype, memberName, {
          value(this: d.HostElement, ...args: any[]) {
            const ref = getHostRef(this);
            return ref?.$onInstancePromise$?.then(() => ref.$lazyInstance$?.[memberName](...args));
          },
        });
      }
    });

    if (BUILD.observeAttribute && (!BUILD.lazyLoad || flags & PROXY_FLAGS.isElementConstructor)) {
      const attrNameToPropName = new Map();

      prototype.attributeChangedCallback = function (attrName: string, oldValue: string, newValue: string) {
        plt.jmp(() => {
          const propName = attrNameToPropName.get(attrName);

          //  In a web component lifecycle the attributeChangedCallback runs prior to connectedCallback
          //  in the case where an attribute was set inline.
          //  ```html
          //    <my-component some-attribute="some-value"></my-component>
          //  ```
          //
          //  There is an edge case where a developer sets the attribute inline on a custom element and then
          //  programmatically changes it before it has been upgraded as shown below:
          //
          //  ```html
          //    <!-- this component has _not_ been upgraded yet -->
          //    <my-component id="test" some-attribute="some-value"></my-component>
          //    <script>
          //      // grab non-upgraded component
          //      el = document.querySelector("#test");
          //      el.someAttribute = "another-value";
          //      // upgrade component
          //      customElements.define('my-component', MyComponent);
          //    </script>
          //  ```
          //  In this case if we do not un-shadow here and use the value of the shadowing property, attributeChangedCallback
          //  will be called with `newValue = "some-value"` and will set the shadowed property (this.someAttribute = "another-value")
          //  to the value that was set inline i.e. "some-value" from above example. When
          //  the connectedCallback attempts to un-shadow it will use "some-value" as the initial value rather than "another-value"
          //
          //  The case where the attribute was NOT set inline but was not set programmatically shall be handled/un-shadowed
          //  by connectedCallback as this attributeChangedCallback will not fire.
          //
          //  https://developers.google.com/web/fundamentals/web-components/best-practices#lazy-properties
          //
          //  TODO(STENCIL-16) we should think about whether or not we actually want to be reflecting the attributes to
          //  properties here given that this goes against best practices outlined here
          //  https://developers.google.com/web/fundamentals/web-components/best-practices#avoid-reentrancy
          if (this.hasOwnProperty(propName)) {
            newValue = this[propName];
            delete this[propName];
          } else if (
            prototype.hasOwnProperty(propName) &&
            typeof this[propName] === 'number' &&
            this[propName] == newValue
          ) {
            // if the propName exists on the prototype of `Cstr`, this update may be a result of Stencil using native
            // APIs to reflect props as attributes. Calls to `setAttribute(someElement, propName)` will result in
            // `propName` to be converted to a `DOMString`, which may not be what we want for other primitive props.
            return;
          } else if (propName == null) {
            // At this point we should know this is not a "member", so we can treat it like watching an attribute
            // on a vanilla web component
            const hostRef = getHostRef(this);
            const flags = hostRef?.$flags$;

            // We only want to trigger the callback(s) if:
            // 1. The instance is ready
            // 2. The watchers are ready
            // 3. The value has changed
            if (
              flags &&
              !(flags & HOST_FLAGS.isConstructingInstance) &&
              flags & HOST_FLAGS.isWatchReady &&
              newValue !== oldValue
            ) {
              const elm = BUILD.lazyLoad ? hostRef.$hostElement$ : this;
              const instance = BUILD.lazyLoad ? hostRef.$lazyInstance$ : (elm as any);
              const entry = cmpMeta.$watchers$?.[attrName];
              entry?.forEach((callbackName) => {
                if (instance[callbackName] != null) {
                  instance[callbackName].call(instance, newValue, oldValue, attrName);
                }
              });
            }

            return;
          }

          this[propName] = newValue === null && typeof this[propName] === 'boolean' ? false : newValue;
        });
      };

      // Create an array of attributes to observe
      // This list in comprised of all strings used within a `@Watch()` decorator
      // on a component as well as any Stencil-specific "members" (`@Prop()`s and `@State()`s).
      // As such, there is no way to guarantee type-safety here that a user hasn't entered
      // an invalid attribute.
      Cstr.observedAttributes = Array.from(
        new Set([
          ...Object.keys(cmpMeta.$watchers$ ?? {}),
          ...members
            .filter(([_, m]) => m[0] & MEMBER_FLAGS.HasAttribute)
            .map(([propName, m]) => {
              const attrName = m[1] || propName;
              attrNameToPropName.set(attrName, propName);
              if (BUILD.reflect && m[0] & MEMBER_FLAGS.ReflectAttr) {
                cmpMeta.$attrsToReflect$?.push([propName, attrName]);
              }

              return attrName;
            }),
        ]),
      );
    }
  }

  return Cstr;
};
