import * as d from '../../declarations';
import { BUILD } from '@build-conditionals';
import { EMPTY_OBJ } from '@utils';
import { NODE_TYPE } from '../runtime-constants';
import { setAccessor } from './set-accessor';


export const updateElement = (oldVnode: d.VNode | null, newVnode: d.VNode, isSvgMode: boolean, memberName?: string): void => {
  // if the element passed in is a shadow root, which is a document fragment
  // then we want to be adding attrs/props to the shadow root's "host" element
  // if it's not a shadow root, then we add attrs/props to the same element
  const elm = (newVnode.$elm$.nodeType === NODE_TYPE.DocumentFragment && newVnode.$elm$.host) ? newVnode.$elm$.host : (newVnode.$elm$ as any);
  const oldVnodeAttrs = (oldVnode && oldVnode.$attrs$) || EMPTY_OBJ;
  const newVnodeAttrs = newVnode.$attrs$ || EMPTY_OBJ;

  if (BUILD.updatable) {
    // remove attributes no longer present on the vnode by setting them to undefined
    for (memberName in oldVnodeAttrs) {
      if (!(memberName in newVnodeAttrs))  {
        setAccessor(elm, memberName, oldVnodeAttrs[memberName], undefined, isSvgMode, newVnode.$flags$);
      }
    }
  }

  // add new & update changed attributes
  for (memberName in newVnodeAttrs) {
    setAccessor(elm, memberName, oldVnodeAttrs[memberName], newVnodeAttrs[memberName], isSvgMode, newVnode.$flags$);
  }
};
