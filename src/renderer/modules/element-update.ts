import { PlatformApi, VNode, VNodeData } from '../../util/interfaces';


export function updateElement(plt: PlatformApi, oldVnode: VNode, vnode: VNode): void {

  var oldVdata: VNodeData = oldVnode.vdata;
  var vdata: VNodeData = vnode.vdata;

  var key: string,
      cur: any,
      old: any,
      elm: Element = vnode.elm as Element,
      oldAttrs = oldVdata.attrs,
      attrs = vdata.attrs,
      oldClass = oldVdata['class'],
      klass = vdata['class'],
      oldProps = oldVdata.props,
      props = vdata.props,
      oldStyle = oldVdata.style,
      style = vdata.style;


  // updateAttrs
  if ((oldAttrs || attrs) && (oldAttrs !== attrs)) {
    oldAttrs = oldAttrs || {};
    attrs = attrs || {};

    // update modified attributes, add new attributes
    for (key in attrs) {
      cur = attrs[key];
      old = oldAttrs[key];
      if (old !== cur) {
        if (BOOLEAN_ATTRS[key]) {
          if (cur) {
            plt.$setAttribute(elm, key, '');
          } else {
            plt.$removeAttribute(elm, key);
          }
        } else {
          plt.$setAttribute(elm, key, cur);
        }
      }
    }
    // remove removed attributes
    // use `in` operator since the previous `for` iteration uses it (.i.e. add even attributes with undefined value)
    // the other option is to remove all attributes with value == undefined
    for (key in oldAttrs) {
      if (!(key in attrs)) {
        plt.$removeAttribute(elm, key);
      }
    }
  }


  // updateClass
  if ((oldClass || klass) && (oldClass !== klass)) {
    // ['class'] bracket notation for closure advanced
    oldClass = oldClass || {};
    klass = klass || {};

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


  // updateProps
  if ((oldProps || props) && (oldProps !== props)) {
    oldProps = oldProps || {};
    props = props || {};

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
      old = oldProps[key];
      if (old !== cur && (key !== 'value' || (elm as any)[key] !== cur)) {
        (elm as any)[key] = cur;
      }
    }
  }


  // updateStyle
  if ((oldStyle || style) && (oldStyle !== style)) {
    oldStyle = oldStyle || {} as VNodeStyle;
    style = style || {} as VNodeStyle;

    for (key in oldStyle) {
      if (!style[key]) {
        if (key[0] === '-' && key[1] === '-') {
          (elm as any).style.removeProperty(key);
        } else {
          (elm as any).style[key] = '';
        }
      }
    }
    for (key in style) {
      cur = style[key];
      if (key !== 'remove' && cur !== oldStyle[key]) {
        if (key[0] === '-' && key[1] === '-') {
          (elm as any).style.setProperty(key, cur);
        } else {
          (elm as any).style[key] = cur;
        }
      }
    }
  }
}


export type VNodeStyle = Record<string, string> & {
  remove: Record<string, string>
};


const BOOLEAN_ATTRS: any = {
  allowfullscreen: 1,
  async: 1,
  autofocus: 1,
  autoplay: 1,
  checked: 1,
  controls: 1,
  disabled: 1,
  draggable: 1,
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
