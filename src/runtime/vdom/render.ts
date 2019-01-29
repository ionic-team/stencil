/**
 * Virtual DOM patching algorithm based on Snabbdom by
 * Simon Friis Vindum (@paldepind)
 * Licensed under the MIT License
 * https://github.com/snabbdom/snabbdom/blob/master/LICENSE
 *
 * Modified for Stencil's renderer and slot projection
 */
import * as d from '@declarations';
import { BUILD } from '@build-conditionals';
import { doc, plt } from '@platform';
import { h } from './h';
import { NODE_TYPE, isDef, toLowerCase } from '@utils';
import { updateElement } from './update-dom-node';


let useNativeShadowDom = false;
// let ssrId: number;
let scopeId: string;
let checkSlotFallbackVisibility: boolean;
let checkSlotRelocate: boolean;
let contentRef: d.RenderNode;
let hostTagName: string;
let hostElm: d.HostElement;
let isSvgMode = false;


const createElm = (oldParentVNode: d.VNode, newParentVNode: d.VNode, childIndex: number, parentElm: d.RenderNode, i?: number, elm?: d.RenderNode, childNode?: d.RenderNode, newVNode?: d.VNode, oldVNode?: d.VNode) => {
  newVNode = newParentVNode.vchildren[childIndex];

  if (BUILD.slotPolyfill && !useNativeShadowDom) {
    // remember for later we need to check to relocate nodes
    checkSlotRelocate = true;

    if (newVNode.vtag === 'slot') {
      if (scopeId) {
        // scoped css needs to add its scoped id to the parent element
        parentElm.classList.add(scopeId + '-s');
      }

      if (!newVNode.vchildren) {
        // slot element does not have fallback content
        // create an html comment we'll use to always reference
        // where actual slot content should sit next to
        newVNode.isSlotReference = true;

      } else {
        // slot element has fallback content
        // still create an element that "mocks" the slot element
        newVNode.isSlotFallback = true;
      }
    }
  }

  if (isDef(newVNode.vtext)) {
    // create text node
    newVNode.elm = doc.createTextNode(newVNode.vtext) as any;

  } else if (BUILD.slotPolyfill && newVNode.isSlotReference) {
    // create a slot reference html text node
    newVNode.elm = doc.createTextNode('') as any;

  } else {
    // create element
    elm = newVNode.elm = ((BUILD.svg && (isSvgMode || newVNode.vtag === 'svg')) ?
                      doc.createElementNS('http://www.w3.org/2000/svg', newVNode.vtag as string) :
                      doc.createElement(
                        (BUILD.slotPolyfill && newVNode.isSlotFallback) ? 'slot-fb' : newVNode.vtag as string)
                      ) as any;

    if (BUILD.svg) {
      isSvgMode = newVNode.vtag === 'svg' ? true : (newVNode.vtag === 'foreignObject' ? false : isSvgMode);
    }

    // add css classes, attrs, props, listeners, etc.
    if (BUILD.vdomAttribute) {
      updateElement(null, newVNode, isSvgMode);
    }

    if ((BUILD.slotPolyfill || BUILD.scoped) && isDef(scopeId) && elm['s-si'] !== scopeId) {
      // if there is a scopeId and this is the initial render
      // then let's add the scopeId as an attribute
      elm.classList.add((elm['s-si'] = scopeId));
    }

    // if (BUILD.prerenderServerSide && isDef(ssrId)) {
    //   // SSR ONLY: this is an SSR render and this
    //   // logic does not run on the client

    //   // give this element the SSR child id that can be read by the client
    //   elm.setAttribute(
    //     SSR_CHILD_ID,
    //     ssrId + '.' + childIndex + (hasChildNodes(newVNode.vchildren) ? '' : '.')
    //   );
    // }

    if (newVNode.vchildren) {
      for (i = 0; i < newVNode.vchildren.length; ++i) {
        // create the node
        childNode = createElm(oldParentVNode, newVNode, i, elm);

        // return node could have been null
        if (childNode) {
          // if (BUILD.prerenderServerSide && isDef(ssrId) && childNode.nodeType === NODE_TYPE.TextNode && !childNode['s-cr']) {
          //   // SSR ONLY: add the text node's start comment
          //   elm.appendChild(doc.createComment('s.' + ssrId + '.' + i));
          // }

          // append our new node
          elm.appendChild(childNode);

          // if (BUILD.prerenderServerSide && isDef(ssrId) && childNode.nodeType === NODE_TYPE.TextNode && !childNode['s-cr']) {
          //   // SSR ONLY: add the text node's end comment
          //   elm.appendChild(doc.createComment('/'));
          //   elm.appendChild(doc.createTextNode(' '));
          // }
        }
      }
    }

    if (BUILD.svg && newVNode.vtag === 'svg') {
      // Only reset the SVG context when we're exiting SVG element
      isSvgMode = false;
    }
  }

  if (BUILD.slotPolyfill) {
    newVNode.elm['s-hn'] = hostTagName;

    if (newVNode.isSlotFallback || newVNode.isSlotReference) {
      // remember the content reference comment
      newVNode.elm['s-sr'] = true;

      // remember the content reference comment
      newVNode.elm['s-cr'] = contentRef;

      // remember the slot name, or empty string for default slot
      newVNode.elm['s-sn'] = newVNode.vname || '';

      // check if we've got an old vnode for this slot
      oldVNode = oldParentVNode && oldParentVNode.vchildren && oldParentVNode.vchildren[childIndex];
      if (oldVNode && oldVNode.vtag === newVNode.vtag && oldParentVNode.elm) {
        // we've got an old slot vnode and the wrapper is being replaced
        // so let's move the old slot content back to it's original location
        putBackInOriginalLocation(oldParentVNode.elm);
      }
    }
  }

  return newVNode.elm;
};

