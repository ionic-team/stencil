/**
 * Production setAccessor() function based on Preact by
 * Jason Miller (@developit)
 * Licensed under the MIT License
 * https://github.com/developit/preact/blob/master/LICENSE
 *
 * Modified for Stencil's compiler and vdom
 */

import { BUILD } from '@build-conditionals';
import { plt } from '@platform';
import { isComplexType } from '@utils';
import { VNODE_FLAGS, XLINK_NS } from '../runtime-constants';

export const setAccessor = (elm: HTMLElement, memberName: string, oldValue: any, newValue: any, isSvg: boolean, flags: number) => {
  if (oldValue === newValue) {
    return;
  }
  const ln = memberName.toLowerCase();
  const isProp = memberName in elm;
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

  } else if (BUILD.vdomListener && !isProp && memberName[0] === 'o' && memberName[1] === 'n') {
    // Event Handlers
    // so if the member name starts with "on" and the 3rd characters is
    // a capital letter, and it's not already a member on the element,
    // then we're assuming it's an event listener
    if (memberName[2] === '-') {
      // on- prefixed events
      // allows to be explicit about the dom event to listen without any magic
      // under the hood:
      // <my-cmp on-click> // listens for "click"
      // <my-cmp on-Click> // listens for "Click"
      // <my-cmp on-ionChange> // listens for "ionChange"
      // <my-cmp on-EVENTS> // listens for "EVENTS"
      memberName = memberName.substr(3);
    } else if (ln in elm) {
      // standard event
      // the JSX attribute could have been "onMouseOver" and the
      // member name "onmouseover" is on the element's prototype
      // so let's add the listener "mouseover", which is all lowercased
      memberName = ln.substr(2);

    } else {
      // custom event
      // the JSX attribute could have been "onMyCustomEvent"
      // so let's trim off the "on" prefix and lowercase the first character
      // and add the listener "myCustomEvent"
      // except for the first character, we keep the event name case
      memberName = ln[2] + memberName.substr(3);
    }
    if (oldValue) {
      plt.rel(elm, memberName, oldValue, false);
    }
    if (newValue) {
      plt.ael(elm, memberName, newValue, false);
    }

  } else {
    // Set property if it exists and it's not a SVG
    const isComplex = isComplexType(newValue);
    if ((isProp || (isComplex && newValue !== null)) && !isSvg) {
      try {
        if (!elm.tagName.includes('-')) {
          const n = newValue == null ? '' : newValue;

          // Workaround for Safari, moving the <input> caret when re-assigning the same valued
          if ((elm as any)[memberName] !== n) {
            (elm as any)[memberName] = n;
          }
        } else {
          (elm as any)[memberName] = newValue;
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
        elm.removeAttributeNS(XLINK_NS, ln);
      } else {
        elm.removeAttribute(memberName);
      }
    } else if ((!isProp || (flags & VNODE_FLAGS.isHost) || isSvg) && !isComplex) {
      newValue = newValue === true ? '' : newValue.toString();
      if (isXlinkNs) {
        elm.setAttributeNS(XLINK_NS, ln, newValue);
      } else {
        elm.setAttribute(memberName, newValue);
      }
    }
  }
};

const parseClassList = (value: string | undefined | null): string[] =>
  (!value) ? [] : value.split(/\s+/).filter(c => c);
