import { BUILD } from '@app-data';
import { consoleError, getHostRef } from '@platform';
import { getValue, parsePropertyValue, setValue } from '@runtime';
import { CMP_FLAGS, MEMBER_FLAGS } from '@utils';

import type * as d from '../../declarations';

export function proxyHostElement(elm: d.HostElement, cstr: d.ComponentConstructor): void {
  const cmpMeta = cstr.cmpMeta;

  if (typeof elm.componentOnReady !== 'function') {
    elm.componentOnReady = componentOnReady;
  }
  if (typeof elm.forceUpdate !== 'function') {
    elm.forceUpdate = forceUpdate;
  }

  /**
   * Only attach shadow root if there isn't one already
   */
  if (!elm.shadowRoot && !!(cmpMeta.$flags$ & CMP_FLAGS.shadowDomEncapsulation)) {
    if (BUILD.shadowDelegatesFocus) {
      elm.attachShadow({
        mode: 'open',
        delegatesFocus: !!(cmpMeta.$flags$ & CMP_FLAGS.shadowDelegatesFocus),
      });
    } else {
      elm.attachShadow({ mode: 'open' });
    }
  }

  if (cmpMeta.$members$ != null) {
    const hostRef = getHostRef(elm);

    const members = Object.entries(cmpMeta.$members$);

    members.forEach(([memberName, [memberFlags, metaAttributeName]]) => {
      if (memberFlags & MEMBER_FLAGS.Prop) {
        const attributeName = metaAttributeName || memberName;
        let attrValue = elm.getAttribute(attributeName);

        /**
         * allow hydrate parameters that contain a simple object, e.g.
         * ```ts
         * import { renderToString } from 'component-library/hydrate';
         * await renderToString(`<car-detail car=${JSON.stringify({ year: 1234 })}></car-detail>`);
         * ```
         */
        if (
          (attrValue?.startsWith('{') && attrValue.endsWith('}')) ||
          (attrValue?.startsWith('[') && attrValue.endsWith(']'))
        ) {
          try {
            attrValue = JSON.parse(attrValue);
          } catch (e) {
            /* ignore */
          }
        }

        const { get: origGetter, set: origSetter } =
          Object.getOwnPropertyDescriptor((cstr as any).prototype, memberName) || {};

        let attrPropVal: any;

        if (attrValue != null) {
          attrPropVal = parsePropertyValue(attrValue, memberFlags);
        }

        const ownValue = (elm as any)[memberName];
        if (ownValue !== undefined) {
          attrPropVal = ownValue;
          // we've got an actual value already set on the host element
          // let's add that to our instance values and pull it off the element
          // so the getter/setter kicks in instead, but still getting this value
          delete (elm as any)[memberName];
        }

        if (attrPropVal !== undefined) {
          if (origSetter) {
            // we have an original setter, so let's set the value via that.
            origSetter.apply(elm, [attrPropVal]);
            attrPropVal = origGetter ? origGetter.apply(elm) : attrPropVal;
          }
          hostRef?.$instanceValues$?.set(memberName, attrPropVal);
        }

        // element
        Object.defineProperty(elm, memberName, {
          get: function (this: any) {
            return getValue(this, memberName);
          },
          set(this: d.RuntimeRef, newValue) {
            // proxyComponent, set value
            setValue(this, memberName, newValue, cmpMeta);
          },
          configurable: true,
          enumerable: true,
        });

        // instance
        Object.defineProperty((cstr as any).prototype, memberName, {
          get: function (this: any) {
            if (origGetter && attrPropVal === undefined && !getValue(this, memberName)) {
              // if the initial value comes from an instance getter
              // the element will never have the value set. So let's do that now.
              setValue(this, memberName, origGetter.apply(this), cmpMeta);
            }

            // if we have a parsed value from an attribute / or userland prop use that first.
            // otherwise if we have a getter already applied, use that.
            return attrPropVal !== undefined
              ? attrPropVal
              : origGetter
                ? origGetter.apply(this)
                : getValue(this, memberName);
          },
          configurable: true,
          enumerable: true,
        });
      } else if (memberFlags & MEMBER_FLAGS.Method) {
        Object.defineProperty(elm, memberName, {
          value(this: d.HostElement, ...args: any[]) {
            const ref = getHostRef(this);
            return ref?.$onInstancePromise$?.then(() => ref?.$lazyInstance$?.[memberName](...args)).catch(consoleError);
          },
        });
      }
    });
  }
}

function componentOnReady(this: d.HostElement) {
  return getHostRef(this)?.$onReadyPromise$;
}

function forceUpdate(this: d.HostElement) {
  /**/
}
