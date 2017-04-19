import { VNode, VNodeData } from '../../../util/interfaces';


export function updateProps(oldVnode: VNode, vnode: VNode): void {
  var key: string, cur: any, old: any, elm = vnode.elm,
      oldProps = (oldVnode.vdata as VNodeData).props,
      props = (vnode.vdata as VNodeData).props;

  if (!oldProps && !props) return;
  if (oldProps === props) return;
  oldProps = oldProps || {};
  props = props || {};

  for (key in oldProps) {
    if (!props[key]) {
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