const putBackInOriginalLocation = (parentElm: Node, recursive?: boolean, i?: number, childNode?: d.RenderNode) => {
  plt.isTmpDisconnected = true;

  const oldSlotChildNodes = parentElm.childNodes;
  for (i = oldSlotChildNodes.length - 1; i >= 0; i--) {
    childNode = oldSlotChildNodes[i] as any;
    if (childNode['s-hn'] !== hostTagName && childNode['s-ol']) {

      // this child node in the old element is from another component
      // remove this node from the old slot's parent
      childNode.remove();

      // and relocate it back to it's original location
      parentReferenceNode(childNode).insertBefore(childNode, referenceNode(childNode));

      // remove the old original location comment entirely
      // later on the patch function will know what to do
      // and move this to the correct spot in need be
      childNode['s-ol'].remove();
      childNode['s-ol'] = undefined;

      checkSlotRelocate = true;
    }

    if (recursive) {
      putBackInOriginalLocation(childNode, recursive);
    }
  }

  plt.isTmpDisconnected = false;
};

const addVnodes = (
  parentElm: d.RenderNode,
  before: d.RenderNode,
  parentVNode: d.VNode,
  vnodes: d.VNode[],
  startIdx: number,
  endIdx: number,
  containerElm?: d.RenderNode,
  childNode?: Node
) => {
  containerElm = ((BUILD.slotPolyfill && parentElm['s-cr'] && parentElm['s-cr'].parentNode) || parentElm) as any;

  if (BUILD.shadowDom && (containerElm as any).shadowRoot && toLowerCase(containerElm.nodeName) === hostTagName) {
    containerElm = (containerElm as any).shadowRoot;
  }

  for (; startIdx <= endIdx; ++startIdx) {
    if (vnodes[startIdx]) {
      childNode = (BUILD.vdomText && isDef(vnodes[startIdx].vtext)) ?
                  doc.createTextNode(vnodes[startIdx].vtext) :
                  createElm(null, parentVNode, startIdx, parentElm);

      if (childNode) {
        vnodes[startIdx].elm = childNode as any;
        containerElm.insertBefore(childNode, BUILD.slotPolyfill ? referenceNode(before) : before);
      }
    }
  }
};

const removeVnodes = (vnodes: d.VNode[], startIdx: number, endIdx: number, node?: d.RenderNode) => {
  for (; startIdx <= endIdx; ++startIdx) {
    if (isDef(vnodes[startIdx])) {

      node = vnodes[startIdx].elm;

      if (BUILD.slotPolyfill) {
        // we're removing this element
        // so it's possible we need to show slot fallback content now
        checkSlotFallbackVisibility = true;

        if (node['s-ol']) {
          // remove the original location comment
          node['s-ol'].remove();

        } else {
          // it's possible that child nodes of the node
          // that's being removed are slot nodes
          putBackInOriginalLocation(node, true);
        }
      }

      // remove the vnode's element from the dom
      node.remove();
    }
  }
};

