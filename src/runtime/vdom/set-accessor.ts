/**
 * Production setAccessor() function based on Preact by
 * Jason Miller (@developit)
 * Licensed under the MIT License
 * https://github.com/developit/preact/blob/master/LICENSE
 *
 * Modified for Stencil's compiler and vdom
 */

import * as d from '../../declarations';
import { BUILD } from '@build-conditionals';
import { toLowerCase } from '@utils';
import { VNODE_FLAGS, XLINK_NS } from '../runtime-constants';

export const setAccessor = (elm: d.HostElement, memberName: string, oldValue: any, newValue: any, isSvg: boolean, flags: number) => {
  if (BUILD.vdomClass && memberName === 'class' && !isSvg) {
    // Class
    if (BUILD.updatable) {
      if (oldValue !== newValue) {
        const oldList = parseClassList(oldValue);
        const newList = parseClassList(newValue);
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
          if (!BUILD.hydrateServerSide && /-/.test(prop)) {
            elm.style.removeProperty(prop);
          } else {
            (elm as any).style[prop] = '';
          }
        }
      }
    }

    for (const prop in newValue) {
      if (!oldValue || newValue[prop] !== oldValue[prop]) {
        if (!BUILD.hydrateServerSide && /-/.test(prop)) {
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

  } else if (BUILD.vdomListener && memberName.startsWith('on') && !(memberName in elm)) {
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
    if (oldValue) {
      elm.removeEventListener(memberName, oldValue);
    }
    if (newValue) {
      elm.addEventListener(memberName, newValue);
    }

  } else {
    // Set property if it exists and it's not a SVG
    const isProp = memberName in elm;
    const isComplex = ['object', 'function'].includes(typeof newValue);
    if ((isProp || (isComplex && newValue !== null)) && !isSvg) {
      try {
        (elm as any)[memberName] = newValue == null && elm.tagName.indexOf('-') === -1 ? '' : newValue;
      } catch (e) {}
    }

    /**
     * Need to manually update attribute if:
     * - memberName is not an attribute
     * - if we are rendering the host element in order to reflect attribute
     * - if it's a SVG, since properties might not work in <svg>
     * - if the newValue is null/undefined or 'false'.
     */
    const isXlinkNs = BUILD.svg && isSvg && (memberName !== (memberName = memberName.replace(/^xlink\:?/, '')));
    if (newValue == null || newValue === false) {
      if (isXlinkNs) {
        elm.removeAttributeNS(XLINK_NS, toLowerCase(memberName));
      } else {
        elm.removeAttribute(memberName);
      }
    } else if ((!isProp || (flags & VNODE_FLAGS.isHost) || isSvg) && !isComplex) {
      newValue = newValue === true ? '' : newValue.toString();
      if (isXlinkNs) {
        elm.setAttributeNS(XLINK_NS, toLowerCase(memberName), newValue);
      } else {
        elm.setAttribute(memberName, newValue);
      }
    }
  }
};

const parseClassList = (value: string | undefined | null): string[] =>
  (value == null || value === '') ? [] : value.split(' ');
