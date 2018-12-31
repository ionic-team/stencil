/**
 * Production setAccessor() function based on Preact by
 * Jason Miller (@developit)
 * Licensed under the MIT License
 * https://github.com/developit/preact/blob/master/LICENSE
 *
 * Modified for Stencil's compiler and vdom
 */

import * as d from '../../declarations';
import { toLowerCase } from '../../util/helpers';


export const setAccessor = (elm: d.HostElement, memberName: string, oldValue: any, newValue: any, isSvg: boolean) => {
  if (BUILD.vdomKey && memberName === 'key') {
    // minifier will clean this up

  } else if (BUILD.vdomRef && memberName === 'ref') {
    // minifier will clean this up

  } else if (BUILD.vdomClass && memberName === 'class' && (!isSvg)) {
    // Class
    if (BUILD.updatable) {
      if (oldValue !== newValue) {
        const oldList = parseClassList(oldValue);
        const newList = parseClassList(newValue);

        // remove classes in oldList, not included in newList
        const toRemove = oldList.filter(item => !newList.includes(item));
        const classList = parseClassList(elm.className)
          .filter(item => !toRemove.includes(item));

        // add classes from newValue that are not in oldList or classList
        const toAdd = newList.filter(item => !oldList.includes(item) && !classList.includes(item));
        classList.push(...toAdd);

        elm.className = classList.join(' ');
      }

    } else {
      elm.className = newValue;
    }

  } else if (BUILD.vdomStyle && memberName === 'style') {
    // update style attribute, css properties and values
    if (BUILD.updatable) {
      for (const prop in oldValue) {
        if (!newValue || newValue[prop] == null) {
          if (/-/.test(prop)) {
            elm.style.removeProperty(prop);
          } else {
            (elm as any).style[prop] = '';
          }
        }
      }
    }

    for (const prop in newValue) {
      if (!oldValue || newValue[prop] !== oldValue[prop]) {
        if (/-/.test(prop)) {
          elm.style.setProperty(prop, newValue[prop]);
        } else {
          (elm as any).style[prop] = newValue[prop];
        }
      }
    }

  } else if (BUILD.vdomListener && (memberName[0] === 'o' && memberName[1] === 'n' && /[A-Z]/.test(memberName[2])) && (!(memberName in elm))) {
    // Event Handlers
    // so if the member name starts with "on" and the 3rd characters is
    // a capital letter, and it's not already a member on the element,
    // then we're assuming it's an event listener

    if (toLowerCase(memberName) in elm) {
      // standard event
      // the JSX attribute could have been "onMouseOver" and the
      // member name "onmouseover" is on the element's prototype
      // so let's add the listener "mouseover", which is all lowercased
      memberName = toLowerCase(memberName.substring(2));

    } else {
      // custom event
      // the JSX attribute could have been "onMyCustomEvent"
      // so let's trim off the "on" prefix and lowercase the first character
      // and add the listener "myCustomEvent"
      // except for the first character, we keep the event name case
      memberName = toLowerCase(memberName[2]) + memberName.substring(3);
    }

    if (newValue) {
      if (!oldValue) {
        elm.addEventListener(name, eventProxy);
      }

    } else if (BUILD.updatable) {
      elm.removeEventListener(name, eventProxy);
    }

    (elm._listeners || (elm._listeners = {}))[memberName] = newValue;

  } else if (BUILD.member && (memberName !== 'list' && memberName !== 'type' && !isSvg &&
      (memberName in elm || (['object', 'function'].indexOf(typeof newValue) !== -1) && newValue !== null))) {
    // Properties
    // - list and type are attributes that get applied as values on the element
    // - all svgs get values as attributes not props
    // - check if elm contains name or if the value is array, object, or function
    if (elm.tagName.includes('-')) {
      // this member name is a property on a custom element
      setProperty(elm, memberName, newValue);

    } else {
      // this member name is a property on this element, but it's not a custom element
      // this is a native property like "value" or something\
      setProperty(elm, memberName, newValue == null ? '' : newValue);
      if ((newValue == null || newValue === false) && name !== 'spellcheck') {
        elm.removeAttribute(name);
      }
    }

  } else {
    if (BUILD.isDev && memberName === 'htmlfor') {
      console.error(`Attribute "htmlfor" set on ${elm.tagName.toLowerCase()}, with the lower case "f" must be replaced with a "htmlFor" (capital "F")`);
    }

    let ns: boolean;
    if (BUILD.svg) {
      ns = isSvg && (memberName !== (memberName = memberName.replace(/^xlink:?/, '')));
    }

    if (newValue == null || newValue === false) {
      if (BUILD.svg && ns) {
        elm.removeAttributeNS('http://www.w3.org/1999/xlink', toLowerCase(memberName));
      } else {
        elm.removeAttribute(memberName);
      }

    } else if (typeof newValue !== 'function') {
      if (BUILD.svg && ns) {
        elm.setAttributeNS('http://www.w3.org/1999/xlink', toLowerCase(memberName), newValue);
      } else {
        elm.setAttribute(memberName, newValue);
      }
    }
  }
};


const parseClassList = (value: string | undefined | null): string[] =>
  (value == null || value === '') ? [] : value.trim().split(/\s+/);


/**
 * Attempt to set a DOM property to the given value.
 * IE & FF throw for certain property-value combinations.
 */
const setProperty = (elm: any, name: string, value: any) => {
  try {
    elm[name] = value;
  } catch (e) { }
};


function eventProxy(this: d.HostElement, e: any) {
  return this._listeners[e.type](e);
}