const updateChildren = (parentElm: d.RenderNode, oldCh: d.VNode[], newVNode: d.VNode, newCh: d.VNode[], idxInOld?: number, i?: number, node?: Node, elmToMove?: d.VNode) => {
  let oldStartIdx = 0, newStartIdx = 0;
  let oldEndIdx = oldCh.length - 1;
  let oldStartVnode = oldCh[0];
  let oldEndVnode = oldCh[oldEndIdx];
  let newEndIdx = newCh.length - 1;
  let newStartVnode = newCh[0];
  let newEndVnode = newCh[newEndIdx];

  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    if (oldStartVnode == null) {
        // Vnode might have been moved left
      oldStartVnode = oldCh[++oldStartIdx];

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

    } else if (isSameVnode(oldStartVnode, newEndVnode)) {
      // Vnode moved right
      if (BUILD.slotPolyfill && (oldStartVnode.vtag === 'slot' || newEndVnode.vtag === 'slot')) {
        putBackInOriginalLocation(oldStartVnode.elm.parentNode);
      }
      patchVNode(oldStartVnode, newEndVnode);
      parentElm.insertBefore(oldStartVnode.elm, oldEndVnode.elm.nextSibling as any);
      oldStartVnode = oldCh[++oldStartIdx];
      newEndVnode = newCh[--newEndIdx];

    } else if (isSameVnode(oldEndVnode, newStartVnode)) {
      // Vnode moved left
      if (BUILD.slotPolyfill && (oldStartVnode.vtag === 'slot' || newEndVnode.vtag === 'slot')) {
        putBackInOriginalLocation(oldEndVnode.elm.parentNode);
      }
      patchVNode(oldEndVnode, newStartVnode);
      parentElm.insertBefore(oldEndVnode.elm, oldStartVnode.elm);
      oldEndVnode = oldCh[--oldEndIdx];
      newStartVnode = newCh[++newStartIdx];

    } else {
      // createKeyToOldIdx
      idxInOld = null;
      if (BUILD.vdomKey) {
        for (i = oldStartIdx; i <= oldEndIdx; ++i) {
          if (oldCh[i] && isDef(oldCh[i].vkey) && oldCh[i].vkey === newStartVnode.vkey) {
            idxInOld = i;
            break;
          }
        }
      }

      if (BUILD.vdomKey && isDef(idxInOld)) {
        elmToMove = oldCh[idxInOld];

        if (elmToMove.vtag !== newStartVnode.vtag) {
          node = createElm(oldCh && oldCh[newStartIdx], newVNode, idxInOld, parentElm);

        } else {
          patchVNode(elmToMove, newStartVnode);
          oldCh[idxInOld] = undefined;
          node = elmToMove.elm;
        }

        newStartVnode = newCh[++newStartIdx];

      } else {
        // new element
        node = createElm(oldCh && oldCh[newStartIdx], newVNode, newStartIdx, parentElm);
        newStartVnode = newCh[++newStartIdx];
      }

      if (node) {
        if (BUILD.slotPolyfill) {
          parentReferenceNode(oldStartVnode.elm).insertBefore(node, referenceNode(oldStartVnode.elm));
        } else {
          oldStartVnode.elm.parentNode.insertBefore(node, oldStartVnode.elm);
        }
      }
    }
  }

  if (oldStartIdx > oldEndIdx) {
    addVnodes(parentElm,
              (newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].elm),
              newVNode,
              newCh,
              newStartIdx,
              newEndIdx
            );

  } else if (BUILD.updatable && newStartIdx > newEndIdx) {
    removeVnodes(oldCh, oldStartIdx, oldEndIdx);
  }
};

const isSameVnode = (vnode1: d.VNode, vnode2: d.VNode) => {
  // compare if two vnode to see if they're "technically" the same
  // need to have the same element tag, and same key to be the same
  if (vnode1.vtag === vnode2.vtag) {
    if (BUILD.slotPolyfill && vnode1.vtag === 'slot') {
      return vnode1.vname === vnode2.vname;
    }
    if (BUILD.vdomKey) {
      return vnode1.vkey === vnode2.vkey;
    }
    return true;
  }
  return false;
};

