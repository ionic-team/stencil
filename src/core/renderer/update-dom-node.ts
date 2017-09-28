import { PlatformApi, VNode } from '../../util/interfaces';


const EMPTY: any = { vattrs: {} };
let DEFAULT_OPTS: any = null;

export function updateElement(plt: PlatformApi, oldVnode: VNode | null, newVnode: VNode, isSvgMode: boolean): void {
  let name;
  let elm = newVnode.elm as any;
  oldVnode = oldVnode || EMPTY;

  // remove attributes no longer present on the vnode by setting them to undefined
  for (name in oldVnode.vattrs) {
    if (!(newVnode.vattrs && newVnode.vattrs[name] !== null) && oldVnode.vattrs[name] !== null) {
      setAccessor(plt, elm, name, oldVnode.vattrs[name], oldVnode.vattrs[name] = undefined, isSvgMode);
    }
  }

  // add new & update changed attributes
  for (name in newVnode.vattrs) {
    if (!(name in oldVnode.vattrs) || newVnode.vattrs[name] !== (name === 'value' || name === 'checked' ? elm[name] : oldVnode.vattrs[name])) {
      setAccessor(plt, elm, name, oldVnode.vattrs[name], oldVnode.vattrs[name] = newVnode.vattrs[name], isSvgMode);
    }
  }
}


function setAccessor(plt: PlatformApi, elm: any, name: string, oldValue: any, newValue: any, isSvg: boolean) {
  let key;

  // Class
  if (name === 'class' && !isSvg) {
    for (key in oldValue) {
      if (!newValue[key]) {
        elm.classList.remove(key);
      }
    }

    for (key in newValue) {
      if (newValue[key] !== oldValue[key]) {
        elm.classList[newValue[key] ? 'add' : 'remove'](key);
      }
    }

  // Style
  } else if (name === 'style') {
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
