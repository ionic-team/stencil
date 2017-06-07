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
import { DomApi, HostContentNodes, HostElement, PlatformApi, RendererApi, VNode, VNodeData, Key } from '../../util/interfaces';
import { vnode } from './vnode';

import { updateElement } from './modules/element-update';
import { updateEventListeners } from './modules/event-listeners';
// import { prepatch } from './modules/pre-patch';
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


export function createRenderer(plt: PlatformApi, domApi: DomApi): RendererApi {

  function enhanceElement(elm: Element, isSsrHydrated: boolean) {
    let sel = domApi.$tagName(elm);
    const children: VNode[] = [];

    if (isSsrHydrated) {
      for (var i = 0; i < elm.children.length; i++) {
        children.push(enhanceElement(elm.children[i], isSsrHydrated));
      }
    } else {
      sel += (elm.id ? '#' + elm.id : '') + (elm.className ? '.' + elm.className.split(' ').join('.') : '');
    }

    return vnode(sel, {}, children, undefined, elm);
  }


  function createElm(vnode: VNode, insertedVnodeQueue: VNodeQueue, parentElm: Node, hostContentNodes: HostContentNodes): Node {
    let i: any, data = vnode.vdata;
    let children = vnode.vchildren;
    let sel = vnode.sel;

    if (sel === '!') {
      if (isUndef(vnode.vtext)) {
        vnode.vtext = '';
      }
      vnode.elm = domApi.$createComment(vnode.vtext as string);

    } else if (hostContentNodes && sel === 'slot') {
      // special case for manually relocating host content nodes
      // there their new home in either a named slot or the default slot
      let namedSlot = (data.attrs && data.attrs.name) || (data.props && data.props.name);
      let slotNodes: Node[];

      if (namedSlot) {
        slotNodes = hostContentNodes.namedSlots && hostContentNodes.namedSlots[namedSlot];

      } else {
        slotNodes = hostContentNodes.defaultSlot;
      }

      if (slotNodes) {
        for (let nodeIndex = 0; nodeIndex < slotNodes.length; nodeIndex++) {
          // remove the host content node from it's original parent node
          plt.$tmpDisconnected = true;
          domApi.$removeChild(slotNodes[nodeIndex].parentNode, slotNodes[nodeIndex]);

          if (nodeIndex === slotNodes.length - 1) {
            // return the last node that gets appended
            // like any other Node that was created
            return slotNodes[nodeIndex];
          }

          // relocate the node to it's new home
          domApi.$appendChild(parentElm, slotNodes[nodeIndex]);
          plt.$tmpDisconnected = false;
        }
      }

    } else if (sel !== undefined) {
      // Parse selector
      const hashIdx = sel.indexOf('#');
      const dotIdx = sel.indexOf('.', hashIdx);
      const hash = hashIdx > 0 ? hashIdx : sel.length;
      const dot = dotIdx > 0 ? dotIdx : sel.length;
      const tag = hashIdx !== -1 || dotIdx !== -1 ? sel.slice(0, Math.min(hash, dot)) : sel;
      const elm = vnode.elm = isDef(data) && isDef(i = (data as VNodeData).ns) ? domApi.$createElementNS(i, tag)
                                                                               : domApi.$createElement(<any>tag);
      if (hash < dot) {
        domApi.$setAttribute(elm, 'id', sel.slice(hash + 1, dot));
      }
      if (dotIdx > 0) {
        domApi.$setAttribute(elm, 'class', sel.slice(dot + 1).replace(/\./g, ' '));
      }

      updateElement(domApi, emptyNode, vnode);
      updateEventListeners(emptyNode, vnode);

      data.ref && data.ref(elm);

      if (isArray(children)) {
        for (i = 0; i < children.length; ++i) {
          let ch = children[i];
          if (ch != null) {
            ch = <any>createElm(ch as VNode, insertedVnodeQueue, elm, hostContentNodes);
            if (ch) {
              domApi.$appendChild(elm, <any>ch);
              plt.$tmpDisconnected = false;
            }
          }
        }
      } else if (isStringOrNumber(vnode.vtext)) {
        domApi.$appendChild(elm, domApi.$createTextNode(vnode.vtext));
      }
    } else {
      vnode.elm = domApi.$createTextNode(vnode.vtext as string);
    }
    return vnode.elm;
  }

  function addVnodes(parentElm: Node,
                     before: Node | null,
                     vnodes: Array<VNode>,
                     startIdx: number,
                     endIdx: number,
                     insertedVnodeQueue: VNodeQueue,
                     hostContentNodes: HostContentNodes) {
    let vnodeChild: VNode;
    let childNode: Node;

    for (; startIdx <= endIdx; ++startIdx) {
      vnodeChild = vnodes[startIdx];

      if (vnodeChild != null) {
        childNode = createElm(vnodeChild, insertedVnodeQueue, parentElm, hostContentNodes);
        childNode && domApi.$insertBefore(parentElm, childNode, before);
      }

      plt.$tmpDisconnected = false;
    }
  }

  function removeVnodes(parentElm: Node,
                        vnodes: Array<VNode>,
                        startIdx: number,
                        endIdx: number): void {
    for (; startIdx <= endIdx; ++startIdx) {
      var ch = vnodes[startIdx];
      if (ch != null) {
        if (isDef(ch.sel)) {
          invokeDestroyHook(ch);
        }
        domApi.$removeChild(parentElm, ch.elm as Node);
      }
    }
  }

  function updateChildren(parentElm: Node,
                          oldCh: Array<VNode>,
                          newCh: Array<VNode>,
                          insertedVnodeQueue: VNodeQueue,
                          hostContentNodes: HostContentNodes) {
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
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue, hostContentNodes);
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = newCh[++newStartIdx];

      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue, hostContentNodes);
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = newCh[--newEndIdx];

      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue, hostContentNodes);
        domApi.$insertBefore(parentElm, oldStartVnode.elm as Node, domApi.$nextSibling(oldEndVnode.elm as Node));
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--newEndIdx];

      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue, hostContentNodes);
        domApi.$insertBefore(parentElm, oldEndVnode.elm as Node, oldStartVnode.elm as Node);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];

      } else {
        if (oldKeyToIdx === undefined) {
          oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
        }
        idxInOld = oldKeyToIdx[newStartVnode.vkey as string];
        if (isUndef(idxInOld)) { // New element
          domApi.$insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue, parentElm, hostContentNodes), oldStartVnode.elm as Node);
          newStartVnode = newCh[++newStartIdx];
        } else {
          elmToMove = oldCh[idxInOld];
          if (elmToMove.sel !== newStartVnode.sel) {
            domApi.$insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue, parentElm, hostContentNodes), oldStartVnode.elm as Node);
          } else {
            patchVnode(elmToMove, newStartVnode, insertedVnodeQueue, hostContentNodes);
            oldCh[idxInOld] = undefined as any;
            domApi.$insertBefore(parentElm, (elmToMove.elm as Node), oldStartVnode.elm as Node);
          }
          newStartVnode = newCh[++newStartIdx];
        }
      }
    }
    if (oldStartIdx > oldEndIdx) {
      before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].elm;
      addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx, insertedVnodeQueue, hostContentNodes);

    } else if (newStartIdx > newEndIdx) {
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
    }
  }

  function patchVnode(oldVnode: VNode, vnode: VNode, insertedVnodeQueue: VNodeQueue, hostContentNodes: HostContentNodes) {
    // if (!hostContentNodes && oldVnode.sel === 'slot') {
    //   return;
    // }

    const elm = vnode.elm = (oldVnode.elm as HostElement);

    // if (isSsrHydrated && elm) {
    //   (<Element>elm).classList.remove('ssr');
    // }

    let oldCh = oldVnode.vchildren;
    let ch = vnode.vchildren;
    if (oldVnode === vnode) return;

    // prepatch(oldVnode, vnode);

    if (vnode.vdata !== undefined) {
      updateElement(domApi, oldVnode, vnode);
      updateEventListeners(oldVnode, vnode);
    }

    if (isUndef(vnode.vtext)) {
      if (isDef(oldCh) && isDef(ch)) {
        if (oldCh !== ch) {
          updateChildren((<HTMLElement>elm).shadowRoot || elm, oldCh as Array<VNode>, ch as Array<VNode>, insertedVnodeQueue, hostContentNodes);
        }

      } else if (isDef(ch)) {
        if (isDef(oldVnode.vtext)) domApi.$setTextContent(elm, '');
        addVnodes(elm, null, ch as Array<VNode>, 0, (ch as Array<VNode>).length - 1, insertedVnodeQueue, hostContentNodes);

      } else if (isDef(oldCh)) {
        removeVnodes(elm, oldCh as Array<VNode>, 0, (oldCh as Array<VNode>).length - 1);

      } else if (isDef(oldVnode.vtext)) {
        domApi.$setTextContent(elm, '');
      }

    } else if (oldVnode.vtext !== vnode.vtext) {
      if (elm._hostContentNodes && elm._hostContentNodes.defaultSlot) {
        // this element has slotted content
        let parentElement = elm._hostContentNodes.defaultSlot[0].parentElement;
        domApi.$setTextContent(parentElement, vnode.vtext);
        elm._hostContentNodes.defaultSlot = [parentElement.childNodes[0]];

      } else {
        // normal node
        domApi.$setTextContent(elm, vnode.vtext);
      }
    }
  }

  return function patch(oldVnode: VNode | Element, vnode: VNode, hostContentNodes?: HostContentNodes, hydrating?: boolean): VNode {
    let elm: Node, parent: Node;
    const insertedVnodeQueue: VNodeQueue = [];


    if (!isVnode(oldVnode)) {
      oldVnode = enhanceElement(oldVnode, hydrating);
    }

    if (vnode.elm || sameVnode(oldVnode, vnode)) {
      patchVnode(oldVnode, vnode, insertedVnodeQueue, hostContentNodes);

    } else {
      elm = oldVnode.elm as Node;
      parent = domApi.$parentNode(elm);

      createElm(vnode, insertedVnodeQueue, parent, hostContentNodes);

      if (parent !== null) {
        domApi.$insertBefore(parent, vnode.elm as Node, domApi.$nextSibling(elm));
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
