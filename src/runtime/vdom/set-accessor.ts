/**
 * Production setAccessor() function based on Preact by
 * Jason Miller (@developit)
 * Licensed under the MIT License
 * https://github.com/developit/preact/blob/master/LICENSE
 *
 * Modified for Stencil's compiler and vdom
 */

import { BUILD } from '@build-conditionals';
import { isMemberInElement, plt } from '@platform';
import { isComplexType, toLowerCase } from '@utils';
import { VNODE_FLAGS, XLINK_NS } from '../runtime-constants';

export const setAccessor = (elm: HTMLElement, memberName: string, oldValue: any, newValue: any, isSvg: boolean, flags: number) => {
  if (oldValue === newValue) {
    return;
  }
  if (BUILD.vdomClass && memberName === 'class') {
    const classList = elm.classList;
    parseClassList(oldValue).forEach(cls => classList.remove(cls));
    parseClassList(newValue).forEach(cls => classList.add(cls));
  } else if (BUILD.vdomStyle && memberName === 'style') {
    // update style attribute, css properties and values
    if (BUILD.updatable) {
      for (const prop in oldValue) {
        if (!newValue || newValue[prop] == null) {
          if (!BUILD.hydrateServerSide && prop.includes('-')) {
            elm.style.removeProperty(prop);
          } else {
            (elm as any).style[prop] = '';
          }
        }
      }
    }

    for (const prop in newValue) {
      if (!oldValue || newValue[prop] !== oldValue[prop]) {
        if (!BUILD.hydrateServerSide && prop.includes('-')) {
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
    if (newValue) {
      newValue(elm);
    }

  } else if (BUILD.vdomListener && memberName.startsWith('on') && !isMemberInElement(elm, memberName)) {
    // Event Handlers
    // so if the member name starts with "on" and the 3rd characters is
    // a capital letter, and it's not already a member on the element,
    // then we're assuming it's an event listener

    if (isMemberInElement(elm, toLowerCase(memberName))) {
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
      plt.rel(elm, memberName, oldValue, false);
    }
    if (newValue) {
      plt.ael(elm, memberName, newValue, false);
    }

  } else {
    // Set property if it exists and it's not a SVG
    const isProp = isMemberInElement(elm, memberName);
    const isComplex = isComplexType(newValue);
    const isCustomElement = elm.tagName.includes('-');
    if ((isProp || (isComplex && newValue !== null)) && !isSvg) {
      try {
        if (isCustomElement) {
          (elm as any)[memberName] = newValue;
        } else if ((elm as any)[memberName] !== newValue || '') {
          (elm as any)[memberName] = newValue || '';
        }
      } catch (e) {}
    }

    /**
     * Need to manually update attribute if:
     * - memberName is not an attribute
     * - if we are rendering the host element in order to reflect attribute
     * - if it's a SVG, since properties might not work in <svg>
     * - if the newValue is null/undefined or 'false'.
     */
    const isXlinkNs = BUILD.svg && isSvg && (memberName !== (memberName = memberName.replace(/^xlink\:?/, ''))) ? true : false;
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

const parseClassList = (value: string | undefined | null): string[] => {
  value = value ? value.trim().replace(/\s+/g, ' ') : value;
  return (!value) ? [] : value.split(' ');
};
