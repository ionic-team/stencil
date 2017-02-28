import {VNode, VNodeData} from '../vnode';

function pre(vnode: VNode, newVnode: VNode): void {
  const attachData = (vnode.data as VNodeData).attachData;
  // Copy created placeholder and real element from old vnode
  (newVnode.data as VNodeData).attachData.placeholder = attachData.placeholder;
  (newVnode.data as VNodeData).attachData.real = attachData.real;
  // Mount real element in vnode so the patch process operates on it
  vnode.elm = (vnode.data as VNodeData).attachData.real;
}

function post(_: any, vnode: VNode): void {
  // Mount dummy placeholder in vnode so potential reorders use it
  vnode.elm = (vnode.data as VNodeData).attachData.placeholder;
}

function destroy(vnode: VNode): void {
  // Remove placeholder
  if (vnode.elm !== undefined) {
    (vnode.elm.parentNode as HTMLElement).removeChild(vnode.elm);
  }
  // Remove real element from where it was inserted
  vnode.elm = (vnode.data as VNodeData).attachData.real;
}

function create(_: any, vnode: VNode): void {
  const real = vnode.elm, attachData = (vnode.data as VNodeData).attachData;
  const placeholder = document.createElement('span');
  // Replace actual element with dummy placeholder
  // Snabbdom will then insert placeholder instead
  vnode.elm = placeholder;
  attachData.target.appendChild(real);
  attachData.real = real;
  attachData.placeholder = placeholder;
}

export function attachTo(target: Element, vnode: VNode): VNode {
  if (vnode.data === undefined) vnode.data = {};
  if (vnode.data.hook === undefined) vnode.data.hook = {};
  const data = vnode.data;
  const hook = vnode.data.hook;
  data.attachData = {target: target, placeholder: undefined, real: undefined};
  hook.create = create;
  hook.prepatch = pre;
  hook.postpatch = post;
  hook.destroy = destroy;
  return vnode;
};
export default attachTo;
