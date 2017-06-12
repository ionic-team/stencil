/**
 * Virtual DOM patching algorithm based on Snabbdom by
 * Simon Friis Vindum (@paldepind)
 * Licensed under the MIT License
 * https://github.com/snabbdom/snabbdom/blob/master/LICENSE
 *
 * Modified for Ionic's Web Component Renderer
 */


import { DomApi, HostContentNodes, HostElement, Key, PlatformApi, RendererApi, VNode } from '../../util/interfaces';
import { isArray, isDef, isString, isStringOrNumber, isUndef } from '../../util/helpers';
import { updateElement } from './element-update';


export function createRenderer(plt: PlatformApi, domApi: DomApi): RendererApi {

  function createElm(vnode: VNode, insertedVnodeQueue: VNodeQueue, parentElm: Node, hostContentNodes: HostContentNodes): Node {
    let i = 0;
    let childNode: Node;

    vnode = normalizeVNode(vnode);
    if (isUndef(vnode)) {
      return;
    }

    if (hostContentNodes && vnode.e === 'slot') {
      // special case for manually relocating host content nodes
      // to their new home in either a named slot or the default slot
      let namedSlot = (vnode.a && vnode.a.name);
      let slotNodes: Node[];

      if (isDef(namedSlot)) {
        slotNodes = hostContentNodes.namedSlots && hostContentNodes.namedSlots[namedSlot];

      } else {
        slotNodes = hostContentNodes.defaultSlot;
      }

      if (isDef(slotNodes)) {
        for (i = 0; i < slotNodes.length; i++) {
          // remove the host content node from it's original parent node
          plt.tmpDisconnected = true;
          domApi.$removeChild(slotNodes[i].parentNode, slotNodes[i]);

          if (i === slotNodes.length - 1) {
            // return the last node that gets appended
            // like any other Node that was created
            return slotNodes[i];
          }

          // relocate the node to it's new home
          domApi.$appendChild(parentElm, slotNodes[i]);
          plt.tmpDisconnected = false;
        }
      }

    } else if (isDef(vnode.t)) {
      // create text node
      vnode.n = domApi.$createTextNode(vnode.t);

    } else {
      // create element
      const elm = vnode.n = (vnode.m ? domApi.$createElementNS(vnode.m, vnode.e) : domApi.$createElement(vnode.e));

      updateElement(domApi, null, vnode);

      const children = vnode.h;
      if (children) {
        for (i = 0; i < children.length; ++i) {
          childNode = createElm(children[i], insertedVnodeQueue, elm, hostContentNodes);

          if (isDef(childNode)) {
            domApi.$appendChild(elm, childNode);
            plt.tmpDisconnected = false;
          }
        }
      }
    }

    return vnode.n;
  }

  function addVnodes(parentElm: Node,
                     before: Node | null,
                     vnodes: VNode[],
                     startIdx: number,
                     endIdx: number,
                     insertedVnodeQueue: VNodeQueue,
                     hostContentNodes: HostContentNodes) {
    let vnodeChild: VNode;
    let childNode: Node;


    for (; startIdx <= endIdx; ++startIdx) {
      vnodeChild = vnodes[startIdx];

      if (isDef(vnodeChild)) {
        if (isDef(vnodeChild.t)) {
          childNode = domApi.$createTextNode(vnodeChild.t);

        } else {
          childNode = createElm(vnodeChild, insertedVnodeQueue, parentElm, hostContentNodes);
        }

        if (isDef(childNode)) {
          vnodeChild.n = childNode;
          domApi.$insertBefore(parentElm, childNode, before);
        }

        plt.tmpDisconnected = false;
      }
    }
  }

  function removeVnodes(parentElm: Node,
                        vnodes: VNode[],
                        startIdx: number,
                        endIdx: number): void {

    for (; startIdx <= endIdx; ++startIdx) {
      var vnode = vnodes[startIdx];

      if (isDef(vnode)) {
        if (isDef(vnode.t)) {
          invokeDestroyHook(vnode);
        }

        domApi.$removeChild(parentElm, vnode.n);
      }
    }
  }

  function updateChildren(parentElm: Node,
                          oldCh: VNode[],
                          newCh: VNode[],
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
        domApi.$insertBefore(parentElm, oldStartVnode.n, domApi.$nextSibling(oldEndVnode.n));
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--newEndIdx];

      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue, hostContentNodes);
        domApi.$insertBefore(parentElm, oldEndVnode.n, oldStartVnode.n);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];

      } else {
        if (isUndef(oldKeyToIdx)) {
          oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
        }

        idxInOld = oldKeyToIdx[newStartVnode.k];

        if (isUndef(idxInOld)) {
          // new element
          domApi.$insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue, parentElm, hostContentNodes), oldStartVnode.n);
          newStartVnode = newCh[++newStartIdx];

        } else {
          elmToMove = oldCh[idxInOld];

          if (elmToMove.e !== newStartVnode.e) {
            domApi.$insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue, parentElm, hostContentNodes), oldStartVnode.n);

          } else {
            patchVnode(elmToMove, newStartVnode, insertedVnodeQueue, hostContentNodes);
            oldCh[idxInOld] = undefined;
            domApi.$insertBefore(parentElm, elmToMove.n, oldStartVnode.n);
          }

          newStartVnode = newCh[++newStartIdx];
        }
      }
    }

    if (oldStartIdx > oldEndIdx) {
      before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].n;
      addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx, insertedVnodeQueue, hostContentNodes);

    } else if (newStartIdx > newEndIdx) {
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
    }
  }

  function patchVnode(oldVnode: VNode, newVnode: VNode, insertedVnodeQueue: VNodeQueue, hostContentNodes: HostContentNodes) {
    newVnode = normalizeVNode(newVnode);


    if (oldVnode !== newVnode) {
      const elm: HostElement = newVnode.n = <any>oldVnode.n;

      let oldChildren = oldVnode.h;
      let newChildren = newVnode.h;

      updateElement(domApi, oldVnode, newVnode);

      if (isUndef(newVnode.t)) {

        if (isDef(oldChildren) && isDef(newChildren)) {
          if (oldChildren !== newChildren) {
            updateChildren(elm, oldChildren, newChildren, insertedVnodeQueue, hostContentNodes);
          }

        } else if (isDef(newChildren)) {
          if (isDef(oldVnode.t)) {
            domApi.$setTextContent(elm, '');
          }
          addVnodes(elm, null, newChildren, 0, newChildren.length - 1, insertedVnodeQueue, hostContentNodes);

        } else if (isDef(oldChildren)) {
          removeVnodes(elm, oldChildren, 0, oldChildren.length - 1);
        }

      } else if (elm._hostContentNodes && elm._hostContentNodes.defaultSlot) {
        // this element has slotted content
        let parentElement = elm._hostContentNodes.defaultSlot[0].parentElement;
        domApi.$setTextContent(parentElement, newVnode.t);
        elm._hostContentNodes.defaultSlot = [parentElement.childNodes[0]];

      } else {
        domApi.$setTextContent(elm, newVnode.t);
      }
    }
  }

  return function patch(oldVnode: VNode, newVnode: VNode, hostContentNodes?: HostContentNodes, isSsrHydrated?: boolean): VNode {
    isSsrHydrated;

    const tagName = domApi.$tagName(oldVnode);
    if (isDef(tagName)) {
      // we weren't passed an old vnode, but an actual Element
      // this is from the initial render
      oldVnode = {
        e: tagName.toLowerCase(),
        n: <Element>oldVnode
      };
    }

    patchVnode(oldVnode, newVnode, [], hostContentNodes);

    return newVnode;
  };
}

