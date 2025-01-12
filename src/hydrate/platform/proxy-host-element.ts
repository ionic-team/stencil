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
        let parsedAttrValue: any;

        if (attrValue != null) {
          parsedAttrValue = parsePropertyValue(attrValue, memberFlags);
          if (origSetter) {
            // we have an original setter, so let's set the value via that.
            origSetter.apply(elm, [parsedAttrValue]);
            parsedAttrValue = origGetter ? origGetter.apply(elm) : parsedAttrValue;
          }
          hostRef?.$instanceValues$?.set(memberName, parsedAttrValue);
        }

        const ownValue = (elm as any)[memberName];
        if (ownValue !== undefined) {
          // we've got an actual value already set on the host element
          // let's add that to our instance values and pull it off the element
          // so the getter/setter kicks in instead, but still getting this value
          hostRef?.$instanceValues$?.set(memberName, ownValue);
          delete (elm as any)[memberName];
        }

        // if we have a parsed value from an attribute use that first.
        // otherwise if we have a getter already applied, use that.
        // we'll do this for both the element and the component instance.
        // this makes sure attribute values take priority over default values.
        function getter(this: d.RuntimeRef) {
          return ![undefined, null].includes(parsedAttrValue)
            ? parsedAttrValue
            : origGetter
              ? origGetter.apply(this)
              : getValue(this, memberName);
        }
        Object.defineProperty(elm, memberName, {
          get: getter,
          set(this: d.RuntimeRef, newValue) {
            // proxyComponent, set value
            setValue(this, memberName, newValue, cmpMeta);
          },
          configurable: true,
          enumerable: true,
        });

        Object.defineProperty((cstr as any).prototype, memberName, {
          get: getter,
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
