import * as d from '@declarations';
import { BUILD } from '@build-conditionals';
import { EMPTY_OBJ, NODE_TYPE } from '@utils';
import { setAccessor } from './set-accessor';


export const updateElement = (oldVnode: d.VNode | null, newVnode: d.VNode, isSvgMode: boolean, memberName?: string): void => {
  // if the element passed in is a shadow root, which is a document fragment
  // then we want to be adding attrs/props to the shadow root's "host" element
  // if it's not a shadow root, then we add attrs/props to the same element
  const elm = (newVnode.elm.nodeType === NODE_TYPE.DocumentFragment && newVnode.elm.host) ? newVnode.elm.host : (newVnode.elm as any);
  const oldVnodeAttrs = (oldVnode && oldVnode.vattrs) || EMPTY_OBJ;
  const newVnodeAttrs = newVnode.vattrs || EMPTY_OBJ;

  if (BUILD.updatable) {
    // remove attributes no longer present on the vnode by setting them to undefined
    for (memberName in oldVnodeAttrs) {
      if (!(newVnodeAttrs && newVnodeAttrs[memberName] != null) && oldVnodeAttrs[memberName] != null) {
        setAccessor(elm, memberName, oldVnodeAttrs[memberName], undefined, isSvgMode);
      }
    }
  }

  // add new & update changed attributes
  for (memberName in newVnodeAttrs) {
    if (!(memberName in oldVnodeAttrs) || newVnodeAttrs[memberName] !== (memberName === 'value' || memberName === 'checked' ? elm[memberName] : oldVnodeAttrs[memberName])) {
      setAccessor(elm, memberName, oldVnodeAttrs[memberName], newVnodeAttrs[memberName], isSvgMode);
    }
  }
};
