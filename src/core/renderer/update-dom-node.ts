import { PlatformApi, VNode } from '../../util/interfaces';


const EMPTY: any = {};
let DEFAULT_OPTS: any = null;

export function updateElement(plt: PlatformApi, oldVnode: VNode | null, newVnode: VNode, isSvgMode: boolean): void {
  let name;
  const elm = newVnode.elm as any;
  const oldVnodeAttrs = (oldVnode != null && oldVnode.vattrs != null) ? oldVnode.vattrs : EMPTY;
  const newVnodeAttrs = (newVnode.vattrs != null) ? newVnode.vattrs : EMPTY;

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
    newValue = newValue || {};
    oldValue = oldValue || {};

    let newClassNameString = '';
    let oldClassNameString = '';

    for (key in oldValue) {
      if (oldValue[key]) {
        oldClassNameString += ' ' + key;
      }
    }

    for (key in newValue) {
      if (newValue[key]) {
        newClassNameString += ' ' + key;
      }
    }

    if (oldClassNameString !== newClassNameString && newClassNameString !== '') {
      elm.className = newClassNameString;
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
   */
  } else if (name !== 'list' && name !== 'type' && !isSvg && name in elm) {
    setProperty(elm, name, newValue === null ? '' : newValue);
    if (newValue === undefined) {
      delete (elm as any)[name];
    }

  // Element Attributes
  } else {
    let ns = isSvg && (name !== (name = name.replace(/^xlink\:?/, '')));

    if (newValue === null || newValue === false) {
      if (ns) {
        elm.removeAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase());

      } else {
        elm.removeAttribute(name);
      }

    } else if (typeof newValue !== 'function') {
      if (ns) {
        elm.setAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase(), newValue);

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
