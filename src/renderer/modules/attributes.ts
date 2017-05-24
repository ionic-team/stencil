import { PlatformApi, VNode, VNodeData } from '../../util/interfaces';


const booleanAttrs: any = {
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


export function updateAttrs(plt: PlatformApi, oldVnode: VNode, vnode: VNode): void {
  var key: string, cur: any, old: any, elm: Element = vnode.elm as Element,
      oldAttrs = (oldVnode.vdata as VNodeData).attrs,
      attrs = (vnode.vdata as VNodeData).attrs;

  if (!oldAttrs && !attrs) return;
  if (oldAttrs === attrs) return;
  oldAttrs = oldAttrs || {};
  attrs = attrs || {};

  // update modified attributes, add new attributes
  for (key in attrs) {
    cur = attrs[key];
    old = oldAttrs[key];
    if (old !== cur) {
      if (booleanAttrs[key]) {
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
