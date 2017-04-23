/**
 * Virtual DOM patching algorithm based on Snabbdom by
 * Simon Friis Vindum (@paldepind)
 * Licensed under the MIT License
 * https://github.com/snabbdom/snabbdom/blob/master/LICENSE
 *
 * Modified for Ionic's Web Component Renderer
 * /


/* global module, document, Node */
import { isArray, isDef, isUndef, isString, isStringOrNumber } from '../../util/helpers';
import { PlatformApi, RendererApi, VNode, VNodeData, Key } from '../../util/interfaces';
import { vnode } from './vnode';

import { updateAttrs } from './modules/attributes';
import { updateClass } from './modules/class';
import { updateEventListeners } from './modules/eventlisteners';
import { updateProps } from './modules/props';
export { VNode, VNodeData, vnode };
export { h } from './h';

type VNodeQueue = Array<VNode>;

const emptyNode = vnode('', {}, [], undefined, undefined);

function sameVnode(vnode1: VNode, vnode2: VNode): boolean {
  return vnode1.vkey === vnode2.vkey && vnode1.sel === vnode2.sel;
}

function isVnode(vnode: any): vnode is VNode {
  return vnode.sel !== undefined || vnode.elm !== undefined;
}

type KeyToIndexMap = {[key: string]: number};

function createKeyToOldIdx(children: Array<VNode>, beginIdx: number, endIdx: number): KeyToIndexMap {
  let i: number, map: KeyToIndexMap = {}, key: Key, ch;
  for (i = beginIdx; i <= endIdx; ++i) {
    ch = children[i];
    if (ch != null) {
      key = (<VNode>ch).vkey;
      if (key !== undefined) map[key] = i;
    }
  }
  return map;
}