const referenceNode = (node: d.RenderNode) => {
  if (node && node['s-ol']) {
    // this node was relocated to a new location in the dom
    // because of some other component's slot
    // but we still have an html comment in place of where
    // it's original location was according to it's original vdom
    return node['s-ol'];
  }
  return node;
};

const parentReferenceNode = (node: d.RenderNode) => (node['s-ol'] ? node['s-ol'] : node).parentNode;

const patchVNode = (oldVNode: d.VNode, newVNode: d.VNode, elm?: d.HostElement, oldChildren?: d.FVNode[], newChildren?: d.FVNode[], defaultHolder?: Comment) => {
  elm = newVNode.elm = oldVNode.elm;
  oldChildren = oldVNode.vchildren;
  newChildren = newVNode.vchildren;

  if (BUILD.svg) {
    // test if we're rendering an svg element, or still rendering nodes inside of one
    // only add this to the when the compiler sees we're using an svg somewhere
    isSvgMode = elm &&
                isDef(elm.parentNode) &&
                ((elm as any) as SVGElement).ownerSVGElement !== undefined;

    isSvgMode = newVNode.vtag === 'svg' ? true : (newVNode.vtag === 'foreignObject' ? false : isSvgMode);
  }

  if (!isDef(newVNode.vtext)) {
    // element node

    if (BUILD.vdomAttribute) {
      if (BUILD.slot && newVNode.vtag !== 'slot') {
        // minifier will clean this up

      } else {
        // either this is the first render of an element OR it's an update
        // AND we already know it's possible it could have changed
        // this updates the element's css classes, attrs, props, listeners, etc.
        updateElement(oldVNode, newVNode, isSvgMode);
      }
    }

    if (BUILD.updatable && isDef(oldChildren) && isDef(newChildren)) {
      // looks like there's child vnodes for both the old and new vnodes
      updateChildren(elm, oldChildren, newVNode, newChildren);

    } else if (isDef(newChildren)) {
      // no old child vnodes, but there are new child vnodes to add
      if (BUILD.updatable && BUILD.vdomText && isDef(oldVNode.vtext)) {
        // the old vnode was text, so be sure to clear it out
        elm.textContent = '';
      }
      // add the new vnode children
      addVnodes(elm, null, newVNode, newChildren, 0, newChildren.length - 1);

    } else if (BUILD.updatable && isDef(oldChildren)) {
      // no new child vnodes, but there are old child vnodes to remove
      removeVnodes(oldChildren, 0, oldChildren.length - 1);
    }

  } else if (BUILD.vdomText && BUILD.slotPolyfill && (defaultHolder = (elm['s-cr'] as any))) {
    // this element has slotted content
    defaultHolder.parentNode.textContent = newVNode.vtext;

  } else if (BUILD.vdomText && oldVNode.vtext !== newVNode.vtext) {
    // update the text content for the text only vnode
    // and also only if the text is different than before
    elm.textContent = newVNode.vtext;
  }

  if (BUILD.svg) {
    // reset svgMode when svg node is fully patched
    if (isSvgMode && 'svg' === newVNode.vtag) {
      isSvgMode = false;
    }
  }
};

const updateFallbackSlotVisibility = (
  elm: d.RenderNode,
  childNode?: d.RenderNode,
  childNodes?: d.RenderNode[],
  i?: number,
  ilen?: number,
  j?: number,
  slotNameAttr?: string,
  nodeType?: number
) => {
  childNodes = elm.childNodes as any;

  for (i = 0, ilen = childNodes.length; i < ilen; i++) {
    childNode = childNodes[i];

    if (childNode.nodeType === NODE_TYPE.ElementNode) {
      if (childNode['s-sr']) {
        // this is a slot fallback node

        // get the slot name for this slot reference node
        slotNameAttr = childNode['s-sn'];

        // by default always show a fallback slot node
        // then hide it if there are other slots in the light dom
        childNode.hidden = false;

        for (j = 0; j < ilen; j++) {
          if (childNodes[j]['s-hn'] !== childNode['s-hn']) {
            // this sibling node is from a different component
            nodeType = childNodes[j].nodeType;

            if (slotNameAttr !== '') {
              // this is a named fallback slot node
              if (nodeType === NODE_TYPE.ElementNode && slotNameAttr === childNodes[j].getAttribute('slot')) {
                childNode.hidden = true;
                break;
                }

            } else {
              // this is a default fallback slot node
              // any element or text node (with content)
              // should hide the default fallback slot node
              if (nodeType === NODE_TYPE.ElementNode || (nodeType === NODE_TYPE.TextNode && childNodes[j].textContent.trim() !== '')) {
                childNode.hidden = true;
                break;
              }
            }
          }
        }
      }

      // keep drilling down
      updateFallbackSlotVisibility(childNode);
    }
  }
};

