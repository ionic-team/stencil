import { VNode, VNodeData } from '../../../util/interfaces';


const xlinkNS = 'http://www.w3.org/1999/xlink';
const xmlNS = 'http://www.w3.org/XML/1998/namespace';


export function updateAttrs(oldVnode: VNode, vnode: VNode): void {
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
      if (typeof cur === 'boolean') {
        if (cur) {
          elm.setAttribute(key, "");
        } else {
          elm.removeAttribute(key);
        }
      } else {
        if (key.charCodeAt(0) !== 120) {
          elm.setAttribute(key, cur);
        } else if (key.charCodeAt(3) === 58) {
          // Assume xml namespace
          elm.setAttributeNS(xmlNS, key, cur);
        } else if (key.charCodeAt(5) === 58) {
          // Assume xlink namespace
          elm.setAttributeNS(xlinkNS, key, cur);
        } else {
          elm.setAttribute(key, cur);
        }
      }
    }
  }
  // remove removed attributes
  // use `in` operator since the previous `for` iteration uses it (.i.e. add even attributes with undefined value)
  // the other option is to remove all attributes with value == undefined
  for (key in oldAttrs) {
    if (!(key in attrs)) {
      elm.removeAttribute(key);
    }
  }
}
