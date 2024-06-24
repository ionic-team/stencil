import { BUILD } from '@app-data';
import { consoleError, getHostRef } from '@platform';
import { getValue, parsePropertyValue, setValue } from '@runtime';
import { CMP_FLAGS, MEMBER_FLAGS } from '@utils';

import type * as d from '../../declarations';

export function proxyHostElement(
  elm: d.HostElement,
  cmpMeta: d.ComponentRuntimeMeta,
  opts: d.HydrateFactoryOptions,
): void {
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
    } else if (opts.serializeShadowRoot) {
      elm.attachShadow({ mode: 'open' });
    } else {
      /**
       * For hydration users may want to render the shadow component as scoped
       * component, so we need to assign the element as shadowRoot.
       */
      (elm as any).shadowRoot = elm;
    }
  }

  if (cmpMeta.$members$ != null) {
    const hostRef = getHostRef(elm);

    const members = Object.entries(cmpMeta.$members$);

    members.forEach(([memberName, m]) => {
      const memberFlags = m[0];

      if (memberFlags & MEMBER_FLAGS.Prop) {
        const attributeName = m[1] || memberName;
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

        if (attrValue != null) {
          const parsedAttrValue = parsePropertyValue(attrValue, memberFlags);
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
