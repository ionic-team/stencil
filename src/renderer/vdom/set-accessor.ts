import * as d from '../../declarations';
import { elementHasProperty } from '../../core/element-has-property';
import { PROP_TYPE } from '../../util/constants';
import { toLowerCase } from '../../util/helpers';
import { updateAttribute } from './update-attribute';


export const setAccessor = (plt: d.PlatformApi, elm: HTMLElement, memberName: string, oldValue: any, newValue: any, isSvg: boolean, isHostElement: boolean) => {
  if (memberName === 'class' && !isSvg) {
    // Class
    if (_BUILD_.updatable) {
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

  } else if (memberName === 'style') {
    // update style attribute, css properties and values
    if (_BUILD_.updatable) {
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

  } else if ((memberName[0] === 'o' && memberName[1] === 'n' && /[A-Z]/.test(memberName[2])) && (!(memberName in elm))) {
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
      if (newValue !== oldValue) {
        // add listener
        plt.domApi.$addEventListener(elm, memberName, newValue);
      }

    } else if (_BUILD_.updatable) {
      // remove listener
      plt.domApi.$removeEventListener(elm, memberName);
    }

  } else if (memberName !== 'list' && memberName !== 'type' && !isSvg &&
    (memberName in elm || (['object', 'function'].indexOf(typeof newValue) !== -1) && newValue !== null)
    || (!_BUILD_.clientSide && elementHasProperty(plt, elm, memberName))) {
    // Properties
    // - list and type are attributes that get applied as values on the element
    // - all svgs get values as attributes not props
    // - check if elm contains name or if the value is array, object, or function
    const cmpMeta = plt.getComponentMeta(elm);
    if (_BUILD_.hasMembers && cmpMeta && cmpMeta.membersMeta && cmpMeta.membersMeta[memberName]) {
      // we know for a fact that this element is a known component
      // and this component has this member name as a property,
      // let's set the known @Prop on this element
      // set it directly as property on the element
      setProperty(elm, memberName, newValue);

      if (_BUILD_.reflectToAttr && isHostElement && cmpMeta.membersMeta[memberName].reflectToAttrib) {
        // we also want to set this data to the attribute
        updateAttribute(
          elm,
          cmpMeta.membersMeta[memberName].attribName,
          newValue,
          cmpMeta.membersMeta[memberName].propType === PROP_TYPE.Boolean,
        );
      }

    } else if (memberName !== 'ref') {
      // this member name is a property on this element, but it's not a component
      // this is a native property like "value" or something
      // also we can ignore the "ref" member name at this point
      setProperty(elm, memberName, newValue == null ? '' : newValue);
      if (newValue == null || newValue === false) {
        plt.domApi.$removeAttribute(elm, memberName);
      }
    }

  } else if (newValue != null && memberName !== 'key') {
    if (_BUILD_.isDev && memberName === 'htmlfor') {
      console.error(`Attribute "htmlfor" set on ${elm.tagName.toLowerCase()}, with the lower case "f" must be replaced with a "htmlFor" (capital "F")`);
    }
    // Element Attributes
    updateAttribute(elm, memberName, newValue);

  } else if (isSvg || plt.domApi.$hasAttribute(elm, memberName) && (newValue == null || newValue === false)) {
    // remove svg attribute
    plt.domApi.$removeAttribute(elm, memberName);
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
