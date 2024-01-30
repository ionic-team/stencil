import { BUILD } from '@app-data';
import { EMPTY_OBJ } from '@utils';

import type * as d from '../../declarations';
import { NODE_TYPE } from '../runtime-constants';
import { setAccessor } from './set-accessor';

export const updateElement = (
  oldVnode: d.VNode | null,
  newVnode: d.VNode,
  isSvgMode: boolean,
  memberName?: string,
): void => {
  // if the element passed in is a shadow root, which is a document fragment
  // then we want to be adding attrs/props to the shadow root's "host" element
  // if it's not a shadow root, then we add attrs/props to the same element
  const elm =
    newVnode.$elm$.nodeType === NODE_TYPE.DocumentFragment && newVnode.$elm$.host
      ? newVnode.$elm$.host
      : (newVnode.$elm$ as any);
  const oldVnodeAttrs = (oldVnode && oldVnode.$attrs$) || EMPTY_OBJ;
  const newVnodeAttrs = newVnode.$attrs$ || EMPTY_OBJ;

  if (BUILD.updatable) {
    // remove attributes no longer present on the vnode by setting them to undefined
    for (memberName of sortedAttrNames(Object.keys(oldVnodeAttrs))) {
      if (!(memberName in newVnodeAttrs)) {
        setAccessor(elm, memberName, oldVnodeAttrs[memberName], undefined, isSvgMode, newVnode.$flags$);
      }
    }
  }

  // add new & update changed attributes
  for (memberName of sortedAttrNames(Object.keys(newVnodeAttrs))) {
    setAccessor(elm, memberName, oldVnodeAttrs[memberName], newVnodeAttrs[memberName], isSvgMode, newVnode.$flags$);
  }
};

/**
 * Sort a list of attribute names to ensure that all the attribute names which
 * are _not_ `"ref"` come before `"ref"`. Preserve the order of the non-ref
 * attributes.
 *
 * **Note**: if the supplied attributes do not include `'ref'` then the same
 * (by reference) array will be returned without modification.
 *
 * @param attrNames attribute names to sort
 * @returns a list of attribute names, sorted if they include `"ref"`
 */
function sortedAttrNames(attrNames: string[]): string[] {
  return attrNames.includes('ref')
    ? // we need to sort these to ensure that `'ref'` is the last attr
      [...attrNames.filter((attr) => attr !== 'ref'), 'ref']
    : // no need to sort, return the original array
      attrNames;
}
