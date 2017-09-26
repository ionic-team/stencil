/**
 * Virtual DOM patching algorithm based on Snabbdom by
 * Simon Friis Vindum (@paldepind)
 * Licensed under the MIT License
 * https://github.com/snabbdom/snabbdom/blob/master/LICENSE
 *
 * Modified for Stencil's renderer and slot projection
 */

import { DomApi, HostContentNodes, HostElement, Key, PlatformApi, RendererApi, VNode } from '../../util/interfaces';
import { isDef, isUndef } from '../../util/helpers';
import { SLOT_TAG, SSR_VNODE_ID, SSR_CHILD_ID } from '../../util/constants';
import { updateElement } from './update-element';


export function createRendererPatch(plt: PlatformApi, domApi: DomApi): RendererApi {
  // createRenderer() is only created once per app
  // the patch() function which createRenderer() returned is the function
  // which gets called numerous times by each component

  function createElm(vnode: VNode, parentElm: Node, childIndex: number) {
    let i = 0;

    if (vnode.vtag === SLOT_TAG) {

      if (hostContentNodes) {
        // special case for manually relocating host content nodes
        // to their new home in either a named slot or the default slot
        let namedSlot = (vnode.vattrs && vnode.vattrs.name);
        let slotNodes: Node[];

        if (isDef(namedSlot)) {
          // this vnode is a named slot
          slotNodes = hostContentNodes.namedSlots && hostContentNodes.namedSlots[namedSlot];

        } else {
          // this vnode is the default slot
          slotNodes = hostContentNodes.defaultSlot;
        }

        if (isDef(slotNodes)) {
          // the host element has some nodes that need to be moved around

          // we have a slot for the user's vnode to go into
          // while we're moving nodes around, temporarily disable
          // the disconnectCallback from working
          plt.tmpDisconnected = true;

          for (; i < slotNodes.length; i++) {
            // remove the host content node from it's original parent node
            // then relocate the host content node to its new slotted home
            domApi.$appendChild(
              parentElm,
              domApi.$removeChild(domApi.$parentNode(slotNodes[i]), slotNodes[i])
            );
          }

          // done moving nodes around
          // allow the disconnect callback to work again
          plt.tmpDisconnected = false;
        }
      }

      // this was a slot node, we do not create slot elements, our work here is done
      // no need to return any element to be added to the dom
      return null;
    }

    if (isDef(vnode.vtext)) {
      // create text node
      vnode.elm = domApi.$createTextNode(vnode.vtext);

    } else {
      // create element
      const elm = vnode.elm = (vnode.vnamespace ? domApi.$createElementNS(vnode.vnamespace, vnode.vtag) : domApi.$createElement(vnode.vtag));

      // add css classes, attrs, props, listeners, etc.
      updateElement(plt, domApi, null, vnode);

      const children = vnode.vchildren;

      if (isDef(ssrId)) {
        // SSR ONLY: this is an SSR render and this
        // logic does not run on the client

        // give this element the SSR child id that can be read by the client
        domApi.$setAttribute(
          vnode.elm,
          SSR_CHILD_ID,
          ssrId + '.' + childIndex + (hasChildNodes(children) ? '' : '.')
        );
      }

      if (children) {
        let childNode: Node;
        for (; i < children.length; ++i) {
          // create the node
          childNode = createElm(children[i], elm, i);

          // return node could have been null
          if (childNode) {
            if (isDef(ssrId) && childNode.nodeType === 3) {
              // SSR ONLY: add the text node's start comment
              domApi.$appendChild(elm, domApi.$createComment('s.' + ssrId + '.' + i));
            }

            // append our new node
            domApi.$appendChild(elm, childNode);

            if (isDef(ssrId) && childNode.nodeType === 3) {
              // SSR ONLY: add the text node's end comment
              domApi.$appendChild(elm, domApi.$createComment('/'));
              domApi.$appendChild(elm, domApi.$createTextNode(' '));
            }
          }
        }
      }
    }

    return vnode.elm;
  }

  function addVnodes(parentElm: Node, before: Node, vnodes: VNode[], startIdx: number, endIdx: number) {
    let childNode: Node;

    for (; startIdx <= endIdx; ++startIdx) {
      var vnodeChild = vnodes[startIdx];

      if (isDef(vnodeChild)) {
        if (isDef(vnodeChild.vtext)) {
          childNode = domApi.$createTextNode(vnodeChild.vtext);

        } else {
          childNode = createElm(vnodeChild, parentElm, startIdx);
        }

        if (isDef(childNode)) {
          vnodeChild.elm = childNode;
          domApi.$insertBefore(parentElm, childNode, before);
        }
      }
    }
  }

  function removeVnodes(parentElm: Node, vnodes: VNode[], startIdx: number, endIdx: number) {
    for (; startIdx <= endIdx; ++startIdx) {
      var vnode = vnodes[startIdx];

      if (isDef(vnode)) {
        if (isDef(vnode.elm)) {
          invokeDestroy(vnode);
        }

        domApi.$removeChild(parentElm, vnode.elm);
      }
    }
  }

  function updateChildren(parentElm: Node, oldCh: VNode[], newCh: VNode[]) {
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
    let node: Node;


    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (oldStartVnode == null) {
        oldStartVnode = oldCh[++oldStartIdx]; // Vnode might have been moved left

      } else if (oldEndVnode == null) {
        oldEndVnode = oldCh[--oldEndIdx];

      } else if (newStartVnode == null) {
        newStartVnode = newCh[++newStartIdx];

      } else if (newEndVnode == null) {
        newEndVnode = newCh[--newEndIdx];

      } else if (isSameVnode(oldStartVnode, newStartVnode)) {
        patchVNode(oldStartVnode, newStartVnode);
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = newCh[++newStartIdx];

      } else if (isSameVnode(oldEndVnode, newEndVnode)) {
        patchVNode(oldEndVnode, newEndVnode);
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = newCh[--newEndIdx];

      } else if (isSameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
        patchVNode(oldStartVnode, newEndVnode);
        domApi.$insertBefore(parentElm, oldStartVnode.elm, domApi.$nextSibling(oldEndVnode.elm));
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--newEndIdx];

      } else if (isSameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        patchVNode(oldEndVnode, newStartVnode);
        domApi.$insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];

      } else {
        if (isUndef(oldKeyToIdx)) {
          oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
        }

        idxInOld = oldKeyToIdx[newStartVnode.vkey];

        if (isUndef(idxInOld)) {
          // new element
          node = createElm(newStartVnode, parentElm, newStartIdx);
          newStartVnode = newCh[++newStartIdx];

        } else {
          elmToMove = oldCh[idxInOld];

          if (elmToMove.vtag !== newStartVnode.vtag) {
            node = createElm(newStartVnode, parentElm, idxInOld);

          } else {
            patchVNode(elmToMove, newStartVnode);
            oldCh[idxInOld] = undefined;
            node = elmToMove.elm;
          }

          newStartVnode = newCh[++newStartIdx];
        }

        if (node) {
          domApi.$insertBefore(parentElm, node, oldStartVnode.elm);
        }
      }
    }

    if (oldStartIdx > oldEndIdx) {
      addVnodes(parentElm,
                (newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].elm),
                newCh, newStartIdx, newEndIdx);

    } else if (newStartIdx > newEndIdx) {
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
    }
  }

  function isSameVnode(vnode1: VNode, vnode2: VNode) {
    // compare if two vnode to see if they're "technically" the same
    // need to have the same element tag, and same key to be the same
    return vnode1.vtag === vnode2.vtag && vnode1.vkey === vnode2.vkey;
  }

  function createKeyToOldIdx(children: VNode[], beginIdx: number, endIdx: number) {
    let i: number, map: {[key: string]: number} = {}, key: Key, ch;

    for (i = beginIdx; i <= endIdx; ++i) {
      ch = children[i];
      if (ch != null) {
        key = ch.vkey;
        if (key !== undefined) {
          map.k = i;
        }
      }
    }

    return map;
  }

  function patchVNode(oldVnode: VNode, newVnode: VNode) {
    const elm: HostElement = newVnode.elm = <any>oldVnode.elm;
    const oldChildren = oldVnode.vchildren;
    const newChildren = newVnode.vchildren;

    if (isUndef(newVnode.vtext)) {
      // element node

      if ((!isUpdate || !newVnode.skipDataOnUpdate) && newVnode.vtag !== SLOT_TAG) {
        // either this is the first render of an element OR it's an update
        // AND we already know it's possible it could have changed
        // this updates the element's css classes, attrs, props, listeners, etc.
        updateElement(plt, domApi, oldVnode, newVnode);
      }

      if (isDef(oldChildren) && isDef(newChildren)) {
        // looks like there's child vnodes for both the old and new vnodes

        if (!isUpdate || !newVnode.skipChildrenOnUpdate) {
          // either this is the first render of an element OR it's an update
          // AND we already know it's possible that the children could have changed
          updateChildren(elm, oldChildren, newChildren);
        }

      } else if (isDef(newChildren)) {
        // no old child vnodes, but there are new child vnodes to add
        if (isDef(oldVnode.vtext)) {
          // the old vnode was text, so be sure to clear it out
          domApi.$setTextContent(elm, '');
        }
        // add the new vnode children
        addVnodes(elm, null, newChildren, 0, newChildren.length - 1);

      } else if (isDef(oldChildren)) {
        // no new child vnodes, but there are old child vnodes to remove
        removeVnodes(elm, oldChildren, 0, oldChildren.length - 1);
      }

    } else if (elm._hostContentNodes && elm._hostContentNodes.defaultSlot) {
      // this element has slotted content
      let parentElement = elm._hostContentNodes.defaultSlot[0].parentElement;
      domApi.$setTextContent(parentElement, newVnode.vtext);
      elm._hostContentNodes.defaultSlot = [parentElement.childNodes[0]];

    } else {
      // update the text content for the text only vnode
      domApi.$setTextContent(elm, newVnode.vtext);
    }
  }

  // internal variables to be reused per patch() call
  let isUpdate: boolean, hostContentNodes: HostContentNodes, ssrId: number;


  return function patch(oldVnode: VNode, newVnode: VNode, isUpdatePatch?: boolean, hostElementContentNodes?: HostContentNodes, ssrPatchId?: number) {
    // patchVNode() is synchronous
    // so it is safe to set these variables and internally
    // the same patch() call will reference the same data
    isUpdate = isUpdatePatch;
    hostContentNodes = hostElementContentNodes;
    ssrId = ssrPatchId;

    // synchronous patch
    patchVNode(oldVnode, newVnode);

    if (isDef(ssrId)) {
      // SSR ONLY: we've been given an SSR id, so the host element
      // should be given the ssr id attribute
      domApi.$setAttribute(oldVnode.elm, SSR_VNODE_ID, ssrId);
    }

    // return our new vnode
    return newVnode;
  };
}


export function invokeDestroy(vnode: VNode) {
  if (vnode.vlisteners && vnode.assignedListener) {
    for (var key in vnode.vlisteners) {
      vnode.elm.removeEventListener(key, vnode.vlisteners, false);
    }
  }

  if (isDef(vnode.vchildren)) {
    for (var i = 0; i < vnode.vchildren.length; ++i) {
      vnode.vchildren[i] && invokeDestroy(vnode.vchildren[i]);
    }
  }
}


function hasChildNodes(children: VNode[]) {
  // SSR ONLY: check if there are any more nested child elements
  // if there aren't, this info is useful so the client runtime
  // doesn't have to climb down and check so many elements
  if (children) {
    for (var i = 0; i < children.length; i++) {
      if (children[i].vtag !== SLOT_TAG || hasChildNodes(children[i].vchildren)) {
        return true;
      }
    }
  }
  return false;
}