export function Renderer(api: PlatformApi): RendererApi {

  function emptyNodeAt(elm: Element) {
    const id = elm.id ? '#' + elm.id : '';
    const c = elm.className ? '.' + elm.className.split(' ').join('.') : '';
    return vnode(api.$tagName(elm) + id + c, {}, [], undefined, elm);
  }

  function createRmCb(childElm: Node) {
    return function rmCb() {
      const parent = api.$parentNode(childElm);
      api.$removeChild(parent, childElm);
    };
  }

  function createElm(vnode: VNode, insertedVnodeQueue: VNodeQueue): Node {
    let i: any, data = vnode.vdata;
    if (data !== undefined) {
      if (isDef(i = data.hook) && isDef(i = i.init)) {
        i(vnode);
        data = vnode.vdata;
      }
    }
    let children = vnode.vchildren, sel = vnode.sel;
    if (sel === '!') {
      if (isUndef(vnode.vtext)) {
        vnode.vtext = '';
      }
      vnode.elm = api.$createComment(vnode.vtext as string);
    } else if (sel !== undefined) {
      // Parse selector
      const hashIdx = sel.indexOf('#');
      const dotIdx = sel.indexOf('.', hashIdx);
      const hash = hashIdx > 0 ? hashIdx : sel.length;
      const dot = dotIdx > 0 ? dotIdx : sel.length;
      const tag = hashIdx !== -1 || dotIdx !== -1 ? sel.slice(0, Math.min(hash, dot)) : sel;
      const elm = vnode.elm = isDef(data) && isDef(i = (data as VNodeData).ns) ? api.$createElementNS(i, tag)
                                                                               : api.$createElement(<any>tag);
      if (hash < dot) elm.id = sel.slice(hash + 1, dot);
      if (dotIdx > 0) elm.className = sel.slice(dot + 1).replace(/\./g, ' ');

      updateAttrs(emptyNode, vnode);
      updateClass(emptyNode, vnode);
      updateEventListeners(emptyNode, vnode);
      updateProps(emptyNode, vnode);

      if (isArray(children)) {
        for (i = 0; i < children.length; ++i) {
          const ch = children[i];
          if (ch != null) {
            api.$appendChild(elm, createElm(ch as VNode, insertedVnodeQueue));
          }
        }
      } else if (isStringOrNumber(vnode.vtext)) {
        api.$appendChild(elm, api.$createTextNode(vnode.vtext));
      }
      i = (vnode.vdata as VNodeData).hook; // Reuse variable
      if (isDef(i)) {
        if (i.create) i.create(emptyNode, vnode);
        if (i.insert) insertedVnodeQueue.push(vnode);
      }
    } else {
      vnode.elm = api.$createTextNode(vnode.vtext as string);
    }
    return vnode.elm;
  }

  function addVnodes(parentElm: Node,
                     before: Node | null,
                     vnodes: Array<VNode>,
                     startIdx: number,
                     endIdx: number,
                     insertedVnodeQueue: VNodeQueue) {
    for (; startIdx <= endIdx; ++startIdx) {
      const ch = vnodes[startIdx];
      if (ch != null) {
        api.$insertBefore(parentElm, createElm(ch, insertedVnodeQueue), before);
      }
    }
  }

  function removeVnodes(parentElm: Node,
                        vnodes: Array<VNode>,
                        startIdx: number,
                        endIdx: number): void {
    for (; startIdx <= endIdx; ++startIdx) {
      let i: any, rm: () => void, ch = vnodes[startIdx];
      if (ch != null) {
        if (isDef(ch.sel)) {
          invokeDestroyHook(ch);
          rm = createRmCb(ch.elm as Node);
          if (isDef(i = ch.vdata) && isDef(i = i.hook) && isDef(i = i.remove)) {
            i(ch, rm);
          } else {
            rm();
          }
        } else { // Text node
          api.$removeChild(parentElm, ch.elm as Node);
        }
      }
    }
  }

  function updateChildren(parentElm: Node,
                          oldCh: Array<VNode>,
                          newCh: Array<VNode>,
                          insertedVnodeQueue: VNodeQueue) {
    let oldStartIdx = 0, newStartIdx = 0;
    let oldEndIdx = oldCh.length - 1;
    let oldStartVnode = oldCh[0];
    let oldEndVnode = oldCh[oldEndIdx];
    let newEndIdx = newCh.length - 1;
    let newStartVnode = newCh[0];
    let newEndVnode = newCh[newEndIdx];
    let oldKeyToIdx: any;
    let idxInOld: number;
    let elmToMove: VNode;
    let before: any;

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (oldStartVnode == null) {
        oldStartVnode = oldCh[++oldStartIdx]; // Vnode might have been moved left
      } else if (oldEndVnode == null) {
        oldEndVnode = oldCh[--oldEndIdx];
      } else if (newStartVnode == null) {
        newStartVnode = newCh[++newStartIdx];
      } else if (newEndVnode == null) {
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = newCh[++newStartIdx];
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
        api.$insertBefore(parentElm, oldStartVnode.elm as Node, api.$nextSibling(oldEndVnode.elm as Node));
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
        api.$insertBefore(parentElm, oldEndVnode.elm as Node, oldStartVnode.elm as Node);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];
      } else {
        if (oldKeyToIdx === undefined) {
          oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
        }
        idxInOld = oldKeyToIdx[newStartVnode.vkey as string];
        if (isUndef(idxInOld)) { // New element
          api.$insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm as Node);
          newStartVnode = newCh[++newStartIdx];
        } else {
          elmToMove = oldCh[idxInOld];
          if (elmToMove.sel !== newStartVnode.sel) {
            api.$insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm as Node);
          } else {
            patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
            oldCh[idxInOld] = undefined as any;
            api.$insertBefore(parentElm, (elmToMove.elm as Node), oldStartVnode.elm as Node);
          }
          newStartVnode = newCh[++newStartIdx];
        }
      }
    }
    if (oldStartIdx > oldEndIdx) {
      before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].elm;
      addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
    } else if (newStartIdx > newEndIdx) {
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
    }
  }

  function patchVnode(oldVnode: VNode, vnode: VNode, insertedVnodeQueue: VNodeQueue) {
    let i: any, hook: any;
    if (isDef(i = vnode.vdata) && isDef(hook = i.hook) && isDef(i = hook.prepatch)) {
      i(oldVnode, vnode);
    }

    const elm = vnode.elm = (oldVnode.elm as Node);
    let oldCh = oldVnode.vchildren;
    let ch = vnode.vchildren;
    if (oldVnode === vnode) return;
    if (vnode.vdata !== undefined) {
      updateAttrs(oldVnode, vnode);
      updateClass(oldVnode, vnode);
      updateEventListeners(oldVnode, vnode);
      updateProps(oldVnode, vnode);

      i = vnode.vdata.hook;
      if (isDef(i) && isDef(i = i.update)) i(oldVnode, vnode);
    }
    if (isUndef(vnode.vtext)) {
      if (isDef(oldCh) && isDef(ch)) {
        if (oldCh !== ch) {
          updateChildren((<HTMLElement>elm).shadowRoot || elm, oldCh as Array<VNode>, ch as Array<VNode>, insertedVnodeQueue);
        }

      } else if (isDef(ch)) {
        if (isDef(oldVnode.vtext)) api.$setTextContent(elm, '');
        addVnodes(elm, null, ch as Array<VNode>, 0, (ch as Array<VNode>).length - 1, insertedVnodeQueue);
      } else if (isDef(oldCh)) {
        removeVnodes(elm, oldCh as Array<VNode>, 0, (oldCh as Array<VNode>).length - 1);
      } else if (isDef(oldVnode.vtext)) {
        api.$setTextContent(elm, '');
      }
    } else if (oldVnode.vtext !== vnode.vtext) {
      api.$setTextContent(elm, vnode.vtext as string);
    }
    if (isDef(hook) && isDef(i = hook.postpatch)) {
      i(oldVnode, vnode);
    }
  }

  return function patch(oldVnode: VNode | Element, vnode: VNode): VNode {
    let elm: Node, parent: Node;
    const insertedVnodeQueue: VNodeQueue = [];

    if (!isVnode(oldVnode)) {
      oldVnode = emptyNodeAt(oldVnode);
    }

    if (vnode.elm || sameVnode(oldVnode, vnode)) {
      patchVnode(oldVnode, vnode, insertedVnodeQueue);

    } else {
      elm = oldVnode.elm as Node;
      parent = api.$parentNode(elm);

      createElm(vnode, insertedVnodeQueue);

      if (parent !== null) {
        api.$insertBefore(parent, vnode.elm as Node, api.$nextSibling(elm));
        removeVnodes(parent, [oldVnode], 0, 0);
      }
    }
    return vnode;
  };
}


export function invokeDestroyHook(vnode: VNode) {
  let i: any, j: number, data = vnode.vdata;
  if (data !== undefined) {
    updateEventListeners(vnode);
    if (vnode.vchildren !== undefined) {
      for (j = 0; j < vnode.vchildren.length; ++j) {
        i = vnode.vchildren[j];
        if (i != null && !isString(i)) {
          invokeDestroyHook(i);
        }
      }
    }
  }
}
