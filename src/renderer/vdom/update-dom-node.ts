import * as d from '../../declarations';
import { EMPTY_OBJ, NODE_TYPE } from '../../util/constants';
import { setAccessor } from './set-accessor';


export function updateElement(plt: d.PlatformApi, oldVnode: d.VNode | null, newVnode: d.VNode, isSvgMode: boolean, memberName?: string): void {
  // if the element passed in is a shadow root, which is a document fragment
  // then we want to be adding attrs/props to the shadow root's "host" element
  // if it's not a shadow root, then we add attrs/props to the same element
  const elm = (newVnode.elm.nodeType === NODE_TYPE.DocumentFragment && (newVnode.elm as ShadowRoot).host) ? (newVnode.elm as ShadowRoot).host : (newVnode.elm as any);
  const oldVnodeAttrs = (oldVnode && oldVnode.vattrs) || EMPTY_OBJ;
  const newVnodeAttrs = newVnode.vattrs || EMPTY_OBJ;

  // remove attributes no longer present on the vnode by setting them to undefined
  for (memberName in oldVnodeAttrs) {
    if (!(newVnodeAttrs && newVnodeAttrs[memberName] != null) && oldVnodeAttrs[memberName] != null) {
      setAccessor(plt, elm, memberName, oldVnodeAttrs[memberName], undefined, isSvgMode, newVnode.ishost);
    }
  }

  // add new & update changed attributes
  for (memberName in newVnodeAttrs) {
    if (!(memberName in oldVnodeAttrs) || newVnodeAttrs[memberName] !== (memberName === 'value' || memberName === 'checked' ? elm[memberName] : oldVnodeAttrs[memberName])) {
      setAccessor(plt, elm, memberName, oldVnodeAttrs[memberName], newVnodeAttrs[memberName], isSvgMode, newVnode.ishost);
    }
  }
}
