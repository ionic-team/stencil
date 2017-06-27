import { DomApi, PlatformApi, VNode } from '../../util/interfaces';
import { isFunction, isObject } from '../../util/helpers';


const EMPTY: any = {};
let DEFAULT_OPTS: any = null;


export function updateElement(plt: PlatformApi, nodeOps: DomApi, oldVnode: VNode, newVnode: VNode): void {
  const isUpdate = (oldVnode != null);

  oldVnode = oldVnode || EMPTY;
  newVnode = newVnode || EMPTY;

  var key: string,
      cur: any,
      elm = <any>newVnode.elm,
      oldData: any,
      newData: any;

  // update attrs
  if (oldVnode.vattrs || newVnode.vattrs) {
    oldData = oldVnode.vattrs || EMPTY;
    newData = newVnode.vattrs || EMPTY;

    // update modified attributes, add new attributes
    for (key in newData) {
      cur = newData[key];

      if (oldData[key] !== cur) {
        if (BOOLEAN_ATTRS[key] === 1) {
          if (cur) {
            nodeOps.$setAttribute(elm, key, '');
          } else {
            nodeOps.$removeAttribute(elm, key);
          }

        } else {
          if (key.charCodeAt(0) !== 120 /* xChar */) {
            nodeOps.$setAttribute(elm, key, cur);

          } else if (key.charCodeAt(3) === 58 /* colonChar */) {
            // Assume xml namespace
            nodeOps.$setAttributeNS(elm, XML_NS, key, cur);

          } else if (key.charCodeAt(5) === 58 /* colonChar */) {
            // Assume xlink namespace
            nodeOps.$setAttributeNS(elm, XLINK_NS, key, cur);

          } else {
            nodeOps.$setAttribute(elm, key, cur);
          }
        }
      }
    }
    // remove removed attributes
    // use `in` operator since the previous `for` iteration uses it (.i.e. add even attributes with undefined value)
    // the other option is to remove all attributes with value == undefined
    if (isUpdate) {
      for (key in oldData) {
        if (!(key in newData)) {
          nodeOps.$removeAttribute(elm, key);
        }
      }
    }
  }


  // update class
  if (oldVnode.vclass || newVnode.vclass) {
    oldData = oldVnode.vclass || EMPTY;
    newData = newVnode.vclass || EMPTY;

    if (isUpdate) {
      for (key in oldData) {
        if (!newData[key]) {
          elm.classList.remove(key);
        }
      }
    }

    for (key in newData) {
      cur = newData[key];
      if (cur !== oldData[key]) {
        elm.classList[newData[key] ? 'add' : 'remove'](key);
      }
    }
  }


  // update props
  if (oldVnode.vprops || newVnode.vprops) {
    oldData = oldVnode.vprops || EMPTY;
    newData = newVnode.vprops || EMPTY;

    if (isUpdate) {
      for (key in oldData) {
        if (newData[key] === undefined) {
          // only delete the old property when the
          // new property is undefined, otherwise we'll
          // end up deleting getters/setters
          delete (elm as any)[key];
        }
      }
    }

    for (key in newData) {
      cur = newData[key];
      if (oldData[key] !== cur && (key !== 'value' || (elm as any)[key] !== cur)) {
        (elm as any)[key] = cur;
      }
    }
  }


  // update style
  if (oldVnode.vstyle || newVnode.vstyle) {
    oldData = oldVnode.vstyle || EMPTY;
    newData = newVnode.vstyle || EMPTY;

    if (isUpdate) {
      for (key in oldData) {
        if (!newData[key]) {
          (elm as any).style[key] = '';
        }
      }
    }

    for (key in newData) {
      cur = newData[key];
      if (cur !== oldData[key]) {
        (elm as any).style[key] = cur;
      }
    }
  }


  // update event listeners
  oldData = oldVnode.vlisteners;
  newData = newVnode.vlisteners;
  if (oldData || newData) {

    if (!DEFAULT_OPTS) {
      DEFAULT_OPTS = plt.getEventOptions();
    }

    // remove existing listeners which no longer used
    if (isUpdate && oldData && oldVnode.assignedListener) {
      // if element changed or deleted we remove all existing listeners unconditionally
      for (key in oldData) {
        // remove listener if existing listener removed
        if (!newData || !newData[key]) {
          oldVnode.elm.removeEventListener(key, oldVnode.assignedListener, DEFAULT_OPTS);
        }
      }
    }

    // add new listeners which has not already attached
    if (newData) {
      // reuse existing listener or create new
      cur = newVnode.assignedListener = oldVnode.assignedListener || createListener();

      // update vnode for listener
      cur.vnode = newVnode;

      // if element changed or added we add all needed listeners unconditionally
      for (key in newData) {
        // add listener if new listener added
        if (!oldData || !oldData[key]) {
          elm.addEventListener(key, cur, DEFAULT_OPTS);
        }
      }
    }
  }
}


function createListener() {
  return function handler(event: Event) {
    handleEvent(event, (handler as any).vnode);
  };
}


function handleEvent(event: Event, vnode: VNode) {
  var eventName = event.type,
      on = vnode.vlisteners;

  // call event handler(s) if they exists
  if (on && on[eventName]) {
    invokeHandler(on[eventName], vnode, event);
  }
}


function invokeHandler(handler: any, vnode?: VNode, event?: Event): void {
  if (isFunction(handler)) {
    // call function handler
    handler.call(vnode, event, vnode);

  } else if (isObject(handler)) {
    // call handler with arguments

    if (isFunction(handler[0])) {
      // special case for single argument for performance
      if (handler.length === 2) {
        handler[0].call(vnode, handler[1], event, vnode);

      } else {
        var args = handler.slice(1);
        args.push(event);
        args.push(vnode);
        handler[0].apply(vnode, args);
      }
    } else {

      // call multiple handlers
      for (var i = 0; i < handler.length; i++) {
        invokeHandler(handler[i]);
      }
    }
  }
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
const XML_NS = 'http://www.w3.org/XML/1998/namespace';