function normalizeVNode(vnode: VNode): VNode {
  if (isDef(vnode)) {
    // if (isUndef(vnode.e) && isUndef(vnode.t)) {
    //   return null;
    // }

    if (isStringOrNumber(vnode)) {
      return <VNode>{
        t: vnode
      };
    }

    let stack = vnode.h;

    if (isArray(stack)) {

      let children = EMPTY_CHILDREN, lastSimple, child: any, simple, i;


      while (stack.length) {
        if ((child = stack.pop()) && child.pop !== undefined) {
          for (i = child.length; i--; ) stack.push(child[i]);

        } else {

          if (typeof child === 'boolean') child = null;

          // if ((simple = typeof nodeName !== 'function')) {
          //   if (child == null) child = '';
          //   else if (typeof child === 'number') child = String(child);
          //   else if (typeof child !== 'string') simple = false;
          // }

          if (simple && lastSimple) {
            children[children.length - 1] += child;

          } else if (children === EMPTY_CHILDREN) {
            children = [child];

          } else {
            children.push(child);
          }

          lastSimple = simple;
        }
      }

      vnode.h = children;
    }

  }
  return vnode;
}

var EMPTY_CHILDREN: any[] = [];


export function invokeDestroyHook(vnode: VNode) {
  let i: any;
  let j: number;

  // TODO
  // updateEventListeners(vnode);

  if (isDef(vnode.h)) {
    for (j = 0; j < vnode.h.length; ++j) {
      i = vnode.h[j];
      if (isDef(i) && !isString(i)) {
        invokeDestroyHook(i);
      }
    }
  }
}

function sameVnode(vnode1: VNode, vnode2: VNode): boolean {
  return vnode1.k === vnode2.k && vnode1.e === vnode2.e;
}

function createKeyToOldIdx(children: VNode[], beginIdx: number, endIdx: number): KeyToIndexMap {

  let i: number, map: KeyToIndexMap = {}, key: Key, ch;
  for (i = beginIdx; i <= endIdx; ++i) {
    ch = children[i];
    if (ch != null) {
      key = ch.k;
      if (key !== undefined) {
        map.k = i;
      }
    }
  }
  return map;
}

type VNodeQueue = Array<VNode>;

type KeyToIndexMap = {[key: string]: number};
