import { consoleError, getHostRef } from '@platform';
import { getValue, parsePropertyValue, setValue } from '@runtime';
export function proxyHostElement(elm, cmpMeta) {
    if (typeof elm.componentOnReady !== 'function') {
        elm.componentOnReady = componentOnReady;
    }
    if (typeof elm.forceUpdate !== 'function') {
        elm.forceUpdate = forceUpdate;
    }
    if (cmpMeta.$flags$ & 1 /* CMP_FLAGS.shadowDomEncapsulation */) {
        elm.shadowRoot = elm;
    }
    if (cmpMeta.$members$ != null) {
        const hostRef = getHostRef(elm);
        const members = Object.entries(cmpMeta.$members$);
        members.forEach(([memberName, m]) => {
            const memberFlags = m[0];
            if (memberFlags & 31 /* MEMBER_FLAGS.Prop */) {
                const attributeName = m[1] || memberName;
                const attrValue = elm.getAttribute(attributeName);
                if (attrValue != null) {
                    const parsedAttrValue = parsePropertyValue(attrValue, memberFlags);
                    hostRef.$instanceValues$.set(memberName, parsedAttrValue);
                }
                const ownValue = elm[memberName];
                if (ownValue !== undefined) {
                    // we've got an actual value already set on the host element
                    // let's add that to our instance values and pull it off the element
                    // so the getter/setter kicks in instead, but still getting this value
                    hostRef.$instanceValues$.set(memberName, ownValue);
                    delete elm[memberName];
                }
                // create the getter/setter on the host element for this property name
                Object.defineProperty(elm, memberName, {
                    get() {
                        // proxyComponent, get value
                        return getValue(this, memberName);
                    },
                    set(newValue) {
                        // proxyComponent, set value
                        setValue(this, memberName, newValue, cmpMeta);
                    },
                    configurable: true,
                    enumerable: true,
                });
            }
            else if (memberFlags & 64 /* MEMBER_FLAGS.Method */) {
                Object.defineProperty(elm, memberName, {
                    value(...args) {
                        const ref = getHostRef(this);
                        return ref.$onInstancePromise$.then(() => ref.$lazyInstance$[memberName](...args)).catch(consoleError);
                    },
                });
            }
        });
    }
}
function componentOnReady() {
    return getHostRef(this).$onReadyPromise$;
}
function forceUpdate() {
    /**/
}
//# sourceMappingURL=proxy-host-element.js.map