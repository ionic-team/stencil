/**
 * Production setAccessor() function based on Preact by
 * Jason Miller (@developit)
 * Licensed under the MIT License
 * https://github.com/developit/preact/blob/master/LICENSE
 *
 * Modified for Stencil's compiler and vdom
 */

import * as d from '@declarations';
import { BUILD } from '@build-conditionals';
import { toLowerCase } from '@utils';

const vdomListenersMap = new WeakMap<HTMLElement, Map<string, Function>>();

export const setAccessor = (elm: d.HostElement, memberName: string, oldValue: any, newValue: any, isSvg: boolean, isHost: boolean) => {
  if (BUILD.vdomClass && memberName === 'class' && !isSvg) {
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
  } else if (BUILD.vdomKey && memberName === 'key') {
    // minifier will clean this up

  } else if (BUILD.vdomRef && memberName === 'ref') {
    // minifier will clean this up

  } else if (BUILD.vdomListener && /^on[A-Z]/.test(memberName) && !(memberName in elm)) {
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

    let vdomListeners = vdomListenersMap.get(elm);
    if (newValue) {
      if (!vdomListeners) {
        vdomListenersMap.set(elm, vdomListeners = new Map());
      }
      vdomListeners.set(memberName, newValue);

      if (!oldValue) {
        elm.addEventListener(memberName, vdomListenerProxy);
      }

    } else if (BUILD.updatable && vdomListeners) {
      vdomListeners.delete(memberName);
      if (vdomListeners.size === 0) {
        elm.removeEventListener(memberName, vdomListenerProxy);
      }
    }

  } else {
    // TODO
    // handle special cases
    // } else if (BUILD.member && (memberName !== 'list' && memberName !== 'type' && !isSvg &&
    // (memberName in elm || (['object', 'function'].indexOf(typeof newValue) !== -1) && newValue !== null))) {

    const isProp = memberName in elm;
    if (isProp) {
      setProperty(elm, memberName, newValue);
    }
    if (!isProp || isHost) {
      updateAttribute(elm, memberName, newValue);
    }
  }
};


const parseClassList = (value: string | undefined | null): string[] =>
  (value == null || value === '') ? [] : value.trim().split(/\s+/);


const setProperty = (elm: any, propName: string, newValue: any) => {
  try {
    elm[propName] = newValue;
  } catch (e) {}
};

export const updateAttribute = (
  elm: HTMLElement,
  memberName: string,
  newValue: any,
  isBooleanAttr = typeof newValue === 'boolean',
  isXlinkNs?: boolean
) => {
  if (BUILD.svg) {
    isXlinkNs = (memberName !== (memberName = memberName.replace(/^xlink\:?/, '')));
  }

  if (newValue == null || (isBooleanAttr && (!newValue || newValue === 'false'))) {
    if (BUILD.svg && isXlinkNs) {
      elm.removeAttributeNS(XLINK_NS, toLowerCase(memberName));

    } else {
      elm.removeAttribute(memberName);
    }

  } else if (typeof newValue !== 'function') {
    if (isBooleanAttr) {
      newValue = '';
    } else {
      newValue = newValue.toString();
    }
    if (BUILD.svg && isXlinkNs) {
      elm.setAttributeNS(XLINK_NS, toLowerCase(memberName), newValue);

    } else {
      elm.setAttribute(memberName, newValue);
    }
  }
};

function vdomListenerProxy(this: d.HostElement, ev: Event) {
  return vdomListenersMap.get(this).get(ev.type)(ev);
}

const XLINK_NS = 'http://www.w3.org/1999/xlink';