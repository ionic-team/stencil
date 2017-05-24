import { VNode, VNodeData } from '../../util/interfaces';


export function updateProps(oldVnode: VNode, vnode: VNode): void {
  var key: string, cur: any, old: any, elm = vnode.elm,
      oldProps = (oldVnode.vdata as VNodeData).props,
      props = (vnode.vdata as VNodeData).props;

  if (!oldProps && !props || oldProps === props) return;

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
