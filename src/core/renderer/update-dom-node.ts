import { PlatformApi, VNode } from '../../util/interfaces';


let DEFAULT_OPTS: any = null;

export function updateElement(plt: PlatformApi, oldVnode: VNode | null, newVnode: VNode, isSvgMode: boolean): void {
  let name;
  const elm = newVnode.elm as any;
  const oldVnodeAttrs = (oldVnode != null && oldVnode.vattrs != null) ? oldVnode.vattrs : {};
  const newVnodeAttrs = (newVnode.vattrs != null) ? newVnode.vattrs : {};

  // remove attributes no longer present on the vnode by setting them to undefined
  for (name in oldVnodeAttrs) {
    if (!(newVnodeAttrs && newVnodeAttrs[name] != null) && oldVnodeAttrs[name] != null) {
      setAccessor(plt, elm, name, oldVnodeAttrs[name], oldVnodeAttrs[name] = undefined, isSvgMode);
    }
  }

  // add new & update changed attributes
  for (name in newVnodeAttrs) {
    if (!(name in oldVnodeAttrs) || newVnodeAttrs[name] !== (name === 'value' || name === 'checked' ? elm[name] : oldVnodeAttrs[name])) {
      setAccessor(plt, elm, name, oldVnodeAttrs[name], oldVnodeAttrs[name] = newVnodeAttrs[name], isSvgMode);
    }
  }
}


function setAccessor(plt: PlatformApi, elm: any, name: string, oldValue: any, newValue: any, isSvg: boolean) {
  let key;

  // Class
  if (name === 'class' && !isSvg) {
    if (oldValue !== newValue) {
      let oldList = (oldValue == null || oldValue === '') ? [] : oldValue.trim().split(/\s+/);
      let newList = (newValue == null || newValue === '') ? [] : newValue.trim().split(/\s+/);
      let i, listLength;

      for (i = 0, listLength = oldList.length; i < listLength; i += 1) {
        if (newList.indexOf(oldList[i]) === -1) {
          elm.classList.remove(oldList[i]);
        }
      }
      for (i = 0, listLength = newList.length; i < listLength; i += 1) {
        if (oldList.indexOf(newList[i]) === -1) {
          elm.classList.add(newList[i]);
        }
      }
    }

  // Style
  } else if (name === 'style') {
    oldValue = oldValue || {};
    newValue = newValue || {};

    for (key in oldValue) {
      if (!newValue[key]) {
        (elm as any).style[key] = '';
      }
    }

    for (key in newValue) {
      if (newValue[key] !== oldValue[key]) {
        (elm as any).style[key] = newValue[key];
      }
    }

  // Event Handlers
  } else if (name[0] === 'o' && name[1] === 'n') {

    if (!DEFAULT_OPTS) {
      DEFAULT_OPTS = plt.getEventOptions();
    }
    name = name.toLowerCase().substring(2);

    if (newValue) {
      if (!oldValue) {
        elm.addEventListener(name, eventProxy, DEFAULT_OPTS);
      }

    } else {
      elm.removeEventListener(name, eventProxy, DEFAULT_OPTS);
    }

    (elm._listeners || (elm._listeners = {}))[name] = newValue;

  /**
   * Properties
   * - list and type are attributes that get applied as values on the element
   * - all svgs get values as attributes not props
   * - check if elm contains name or if the value is array, object, or function
   */
  } else if (name !== 'list' && name !== 'type' && !isSvg &&
      (name in elm || ['object', 'function'].indexOf(typeof newValue) !== -1)) {
    setProperty(elm, name, newValue === null ? '' : newValue);
    if (newValue === undefined) {
      delete (elm as any)[name];
    }

  // Element Attributes
  } else {
    let ns = (name !== (name = name.replace(/^xlink\:?/, '')));

    if (BOOLEAN_ATTRS[name] === 1 && (!newValue || newValue === 'false')) {
      if (ns) {
        elm.removeAttributeNS(XLINK_NS, name.toLowerCase());

      } else {
        elm.removeAttribute(name);
      }

    } else if (typeof newValue !== 'function') {
      if (ns) {
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


/**
 * Proxy an event to hooked event handlers
 */
export function eventProxy(this: any, e: Event) {
  return (this as any)._listeners[e.type](e);
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
