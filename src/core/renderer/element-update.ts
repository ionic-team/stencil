import { DomApi, VNode } from '../../util/interfaces';
import { isFunction, isObject } from '../../util/helpers';

const EMPTY: any = {};


export function updateElement(nodeOps: DomApi, oldVnode: VNode, vnode: VNode): void {
  oldVnode = oldVnode || EMPTY;
  vnode = vnode || EMPTY;

  var key: string,
      cur: any,
      elm = <any>vnode.elm,
      oldAttrs = oldVnode.vattrs,
      attrs = vnode.vattrs,
      oldClass = oldVnode.vclass,
      klass = vnode.vclass,
      oldProps = oldVnode.vprops,
      props = vnode.vprops,
      oldStyle = oldVnode.vstyle,
      style = vnode.vstyle,
      oldOn: any = oldVnode.vlisteners,
      on = vnode.vlisteners,
      oldListener: any = oldVnode.assignedListeners,
      oldElm = oldVnode.elm;


  // update attrs
  if ((oldAttrs || attrs) && (oldAttrs !== attrs)) {
    oldAttrs = oldAttrs || EMPTY;
    attrs = attrs || EMPTY;

    // update modified attributes, add new attributes
    for (key in attrs) {
      cur = attrs[key];

      if (oldAttrs[key] !== cur) {
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
    for (key in oldAttrs) {
      if (!(key in attrs)) {
        nodeOps.$removeAttribute(elm, key);
      }
    }
  }


  // update class
  if ((oldClass || klass) && (oldClass !== klass)) {
    oldClass = oldClass || EMPTY;
    klass = klass || EMPTY;

    for (key in oldClass) {
      if (!klass[key]) {
        elm.classList.remove(key);
      }
    }
    for (key in klass) {
      cur = klass[key];
      if (cur !== oldClass[key]) {
        elm.classList[klass[key] ? 'add' : 'remove'](key);
      }
    }
  }


  // update props
  if ((oldProps || props) && (oldProps !== props)) {
    oldProps = oldProps || EMPTY;
    props = props || EMPTY;

    for (key in oldProps) {
      if (props[key] === undefined) {
        // only delete the old property when the
        // new property is undefined, otherwise we'll
        // end up deleting getters/setters
        delete (elm as any)[key];
      }
    }

    for (key in props) {
      cur = props[key];
      if (oldProps[key] !== cur && (key !== 'value' || (elm as any)[key] !== cur)) {
        (elm as any)[key] = cur;
      }
    }
  }


  // update style
  if ((oldStyle || style) && (oldStyle !== style)) {
    oldStyle = oldStyle || EMPTY;
    style = style || EMPTY;

    for (key in oldStyle) {
      if (!style[key]) {
        (elm as any).style[key] = '';
      }
    }

    for (key in style) {
      cur = style[key];
      if (cur !== oldStyle[key]) {
        (elm as any).style[key] = cur;
      }
    }
  }


  // update event listeners
  if (oldOn !== on) {
    // remove existing listeners which no longer used
    if (oldOn && oldListener) {
      // if element changed or deleted we remove all existing listeners unconditionally
      if (!on) {
        for (key in oldOn) {
          // remove listener if element was changed or existing listeners removed
          oldElm.removeEventListener(key, oldListener, false);
        }

      } else {
        for (key in oldOn) {
          // remove listener if existing listener removed
          if (!on[key]) {
            oldElm.removeEventListener(key, oldListener, false);
          }
        }
      }
    }

    // add new listeners which has not already attached
    if (on) {
      // reuse existing listener or create new
      var listener = vnode.assignedListeners = oldVnode.assignedListeners || createListener();

      // update vnode for listener
      listener.vnode = vnode;

      // if element changed or added we add all needed listeners unconditionally
      if (!oldOn) {
        for (key in on) {
          // add listener if element was changed or new listeners added
          elm.addEventListener(key, listener, false);
        }

      } else {
        for (key in on) {
          // add listener if new listener added
          if (!oldOn[key]) {
            elm.addEventListener(key, listener, false);
          }
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
  allowfullscreen: 1,
  async: 1,
  autofocus: 1,
  autoplay: 1,
  checked: 1,
  controls: 1,
  disabled: 1,
  enabled: 1,
  formnovalidate: 1,
  hidden: 1,
  multiple: 1,
  noresize: 1,
  readonly: 1,
  required: 1,
  selected: 1,
  spellcheck: 1,
};


const XLINK_NS = 'http://www.w3.org/1999/xlink';
const XML_NS = 'http://www.w3.org/XML/1998/namespace';
