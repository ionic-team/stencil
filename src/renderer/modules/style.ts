import { Module, VNode, VNodeData } from '../../utils/interfaces';


function updateStyle(oldVnode: VNode, vnode: VNode): void {
  var cur: any, name: string, elm = vnode.elm,
      oldStyle = (oldVnode.data as VNodeData).style,
      style = (vnode.data as VNodeData).style;

  if (!oldStyle && !style) return;
  if (oldStyle === style) return;
  oldStyle = oldStyle || {};
  style = style || {};

  for (name in oldStyle) {
    if (!style[name]) {
      if (name[0] === '-' && name[1] === '-') {
        (elm as any).style.removeProperty(name);
      } else {
        (elm as any).style[name] = '';
      }
    }
  }
  for (name in style) {
    cur = style[name];
    if (name !== 'remove' && cur !== oldStyle[name]) {
      if (name[0] === '-' && name[1] === '-') {
        (elm as any).style.setProperty(name, cur);
      } else {
        (elm as any).style[name] = cur;
      }
    }
  }
}

function applyDestroyStyle(vnode: VNode): void {
  var style: any, name: string, elm = vnode.elm, s = (vnode.data as VNodeData).style;
  if (!s || !(style = s.destroy)) return;
  for (name in style) {
    (elm as any).style[name] = style[name];
  }
}

function applyRemoveStyle(vnode: VNode, rm: () => void): void {
  var s = (vnode.data as VNodeData).style;
  if (!s || !s.remove) {
    rm();
    return;
  }
  var name: string, elm = vnode.elm, i = 0, compStyle: CSSStyleDeclaration,
      style = s.remove, amount = 0, applied: Array<string> = [];
  for (name in style) {
    applied.push(name);
    (elm as any).style[name] = style[name];
  }
  compStyle = getComputedStyle(elm as Element);
  var props = (compStyle as any)['transition-property'].split(', ');
  for (; i < props.length; ++i) {
    if(applied.indexOf(props[i]) !== -1) amount++;
  }
  (elm as Element).addEventListener('transitionend', function (ev: TransitionEvent) {
    if (ev.target === elm) --amount;
    if (amount === 0) rm();
  });
}

export const styleModule = {
  create: updateStyle,
  update: updateStyle,
  destroy: applyDestroyStyle,
  remove: applyRemoveStyle
} as Module;
export default styleModule;