const relocateNodes: RelocateNode[] = [];

const relocateSlotContent = (
  elm: d.RenderNode,
  childNodes?: d.RenderNode[],
  childNode?: d.RenderNode,
  node?: d.RenderNode,
  i?: number,
  ilen?: number,
  j?: number,
  hostContentNodes?: NodeList,
  slotNameAttr?: string,
  nodeType?: number
) => {
  childNodes = elm.childNodes as any;

  for (i = 0, ilen = childNodes.length; i < ilen; i++) {
    childNode = childNodes[i];

    if (childNode['s-sr'] && (node = childNode['s-cr'])) {
      // first got the content reference comment node
      // then we got it's parent, which is where all the host content is in now
      hostContentNodes = node.parentNode.childNodes;
      slotNameAttr = childNode['s-sn'];

      for (j = hostContentNodes.length - 1; j >= 0; j--) {
        node = hostContentNodes[j] as d.RenderNode;

        if (!node['s-cn'] && !node['s-nr'] && node['s-hn'] !== childNode['s-hn']) {
          // let's do some relocating to its new home
          // but never relocate a content reference node
          // that is suppose to always represent the original content location
          nodeType = node.nodeType;

          if (
            ((nodeType === NODE_TYPE.TextNode || nodeType === NODE_TYPE.CommentNode) && slotNameAttr === '') ||
            (nodeType === NODE_TYPE.ElementNode && node.getAttribute('slot') === null && slotNameAttr === '') ||
            (nodeType === NODE_TYPE.ElementNode && node.getAttribute('slot') === slotNameAttr)
          ) {
            // it's possible we've already decided to relocate this node
            if (!relocateNodes.some(r => r.nodeToRelocate === node)) {
              // made some changes to slots
              // let's make sure we also double check
              // fallbacks are correctly hidden or shown
              checkSlotFallbackVisibility = true;
              node['s-sn'] = slotNameAttr;

              // add to our list of nodes to relocate
              relocateNodes.push({
                slotRefNode: childNode,
                nodeToRelocate: node
              });
            }
          }
        }
      }
    }

    if (childNode.nodeType === NODE_TYPE.ElementNode) {
      relocateSlotContent(childNode);
    }
  }
};


export const callNodeRefs = (vNode: d.VNode, isDestroy?: boolean) => {
  if (BUILD.vdomRef && vNode) {
    vNode.vattrs && vNode.vattrs.ref && vNode.vattrs.ref(isDestroy ? null : vNode.elm);

    vNode.vchildren && vNode.vchildren.forEach(vChild => {
      callNodeRefs(vChild, isDestroy);
    });
  }
};


const hasChildNodes = (children: d.VNode[]) => {
  // SSR ONLY: check if there are any more nested child elements
  // if there aren't, this info is useful so the client runtime
  // doesn't have to climb down and check so many elements
  if (children) {
    for (var i = 0; i < children.length; i++) {
      if (children[i].vtag !== 'slot' || hasChildNodes(children[i].vchildren)) {
        return true;
      }
    }
  }
  return false;
};


interface RelocateNode {
  slotRefNode: d.RenderNode;
  nodeToRelocate: d.RenderNode;
}


