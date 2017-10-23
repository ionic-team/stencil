import { addEventListener } from '../instance/listeners';
import { PlatformApi, VNode } from '../../util/interfaces';


const EMPTY_OBJ: any = {};
const EMPTY_ARR: any[] = [];


export function updateElement(plt: PlatformApi, oldVnode: VNode | null, newVnode: VNode, isSvgMode: boolean, propName?: string): void {
  const elm = newVnode.elm as any;
  const oldVnodeAttrs = (oldVnode != null && oldVnode.vattrs != null) ? oldVnode.vattrs : {};
  const newVnodeAttrs = (newVnode.vattrs != null) ? newVnode.vattrs : {};

  // remove attributes no longer present on the vnode by setting them to undefined
  for (propName in oldVnodeAttrs) {
    if (!(newVnodeAttrs && newVnodeAttrs[propName] != null) && oldVnodeAttrs[propName] != null) {
      setAccessor(plt, elm, propName, oldVnodeAttrs[propName], oldVnodeAttrs[propName] = undefined, isSvgMode);
    }
  }

  // add new & update changed attributes
  for (propName in newVnodeAttrs) {
    if (!(propName in oldVnodeAttrs) || newVnodeAttrs[propName] !== (propName === 'value' || propName === 'checked' ? elm[propName] : oldVnodeAttrs[propName])) {
      setAccessor(plt, elm, propName, oldVnodeAttrs[propName], oldVnodeAttrs[propName] = newVnodeAttrs[propName], isSvgMode);
    }
  }
}


export function setAccessor(plt: PlatformApi, elm: any, name: string, oldValue: any, newValue: any, isSvg: boolean, i?: any, ilen?: number) {
  if (name === 'class' && !isSvg) {
    // Class
    if (oldValue !== newValue) {
      let oldList = (oldValue == null || oldValue === '') ? EMPTY_ARR : oldValue.trim().split(/\s+/);
      let newList = (newValue == null || newValue === '') ? EMPTY_ARR : newValue.trim().split(/\s+/);

      for (i = 0, ilen = oldList.length; i < ilen; i++) {
        if (newList.indexOf(oldList[i]) === -1) {
          elm.classList.remove(oldList[i]);
        }
      }

      for (i = 0, ilen = newList.length; i < ilen; i++) {
        if (oldList.indexOf(newList[i]) === -1) {
          elm.classList.add(newList[i]);
        }
      }
    }

  } else if (name === 'style') {
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

  } else if (name[0] === 'o' && name[1] === 'n' && (!(name in elm))) {
    // Event Handlers
    // adding an standard event listener, like <button onClick=...> or something

    name = name.toLowerCase().substring(2);
    const listeners = (elm._listeners = elm._listeners || {});

    if (newValue) {
      if (!oldValue) {
        // add listener
        listeners[name] = addEventListener(plt, elm, name, newValue);
      }

    } else if (listeners[name]) {
      // remove listener
      listeners[name]();
    }

  } else if (name !== 'list' && name !== 'type' && !isSvg &&
    (name in elm || (['object', 'function'].indexOf(typeof newValue) !== -1) && newValue !== null)) {
    // Properties
    // - list and type are attributes that get applied as values on the element
    // - all svgs get values as attributes not props
    // - check if elm contains name or if the value is array, object, or function

    const cmpMeta = plt.getComponentMeta(elm);
    if (cmpMeta && cmpMeta.membersMeta && name in cmpMeta.membersMeta) {
      // setting a known @Prop on this element
      setProperty(elm, name, newValue);

    } else {
      // property setting a prop on a native property, like "value" or something
      setProperty(elm, name, newValue == null ? '' : newValue);
      if (newValue == null || newValue === false) {
        elm.removeAttribute(name);
      }
    }

  } else if (newValue != null) {
    // Element Attributes
    i = (name !== (name = name.replace(/^xlink\:?/, '')));

    if (BOOLEAN_ATTRS[name] === 1 && (!newValue || newValue === 'false')) {
      if (i) {
        elm.removeAttributeNS(XLINK_NS, name.toLowerCase());

      } else {
        elm.removeAttribute(name);
      }

    } else if (typeof newValue !== 'function') {
      if (i) {
        elm.setAttributeNS(XLINK_NS, name.toLowerCase(), newValue);

      } else {
        elm.setAttribute(name, newValue);
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
