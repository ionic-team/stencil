import { PlatformApi, VNode, VNodeData } from '../../util/interfaces';


export function updateClass(plt: PlatformApi, oldVnode: VNode, vnode: VNode): void {
  // ['class'] bracket notation for closure advanced
  var cur: any, name: string, elm: Element = vnode.elm as Element,
      oldClass = (oldVnode.vdata as VNodeData)['class'],
      klass = (vnode.vdata as VNodeData)['class'];

  if (!oldClass && !klass || oldClass === klass) return;

  oldClass = oldClass || {};
  klass = klass || {};

  for (name in oldClass) {
    if (!klass[name]) {
      plt.$setClass(<HTMLElement>elm, name, false);
    }
  }
  for (name in klass) {
    cur = klass[name];
    if (cur !== oldClass[name]) {
      plt.$setClass(<HTMLElement>elm, name, klass[name]);
    }
  }
}