export const renderVdom = (hostElement: d.HostElement, hostRef: d.HostRef, cmpMeta: d.ComponentRuntimeMeta, renderFnResults: any, hostDataFnResults?: any) => {
  if (renderFnResults) {
    const oldVNode = hostRef.vnode || {};
    const newVNode = hostRef.vnode = h(null, hostDataFnResults, renderFnResults);
    newVNode.elm = oldVNode.elm = (BUILD.shadowDom ? hostElement.shadowRoot || hostElement : hostElement) as any;

    if (BUILD.reflect) {
      // only care if we're reflecting values to the host element
      (renderFnResults as d.VNode).ishost = true;
    }

    // so it is safe to set these variables and internally
    // the same patch() call will reference the same data
    hostElm = hostElement;
    hostTagName = toLowerCase(hostElm.nodeName);

    if (BUILD.slotPolyfill) {
      contentRef = hostElm['s-cr'];
    }

    if (BUILD.slotPolyfill) {
      useNativeShadowDom = plt.supportsShadowDom && !!cmpMeta.cmpShadowDomEncapsulation;
    }

    // if (BUILD.prerenderServerSide) {
    //   if (!isShadowDom) {
    //     ssrId = ssrPatchId;
    //   } else {
    //     ssrId = null;
    //   }
    // }

    if (BUILD.slotPolyfill) {
      // get the scopeId
      scopeId = hostElm['s-sc'];

      // always reset
      checkSlotRelocate = checkSlotFallbackVisibility = false;
    }

    // synchronous patch
    patchVNode(oldVNode, newVNode);

    // if (BUILD.prerenderServerSide && isDef(ssrId)) {
    //   // SSR ONLY: we've been given an SSR id, so the host element
    //   // should be given the ssr id attribute
    //   oldVNode.elm.setAttribute(SSR_VNODE_ID, ssrId as any);
    // }

    if (BUILD.slotPolyfill) {
      if (checkSlotRelocate) {
        relocateSlotContent(newVNode.elm);

        for (let i = 0; i < relocateNodes.length; i++) {
          const relocateNode = relocateNodes[i];

          if (!relocateNode.nodeToRelocate['s-ol']) {
            // add a reference node marking this node's original location
            // keep a reference to this node for later lookups
            const orgLocationNode = doc.createTextNode('') as any;
            orgLocationNode['s-nr'] = relocateNode.nodeToRelocate;

            relocateNode.nodeToRelocate.parentNode.insertBefore(
              (relocateNode.nodeToRelocate['s-ol'] = orgLocationNode),
              relocateNode.nodeToRelocate
            );
          }
        }

        // while we're moving nodes around existing nodes, temporarily disable
        // the disconnectCallback from working
        plt.isTmpDisconnected = true;

        for (let i = 0; i < relocateNodes.length; i++) {
          const relocateNode = relocateNodes[i];

          // by default we're just going to insert it directly
          // after the slot reference node
          const parentNodeRef = relocateNode.slotRefNode.parentNode;
          let insertBeforeNode = relocateNode.slotRefNode.parentNode;

          let orgLocationNode = relocateNode.nodeToRelocate['s-ol'] as any;

          while (orgLocationNode = orgLocationNode.previousSibling as any) {
            let refNode = orgLocationNode['s-nr'];
            if (refNode && refNode) {
              if (refNode['s-sn'] === relocateNode.nodeToRelocate['s-sn']) {
                if (parentNodeRef === refNode.parentNode) {
                  if ((refNode = refNode.nextSibling as any) && refNode && !refNode['s-nr']) {
                    insertBeforeNode = refNode;
                    break;
                  }
                }
              }
            }
          }

          if (
            (!insertBeforeNode && parentNodeRef !== relocateNode.nodeToRelocate.parentNode) ||
            (relocateNode.nodeToRelocate.nextSibling !== insertBeforeNode)
          ) {
            // we've checked that it's worth while to relocate
            // since that the node to relocate
            // has a different next sibling or parent relocated

            if (relocateNode.nodeToRelocate !== insertBeforeNode) {
              // remove the node from the dom
              relocateNode.nodeToRelocate.remove();

              // add it back to the dom but in its new home
              parentNodeRef.insertBefore(relocateNode.nodeToRelocate, insertBeforeNode);
            }
          }
        }

        // done moving nodes around
        // allow the disconnect callback to work again
        plt.isTmpDisconnected = false;
      }

      if (checkSlotFallbackVisibility) {
        updateFallbackSlotVisibility(newVNode.elm);
      }

      // always reset
      relocateNodes.length = 0;
    }

    // fire off the ref if it exists
    if (BUILD.vdomRef) {
      callNodeRefs(newVNode);
    }
  }
};
