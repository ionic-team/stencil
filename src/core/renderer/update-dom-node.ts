import { EMPTY_ARR, EMPTY_OBJ, NODE_TYPE } from '../../util/constants';
import { PlatformApi, VNode } from '../../util/interfaces';
import { toLowerCase } from '../../util/helpers';
import { Build } from '../../util/build-conditionals';
import { elementHasProperty } from '../instance/proxy-members';


export function updateElement(plt: PlatformApi, oldVnode: VNode | null, newVnode: VNode, isSvgMode: boolean, memberName?: string): void {
  // if the element passed in is a shadow root, which is a document fragment
  // then we want to be adding attrs/props to the shadow root's "host" element
  // if it's not a shadow root, then we add attrs/props to the same element
  const elm = (newVnode.elm.nodeType === NODE_TYPE.DocumentFragment && (newVnode.elm as ShadowRoot).host) ? (newVnode.elm as ShadowRoot).host : (newVnode.elm as any);
  const oldVnodeAttrs = (oldVnode && oldVnode.vattrs) || EMPTY_OBJ;
  const newVnodeAttrs = newVnode.vattrs || EMPTY_OBJ;

  // remove attributes no longer present on the vnode by setting them to undefined
  for (memberName in oldVnodeAttrs) {
    if (!(newVnodeAttrs && newVnodeAttrs[memberName] != null) && oldVnodeAttrs[memberName] != null) {
      setAccessor(plt, elm, memberName, oldVnodeAttrs[memberName], undefined, isSvgMode);
    }
  }

  // add new & update changed attributes
  for (memberName in newVnodeAttrs) {
    if (!(memberName in oldVnodeAttrs) || newVnodeAttrs[memberName] !== (memberName === 'value' || memberName === 'checked' ? elm[memberName] : oldVnodeAttrs[memberName])) {
      setAccessor(plt, elm, memberName, oldVnodeAttrs[memberName], newVnodeAttrs[memberName], isSvgMode);
    }
  }
}


export function setAccessor(plt: PlatformApi, elm: any, memberName: string, oldValue: any, newValue: any, isSvg: boolean, i?: any, ilen?: number) {
  if (memberName === 'class' && !isSvg) {
    // Class
    if (oldValue !== newValue) {
      const oldList: string[] = (oldValue == null || oldValue === '') ? EMPTY_ARR : oldValue.trim().split(/\s+/);
      const newList: string[] = (newValue == null || newValue === '') ? EMPTY_ARR : newValue.trim().split(/\s+/);

      let classList: string[] = (elm.className == null || elm.className === '') ? EMPTY_ARR : elm.className.trim().split(/\s+/);

      for (i = 0, ilen = oldList.length; i < ilen; i++) {
        if (newList.indexOf(oldList[i]) === -1) {
          classList = classList.filter((c: string) => c !== oldList[i]);
        }
      }

      for (i = 0, ilen = newList.length; i < ilen; i++) {
        if (oldList.indexOf(newList[i]) === -1) {
          classList = [...classList, newList[i]];
        }
      }

      elm.className = classList.join(' ');
    }

  } else if (memberName === 'style') {
    // Style
    oldValue = oldValue || EMPTY_OBJ;
    newValue = newValue || EMPTY_OBJ;

    for (i in oldValue) {
      if (!newValue[i]) {
        (elm as any).style[i] = '';
      }
    }

    for (i in newValue) {
      if (newValue[i] !== oldValue[i]) {
        (elm as any).style[i] = newValue[i];
      }
    }

  } else if (memberName[0] === 'o' && memberName[1] === 'n' && (!(memberName in elm))) {
    // Event Handlers
    // adding an standard event listener, like <button onClick=...> or something
    memberName = toLowerCase(memberName.substring(2));
    if (newValue) {
      if (newValue !== oldValue) {
        // add listener
        plt.domApi.$addEventListener(elm, memberName, newValue);
      }

    } else {
      // remove listener
      plt.domApi.$removeEventListener(elm, memberName);
    }

  } else if (memberName !== 'list' && memberName !== 'type' && (Build.svg && !isSvg) &&
    (memberName in elm || (['object', 'function'].indexOf(typeof newValue) !== -1) && newValue !== null)
    || (!Build.clientSide && elementHasProperty(plt, elm, memberName))) {
    // Properties
    // - list and type are attributes that get applied as values on the element
    // - all svgs get values as attributes not props
    // - check if elm contains name or if the value is array, object, or function
    const cmpMeta = plt.getComponentMeta(elm);
    if (cmpMeta && cmpMeta.membersMeta && cmpMeta.membersMeta[memberName]) {
      // we know for a fact that this element is a known component
      // and this component has this member name as a property,
      // let's set the known @Prop on this element
      setProperty(elm, memberName, newValue);

    } else if (memberName !== 'ref') {
      // this member name is a property on this element, but it's not a component
      // this is a native property like "value" or something
      // also we can ignore the "ref" member name at this point
      setProperty(elm, memberName, newValue == null ? '' : newValue);
      if (newValue == null || newValue === false) {
        elm.removeAttribute(memberName);
      }
    }

  } else if (newValue != null) {
    // Element Attributes
    i = (memberName !== (memberName = memberName.replace(/^xlink\:?/, '')));

    if (BOOLEAN_ATTRS[memberName] === 1 && (!newValue || newValue === 'false')) {
      if (i) {
        elm.removeAttributeNS(XLINK_NS, toLowerCase(memberName));

      } else {
        elm.removeAttribute(memberName);
      }

    } else if (typeof newValue !== 'function') {
      if (i) {
        elm.setAttributeNS(XLINK_NS, toLowerCase(memberName), newValue);

      } else {
        elm.setAttribute(memberName, newValue);
      }
    }
  }
}

/**
 * Attempt to set a DOM property to the given value.
 * IE & FF throw for certain property-value combinations.
 */
function setProperty(elm: any, name: string, value: any) {
  try {
    elm[name] = value;
  } catch (e) { }
}


const BOOLEAN_ATTRS: any = {
  'allowfullscreen': 1,
  'async': 1,
  'autofocus': 1,
  'autoplay': 1,
  'checked': 1,
  'controls': 1,
  'disabled': 1,
  'enabled': 1,
  'formnovalidate': 1,
  'hidden': 1,
  'multiple': 1,
  'noresize': 1,
  'readonly': 1,
  'required': 1,
  'selected': 1,
  'spellcheck': 1,
};

const XLINK_NS = 'http://www.w3.org/1999/xlink';
