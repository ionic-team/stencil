/**
 * Virtual DOM patching algorithm based on Snabbdom by
 * Simon Friis Vindum (@paldepind)
 * Licensed under the MIT License
 * https://github.com/snabbdom/snabbdom/blob/master/LICENSE
 *
 * Modified for Stencil's renderer and slot projection
 */
import type * as d from '../../declarations';
import { BUILD } from '@app-data';
import { CMP_FLAGS, HTML_NS, SVG_NS, isDef } from '@utils';
import { consoleDevError, doc, plt, supportsShadow } from '@platform';
import { h, isHost, newVNode } from './h';
import { NODE_TYPE, PLATFORM_FLAGS, VNODE_FLAGS } from '../runtime-constants';
import { updateElement } from './update-element';
import { updateFallbackSlotVisibility } from './render-slot-fallback';

let scopeId: string;
let contentRef: d.RenderNode;
let hostTagName: string;
let useNativeShadowDom = false;
let checkSlotFallbackVisibility = false;
let checkSlotRelocate = false;
let isSvgMode = false;

/**
 * Create a DOM Node corresponding to one of the children of a given VNode.
 *
 * @param oldParentVNode the parent VNode from the previous render
 * @param newParentVNode the parent VNode from the current render
 * @param childIndex the index of the VNode, in the _new_ parent node's
 * children, for which we will create a new DOM node
 * @param parentElm the parent DOM node which our new node will be a child of
 * @returns the newly created node
 */
const createElm = (oldParentVNode: d.VNode, newParentVNode: d.VNode, childIndex: number, parentElm: d.RenderNode) => {
  // tslint:disable-next-line: prefer-const
  const newVNode = newParentVNode.$children$[childIndex];
  let i = 0;
  let elm: d.RenderNode;
  let childNode: d.RenderNode;
  let oldVNode: d.VNode;

  if (BUILD.slotRelocation && !useNativeShadowDom) {
    // remember for later we need to check to relocate nodes
    checkSlotRelocate = true;

    if (newVNode.$tag$ === 'slot') {
      if (scopeId) {
        // scoped css needs to add its scoped id to the parent element
        parentElm.classList.add(scopeId + '-s');
      }

      newVNode.$flags$ |= newVNode.$children$
        ? // slot element has fallback content
          // still create an element that "mocks" the slot element
          VNODE_FLAGS.isSlotFallback
        : // slot element does not have fallback content
          // create an html comment we'll use to always reference
          // where actual slot content should sit next to
          VNODE_FLAGS.isSlotReference;
    }
  }

  if (BUILD.isDev && newVNode.$elm$) {
    consoleDevError(
      `The JSX ${
        newVNode.$text$ !== null ? `"${newVNode.$text$}" text` : `"${newVNode.$tag$}" element`
      } node should not be shared within the same renderer. The renderer caches element lookups in order to improve performance. However, a side effect from this is that the exact same JSX node should not be reused. For more information please see https://stenciljs.com/docs/templating-jsx#avoid-shared-jsx-nodes`
    );
  }

  if (BUILD.vdomText && newVNode.$text$ !== null) {
    // create text node
    elm = newVNode.$elm$ = doc.createTextNode(newVNode.$text$) as any;
  } else if (BUILD.slotRelocation && newVNode.$flags$ & (VNODE_FLAGS.isSlotReference | VNODE_FLAGS.isSlotFallback)) {
    // create a slot reference node
    elm = newVNode.$elm$ =
      BUILD.isDebug || BUILD.hydrateServerSide ? slotReferenceDebugNode(newVNode) : (doc.createTextNode('') as any);
  } else {
    if (BUILD.svg && !isSvgMode) {
      isSvgMode = newVNode.$tag$ === 'svg';
    }
    // create element
    elm = newVNode.$elm$ = (
      BUILD.svg
        ? doc.createElementNS(isSvgMode ? SVG_NS : HTML_NS, newVNode.$tag$ as string)
        : doc.createElement(newVNode.$tag$ as string)
    ) as any;

    if (BUILD.svg && isSvgMode && newVNode.$tag$ === 'foreignObject') {
      isSvgMode = false;
    }
    // add css classes, attrs, props, listeners, etc.
    if (BUILD.vdomAttribute) {
      updateElement(null, newVNode, isSvgMode);
    }

    if ((BUILD.shadowDom || BUILD.scoped) && isDef(scopeId) && elm['s-si'] !== scopeId) {
      // if there is a scopeId and this is the initial render
      // then let's add the scopeId as a css class
      elm.classList.add((elm['s-si'] = scopeId));
    }

    if (newVNode.$children$) {
      for (i = 0; i < newVNode.$children$.length; ++i) {
        // create the node
        childNode = createElm(oldParentVNode, newVNode, i, elm);

        // return node could have been null
        if (childNode) {
          // append our new node
          elm.__appendChild ? elm.__appendChild(childNode) : elm.appendChild(childNode);
        }
      }
    }

    if (BUILD.svg) {
      if (newVNode.$tag$ === 'svg') {
        // Only reset the SVG context when we're exiting <svg> element
        isSvgMode = false;
      } else if (elm.tagName === 'foreignObject') {
        // Reenter SVG context when we're exiting <foreignObject> element
        isSvgMode = true;
      }
    }
  }

  if (BUILD.slotRelocation) {
    elm['s-hn'] = hostTagName;

    if (newVNode.$flags$ & (VNODE_FLAGS.isSlotFallback | VNODE_FLAGS.isSlotReference)) {
      // this is a slot reference node
      elm['s-sr'] = true;

      // remember the content reference comment
      elm['s-cr'] = contentRef;

      // remember the slot name, or empty string for default slot
      elm['s-sn'] = newVNode.$name$ || '';

      if (newParentVNode.$name$) elm['s-psn'] = newParentVNode.$name$;

      if (newVNode.$flags$ & VNODE_FLAGS.isSlotFallback) {
        if (newVNode.$children$) {
          for (i = 0; i < newVNode.$children$.length; ++i) {
            // create the node
            let containerElm = elm.nodeType === 1 ? elm : parentElm;
            while (containerElm.nodeType !== 1) {
              containerElm = containerElm.parentNode as d.RenderNode;
            }
            childNode = createElm(oldParentVNode, newVNode, i, containerElm);
            childNode['s-sf'] = elm['s-hsf'] = true;
            if (typeof childNode['s-sn'] === 'undefined') childNode['s-sn'] = newVNode.$name$ || '';
            if (childNode.nodeType === NODE_TYPE.TextNode) {
              childNode['s-sfc'] = childNode.textContent;
            }

            // return node could have been null
            if (childNode) {
              // append our new node
              containerElm.__appendChild ? containerElm.__appendChild(childNode) : containerElm.appendChild(childNode);
            }
          }
        }
      }

      // check if we've got an old vnode for this slot
      oldVNode = oldParentVNode && oldParentVNode.$children$ && oldParentVNode.$children$[childIndex];
      if (oldVNode && oldVNode.$tag$ === newVNode.$tag$ && oldParentVNode.$elm$) {
        // we've got an old slot vnode and the wrapper is being replaced
        // so let's move the old slot content back to it's original location
        putBackInOriginalLocation(oldParentVNode.$elm$, false);
      }
    }
  }

  return elm;
};

const putBackInOriginalLocation = (parentElm: Node, recursive: boolean) => {
  plt.$flags$ |= PLATFORM_FLAGS.isTmpDisconnected;

  const oldSlotChildNodes = (parentElm as d.RenderNode).__childNodes || parentElm.childNodes;
  for (let i = oldSlotChildNodes.length - 1; i >= 0; i--) {
    const childNode = oldSlotChildNodes[i] as any;
    if (childNode['s-hn'] !== hostTagName && childNode['s-ol']) {
      // // this child node in the old element is from another component
      // // remove this node from the old slot's parent
      // childNode.remove();

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

  plt.$flags$ &= ~PLATFORM_FLAGS.isTmpDisconnected;
};

const addVnodes = (
  parentElm: d.RenderNode,
  before: d.RenderNode,
  parentVNode: d.VNode,
  vnodes: d.VNode[],
  startIdx: number,
  endIdx: number
) => {
  let containerElm = ((BUILD.slotRelocation && parentElm['s-cr'] && parentElm['s-cr'].parentNode) || parentElm) as any;
  let childNode: Node;
  if (BUILD.shadowDom && (containerElm as any).shadowRoot && containerElm.tagName === hostTagName) {
    containerElm = (containerElm as any).shadowRoot;
  }

  for (; startIdx <= endIdx; ++startIdx) {
    if (vnodes[startIdx]) {
      childNode = createElm(null, parentVNode, startIdx, parentElm);
      if (childNode) {
        vnodes[startIdx].$elm$ = childNode as any;
        containerElm.insertBefore(childNode, BUILD.slotRelocation ? referenceNode(before) : before);
      }
    }
  }
};

const saveSlottedNodes = (elm: d.RenderNode) => {
  // by removing the hostname reference
  // any current slotted elements will be 'reset' and re-slotted
  const childNodes = (elm as d.RenderNode).__childNodes || elm.childNodes;
  let childNode: d.RenderNode;
  let i: number;
  let ilen: number;

  for (i = 0, ilen = childNodes.length; i < ilen; i++) {
    childNode = childNodes[i] as d.RenderNode;
    if (childNode['s-ol']) {
      if (childNode['s-hn']) childNode['s-hn'] = undefined;
    } else {
      saveSlottedNodes(childNode);
    }
  }
};

const removeVnodes = (vnodes: d.VNode[], startIdx: number, endIdx: number, vnode?: d.VNode, elm?: d.RenderNode) => {
  for (; startIdx <= endIdx; ++startIdx) {
    if ((vnode = vnodes[startIdx])) {
      elm = vnode.$elm$;
      callNodeRefs(vnode);

      if (BUILD.slotRelocation) {
        // we're removing this element
        // so it's possible we need to show slot fallback content now
        checkSlotFallbackVisibility = true;
        saveSlottedNodes(elm);

        if (elm['s-ol']) {
          // remove the original location comment
          elm['s-ol'].remove();
        } else {
          // it's possible that child nodes of the node
          // that's being removed are slot nodes
          putBackInOriginalLocation(elm, true);
        }
      }

      // remove the vnode's element from the dom
      elm.remove();
    }
  }
};

/**
 * Reconcile the children of a new VNode with the children of an old VNode by
 * traversing the two collections of children, identifying nodes that are
 * conserved or changed, calling out to `patch` to make any necessary
 * updates to the DOM, and rearranging DOM nodes as needed.
 *
 * The algorithm for reconciling children works by analyzing two 'windows' onto
 * the two arrays of children (`oldCh` and `newCh`). We keep track of the
 * 'windows' by storing start and end indices and references to the
 * corresponding array entries. Initially the two 'windows' are basically equal
 * to the entire array, but we progressively narrow the windows until there are
 * no children left to update by doing the following:
 *
 * 1. Skip any `null` entries at the beginning or end of the two arrays, so
 *    that if we have an initial array like the following we'll end up dealing
 *    only with a window bounded by the highlighted elements:
 *
 *    [null, null, VNode1 , ... , VNode2, null, null]
 *                 ^^^^^^         ^^^^^^
 *
 * 2. Check to see if the elements at the head and tail positions are equal
 *    across the windows. This will basically detect elements which haven't
 *    been added, removed, or changed position, i.e. if you had the following
 *    VNode elements (represented as HTML):
 *
 *    oldVNode: `<div><p><span>HEY</span></p></div>`
 *    newVNode: `<div><p><span>THERE</span></p></div>`
 *
 *    Then when comparing the children of the `<div>` tag we check the equality
 *    of the VNodes corresponding to the `<p>` tags and, since they are the
 *    same tag in the same position, we'd be able to avoid completely
 *    re-rendering the subtree under them with a new DOM element and would just
 *    call out to `patch` to handle reconciling their children and so on.
 *
 * 3. Check, for both windows, to see if the element at the beginning of the
 *    window corresponds to the element at the end of the other window. This is
 *    a heuristic which will let us identify _some_ situations in which
 *    elements have changed position, for instance it _should_ detect that the
 *    children nodes themselves have not changed but merely moved in the
 *    following example:
 *
 *    oldVNode: `<div><element-one /><element-two /></div>`
 *    newVNode: `<div><element-two /><element-one /></div>`
 *
 *    If we find cases like this then we also need to move the concrete DOM
 *    elements corresponding to the moved children to write the re-order to the
 *    DOM.
 *
 * 4. Finally, if VNodes have the `key` attribute set on them we check for any
 *    nodes in the old children which have the same key as the first element in
 *    our window on the new children. If we find such a node we handle calling
 *    out to `patch`, moving relevant DOM nodes, and so on, in accordance with
 *    what we find.
 *
 * Finally, once we've narrowed our 'windows' to the point that either of them
 * collapse (i.e. they have length 0) we then handle any remaining VNode
 * insertion or deletion that needs to happen to get a DOM state that correctly
 * reflects the new child VNodes. If, for instance, after our window on the old
 * children has collapsed we still have more nodes on the new children that
 * we haven't dealt with yet then we need to add them, or if the new children
 * collapse but we still have unhandled _old_ children then we need to make
 * sure the corresponding DOM nodes are removed.
 *
 * @param parentElm the node into which the parent VNode is rendered
 * @param oldCh the old children of the parent node
 * @param newVNode the new VNode which will replace the parent
 * @param newCh the new children of the parent node
 */
const updateChildren = (parentElm: d.RenderNode, oldCh: d.VNode[], newVNode: d.VNode, newCh: d.VNode[]) => {
  const fbSlots: d.RenderNode[] = [];
  const fbNodes: { [name: string]: d.RenderNode[] } = {};
  let oldStartIdx = 0;
  let newStartIdx = 0;
  let idxInOld = 0;
  let i = 0;
  let j = 0;
  let oldEndIdx = oldCh.length - 1;
  let oldStartVnode = oldCh[0];
  let oldEndVnode = oldCh[oldEndIdx];
  let newEndIdx = newCh.length - 1;
  let newStartVnode = newCh[0];
  let newEndVnode = newCh[newEndIdx];
  let node: Node;
  let elmToMove: d.VNode;
  let fbParentNodes: NodeList;
  let fbParentNodesIdx: number;
  let fbSlotsIdx: number;
  let fbNodesIdx: number;
  let fbChildNode: d.RenderNode;
  let fbSlot: d.RenderNode;
  let fbNode: d.RenderNode;

  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    if (oldStartVnode == null) {
      // VNode might have been moved left
      oldStartVnode = oldCh[++oldStartIdx];
    } else if (oldEndVnode == null) {
      oldEndVnode = oldCh[--oldEndIdx];
    } else if (newStartVnode == null) {
      newStartVnode = newCh[++newStartIdx];
    } else if (newEndVnode == null) {
      newEndVnode = newCh[--newEndIdx];
    } else if (isSameVnode(oldStartVnode, newStartVnode)) {
      // if the start nodes are the same then we should patch the new VNode
      // onto the old one, and increment our `newStartIdx` and `oldStartIdx`
      // indices to reflect that. We don't need to move any DOM Nodes around
      // since things are matched up in order.
      patch(oldStartVnode, newStartVnode);
      oldStartVnode = oldCh[++oldStartIdx];
      newStartVnode = newCh[++newStartIdx];
    } else if (isSameVnode(oldEndVnode, newEndVnode)) {
      // likewise, if the end nodes are the same we patch new onto old and
      // decrement our end indices, and also likewise in this case we don't
      // need to move any DOM Nodes.
      patch(oldEndVnode, newEndVnode);
      oldEndVnode = oldCh[--oldEndIdx];
      newEndVnode = newCh[--newEndIdx];
    } else if (isSameVnode(oldStartVnode, newEndVnode)) {
      // case: "Vnode moved right"
      //
      // We've found that the last node in our window on the new children is
      // the same VNode as the _first_ node in our window on the old children
      // we're dealing with now. Visually, this is the layout of these two
      // nodes:
      //
      // newCh: [..., newStartVnode , ... , newEndVnode , ...]
      //                                    ^^^^^^^^^^^
      // oldCh: [..., oldStartVnode , ... , oldEndVnode , ...]
      //              ^^^^^^^^^^^^^
      //
      // In this situation we need to patch `newEndVnode` onto `oldStartVnode`
      // and move the DOM element for `oldStartVnode`.
      if (BUILD.slotRelocation && (oldStartVnode.$tag$ === 'slot' || newEndVnode.$tag$ === 'slot')) {
        putBackInOriginalLocation(oldStartVnode.$elm$.parentNode, false);
      }
      patch(oldStartVnode, newEndVnode);
      // We need to move the element for `oldStartVnode` into a position which
      // will be appropriate for `newEndVnode`. For this we can use
      // `.insertBefore` and `oldEndVnode.$elm$.nextSibling`. If there is a
      // sibling for `oldEndVnode.$elm$` then we want to move the DOM node for
      // `oldStartVnode` between `oldEndVnode` and it's sibling, like so:
      //
      // <old-start-node />
      // <some-intervening-node />
      // <old-end-node />
      // <!-- ->              <-- `oldStartVnode.$elm$` should be inserted here
      // <next-sibling />
      //
      // If instead `oldEndVnode.$elm$` has no sibling then we just want to put
      // the node for `oldStartVnode` at the end of the children of
      // `parentElm`. Luckily, `Node.nextSibling` will return `null` if there
      // aren't any siblings, and passing `null` to `Node.insertBefore` will
      // append it to the children of the parent element.
      parentElm.insertBefore(oldStartVnode.$elm$, oldEndVnode.$elm$.nextSibling as any);
      oldStartVnode = oldCh[++oldStartIdx];
      newEndVnode = newCh[--newEndIdx];
    } else if (isSameVnode(oldEndVnode, newStartVnode)) {
      // case: "Vnode moved left"
      //
      // We've found that the first node in our window on the new children is
      // the same VNode as the _last_ node in our window on the old children.
      // Visually, this is the layout of these two nodes:
      //
      // newCh: [..., newStartVnode , ... , newEndVnode , ...]
      //              ^^^^^^^^^^^^^
      // oldCh: [..., oldStartVnode , ... , oldEndVnode , ...]
      //                                    ^^^^^^^^^^^
      //
      // In this situation we need to patch `newStartVnode` onto `oldEndVnode`
      // (which will handle updating any changed attributes, reconciling their
      // children etc) but we also need to move the DOM node to which
      // `oldEndVnode` corresponds.
      if (BUILD.slotRelocation && (oldStartVnode.$tag$ === 'slot' || newEndVnode.$tag$ === 'slot')) {
        putBackInOriginalLocation(oldEndVnode.$elm$.parentNode, false);
      }
      patch(oldEndVnode, newStartVnode);
      // We've already checked above if `oldStartVnode` and `newStartVnode` are
      // the same node, so since we're here we know that they are not. Thus we
      // can move the element for `oldEndVnode` _before_ the element for
      // `oldStartVnode`, leaving `oldStartVnode` to be reconciled in the
      // future.
      parentElm.insertBefore(oldEndVnode.$elm$, oldStartVnode.$elm$);
      oldEndVnode = oldCh[--oldEndIdx];
      newStartVnode = newCh[++newStartIdx];
    } else {
      // Here we do some checks to match up old and new nodes based on the
      // `$key$` attribute, which is set by putting a `key="my-key"` attribute
      // in the JSX for a DOM element in the implementation of a Stencil
      // component.
      //
      // First we check to see if there are any nodes in the array of old
      // children which have the same key as the first node in the new
      // children.
      idxInOld = -1;
      if (BUILD.vdomKey) {
        for (i = oldStartIdx; i <= oldEndIdx; ++i) {
          if (oldCh[i] && oldCh[i].$key$ !== null && oldCh[i].$key$ === newStartVnode.$key$) {
            idxInOld = i;
            break;
          }
        }
      }

      if (BUILD.vdomKey && idxInOld >= 0) {
        // We found a node in the old children which matches up with the first
        // node in the new children! So let's deal with that
        elmToMove = oldCh[idxInOld];

        if (elmToMove.$tag$ !== newStartVnode.$tag$) {
          // the tag doesn't match so we'll need a new DOM element
          node = createElm(oldCh && oldCh[newStartIdx], newVNode, idxInOld, parentElm);
        } else {
          patch(elmToMove, newStartVnode);
          // invalidate the matching old node so that we won't try to update it
          // again later on
          oldCh[idxInOld] = undefined;
          node = elmToMove.$elm$;
        }

        newStartVnode = newCh[++newStartIdx];
      } else {
        // We either didn't find an element in the old children that matches
        // the key of the first new child OR the build is not using `key`
        // attributes at all. In either case we need to create a new element
        // for the new node.
        node = createElm(oldCh && oldCh[newStartIdx], newVNode, newStartIdx, parentElm);
        newStartVnode = newCh[++newStartIdx];
      }

      if (node) {
        // if we created a new node then handle inserting it to the DOM
        if (BUILD.slotRelocation) {
          parentReferenceNode(oldStartVnode.$elm$).insertBefore(node, referenceNode(oldStartVnode.$elm$));
        } else {
          oldStartVnode.$elm$.parentNode.insertBefore(node, oldStartVnode.$elm$);
        }
      }
    }
  }

  if (oldStartIdx > oldEndIdx) {
    // we have some more new nodes to add which don't match up with old nodes
    addVnodes(
      parentElm,
      newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].$elm$,
      newVNode,
      newCh,
      newStartIdx,
      newEndIdx
    );
  } else if (BUILD.updatable && newStartIdx > newEndIdx) {
    // there are nodes in the `oldCh` array which no longer correspond to nodes
    // in the new array, so lets remove them (which entails cleaning up the
    // relevant DOM nodes)
    removeVnodes(oldCh, oldStartIdx, oldEndIdx);
  }

  // reorder fallback slot nodes
  if (parentElm.parentNode && newVNode.$elm$['s-hsf']) {
    fbParentNodes = (parentElm.parentNode as d.RenderNode).__childNodes || parentElm.parentNode.childNodes;
    fbParentNodesIdx = fbParentNodes.length - 1;

    for (i = 0; i <= fbParentNodesIdx; ++i) {
      fbChildNode = fbParentNodes[i] as d.RenderNode;
      if (fbChildNode['s-hsf']) {
        fbSlots.push(fbChildNode);
        continue;
      }
      if (fbChildNode['s-sf']) {
        if (!fbNodes[fbChildNode['s-sn']]) fbNodes[fbChildNode['s-sn']] = [];
        fbNodes[fbChildNode['s-sn']].push(fbChildNode);
      }
    }

    fbSlotsIdx = fbSlots.length - 1;
    for (i = 0; i <= fbSlotsIdx; ++i) {
      fbSlot = fbSlots[i];
      if (!fbNodes[fbSlot['s-sn']]) continue;

      fbNodesIdx = fbNodes[fbSlot['s-sn']].length - 1;
      for (j = 0; j <= fbNodesIdx; ++j) {
        fbNode = fbNodes[fbSlot['s-sn']][j];
        fbSlot.parentNode.insertBefore(fbNode, fbSlot);
      }
    }
    checkSlotFallbackVisibility = true;
  }
};

/**
 * Compare two VNodes to determine if they are the same
 *
 * **NB**: This function is an equality _heuristic_ based on the available
 * information set on the two VNodes and can be misleading under certain
 * circumstances. In particular, if the two nodes do not have `key` attrs
 * (available under `$key$` on VNodes) then the function falls back on merely
 * checking that they have the same tag.
 *
 * So, in other words, if `key` attrs are not set on VNodes which may be
 * changing order within a `children` array or something along those lines then
 * we could obtain a false positive and then have to do needless re-rendering.
 *
 * @param leftVNode the first VNode to check
 * @param rightVNode the second VNode to check
 * @returns whether they're equal or not
 */
export const isSameVnode = (leftVNode: d.VNode, rightVNode: d.VNode) => {
  // compare if two vnode to see if they're "technically" the same
  // need to have the same element tag, and same key to be the same
  if (leftVNode.$tag$ === rightVNode.$tag$) {
    if (BUILD.slotRelocation && leftVNode.$tag$ === 'slot') {
      return leftVNode.$name$ === rightVNode.$name$;
    }
    // this will be set if components in the build have `key` attrs set on them
    if (BUILD.vdomKey) {
      return leftVNode.$key$ === rightVNode.$key$;
    }
    return true;
  }
  return false;
};

const referenceNode = (node: d.RenderNode) => {
  // this node was relocated to a new location in the dom
  // because of some other component's slot
  // but we still have an html comment in place of where
  // it's original location was according to it's original vdom
  return (node && node['s-ol']) || node;
};

const parentReferenceNode = (node: d.RenderNode) => (node['s-ol'] ? node['s-ol'] : node).parentNode;

/**
 * Handle reconciling an outdated VNode with a new one which corresponds to
 * it. This function handles flushing updates to the DOM and reconciling the
 * children of the two nodes (if any).
 *
 * @param oldVNode an old VNode whose DOM element and children we want to update
 * @param newVNode a new VNode representing an updated version of the old one
 */
export const patch = (oldVNode: d.VNode, newVNode: d.VNode) => {
  const elm: d.RenderNode = (newVNode.$elm$ = oldVNode.$elm$);
  const oldChildren = oldVNode.$children$;
  const newChildren = newVNode.$children$;
  const tag = newVNode.$tag$;
  const text = newVNode.$text$;
  let defaultHolder: Comment;

  if (!BUILD.vdomText || text === null) {
    if (BUILD.svg) {
      // test if we're rendering an svg element, or still rendering nodes inside of one
      // only add this to the when the compiler sees we're using an svg somewhere
      isSvgMode = tag === 'svg' ? true : tag === 'foreignObject' ? false : isSvgMode;
    }

    if (BUILD.vdomAttribute || BUILD.reflect) {
      if (BUILD.slot && tag === 'slot') {
        // minifier will clean this up
      } else {
        // either this is the first render of an element OR it's an update
        // AND we already know it's possible it could have changed
        // this updates the element's css classes, attrs, props, listeners, etc.
        updateElement(oldVNode, newVNode, isSvgMode);
      }
    }

    if (BUILD.updatable && oldChildren !== null && newChildren !== null) {
      // looks like there's child vnodes for both the old and new vnodes
      // so we need to call `updateChildren` to reconcile them
      updateChildren(elm, oldChildren, newVNode, newChildren);
    } else if (newChildren !== null) {
      // no old child vnodes, but there are new child vnodes to add
      if (BUILD.updatable && BUILD.vdomText && oldVNode.$text$ !== null) {
        // the old vnode was text, so be sure to clear it out
        elm.textContent = '';
      }
      // add the new vnode children
      addVnodes(elm, null, newVNode, newChildren, 0, newChildren.length - 1);
    } else if (BUILD.updatable && oldChildren !== null) {
      // no new child vnodes, but there are old child vnodes to remove
      removeVnodes(oldChildren, 0, oldChildren.length - 1);
    }

    if (BUILD.svg && isSvgMode && tag === 'svg') {
      isSvgMode = false;
    }
  } else if (BUILD.vdomText && BUILD.slotRelocation && (defaultHolder = elm['s-cr'] as any)) {
    // this element has slotted content
    defaultHolder.parentNode.textContent = text;
  } else if (BUILD.vdomText && oldVNode.$text$ !== text) {
    // update the text content for the text only vnode
    // and also only if the text is different than before
    elm.textContent = text;

    if (elm['s-sf']) {
      elm['s-sfc'] = text;
    }
  }
};

const relocateNodes: RelocateNodeData[] = [];

const relocateSlotContent = (elm: d.RenderNode) => {
  // tslint:disable-next-line: prefer-const
  let childNode: d.RenderNode;
  let node: d.RenderNode;
  let hostContentNodes: NodeList;
  let slotNameAttr: string;
  let relocateNodeData: RelocateNodeData;
  let j;
  let i = 0;
  const childNodes: d.RenderNode[] = (elm.__childNodes || elm.childNodes) as any;
  const ilen = childNodes.length;

  for (; i < ilen; i++) {
    childNode = childNodes[i];

    if (childNode['s-sr'] && (node = childNode['s-cr']) && node.parentNode) {
      if (childNode['s-hsf']) {
        checkSlotFallbackVisibility = true;
      }
      // first got the content reference comment node
      // then we got it's parent, which is where all the host content is in now
      hostContentNodes = (node.parentNode as d.RenderNode).__childNodes || node.parentNode.childNodes;
      slotNameAttr = childNode['s-sn'];

      for (j = hostContentNodes.length - 1; j >= 0; j--) {
        node = hostContentNodes[j] as d.RenderNode;

        if (!node['s-cn'] && !node['s-nr'] && node['s-hn'] !== childNode['s-hn']) {
          // let's do some relocating to its new home
          // but never relocate a content reference node
          // that is suppose to always represent the original content location

          if (isNodeLocatedInSlot(node, slotNameAttr)) {
            // it's possible we've already decided to relocate this node
            relocateNodeData = relocateNodes.find((r) => r.$nodeToRelocate$ === node);

            // made some changes to slots
            // let's make sure we also double check
            // fallbacks are correctly hidden or shown
            checkSlotFallbackVisibility = true;
            node['s-sn'] = node['s-sn'] || slotNameAttr;

            if (relocateNodeData) {
              // previously we never found a slot home for this node
              // but turns out we did, so let's remember it now
              relocateNodeData.$slotRefNode$ = childNode;
            } else {
              // add to our list of nodes to relocate
              relocateNodes.push({
                $slotRefNode$: childNode,
                $nodeToRelocate$: node,
              });
            }

            if (node['s-sr']) {
              relocateNodes.map((relocateNode) => {
                if (isNodeLocatedInSlot(relocateNode.$nodeToRelocate$, node['s-sn'])) {
                  relocateNodeData = relocateNodes.find((r) => r.$nodeToRelocate$ === node);
                  if (relocateNodeData && !relocateNode.$slotRefNode$) {
                    relocateNode.$slotRefNode$ = relocateNodeData.$slotRefNode$;
                  }
                }
              });
            }
          } else if (!relocateNodes.some((r) => r.$nodeToRelocate$ === node)) {
            // so far this element does not have a slot home, not setting slotRefNode on purpose
            // if we never find a home for this element then we'll need to hide it
            relocateNodes.push({
              $nodeToRelocate$: node,
            });
          }
        }
      }
    }

    if (childNode.nodeType === NODE_TYPE.ElementNode) {
      relocateSlotContent(childNode);
    }
  }
};

const isNodeLocatedInSlot = (nodeToRelocate: d.RenderNode, slotNameAttr: string) => {
  if (nodeToRelocate.nodeType === NODE_TYPE.ElementNode) {
    if (nodeToRelocate.getAttribute('slot') === null && slotNameAttr === '') {
      return true;
    }
    if (nodeToRelocate.getAttribute('slot') === slotNameAttr) {
      return true;
    }
    return false;
  }
  if (nodeToRelocate['s-sn'] === slotNameAttr) {
    return true;
  }
  return slotNameAttr === '';
};

export const callNodeRefs = (vNode: d.VNode) => {
  if (BUILD.vdomRef) {
    vNode.$attrs$ && vNode.$attrs$.ref && vNode.$attrs$.ref(null);
    vNode.$children$ && vNode.$children$.map(callNodeRefs);
  }
};

interface RelocateNodeData {
  $slotRefNode$?: d.RenderNode;
  $nodeToRelocate$: d.RenderNode;
}

export const renderVdom = (hostRef: d.HostRef, renderFnResults: d.VNode | d.VNode[]) => {
  const hostElm = hostRef.$hostElement$;
  const cmpMeta = hostRef.$cmpMeta$;
  const oldVNode: d.VNode = hostRef.$vnode$ || newVNode(null, null);
  const rootVnode = isHost(renderFnResults) ? renderFnResults : h(null, null, renderFnResults as any);

  hostTagName = hostElm.tagName;

  // <Host> runtime check
  if (BUILD.isDev && Array.isArray(renderFnResults) && renderFnResults.some(isHost)) {
    throw new Error(`The <Host> must be the single root component.
Looks like the render() function of "${hostTagName.toLowerCase()}" is returning an array that contains the <Host>.

The render() function should look like this instead:

render() {
  // Do not return an array
  return (
    <Host>{content}</Host>
  );
}
  `);
  }
  if (BUILD.reflect && cmpMeta.$attrsToReflect$) {
    rootVnode.$attrs$ = rootVnode.$attrs$ || {};
    cmpMeta.$attrsToReflect$.map(
      ([propName, attribute]) => (rootVnode.$attrs$[attribute] = (hostElm as any)[propName])
    );
  }

  rootVnode.$tag$ = null;
  rootVnode.$flags$ |= VNODE_FLAGS.isHost;
  hostRef.$vnode$ = rootVnode;
  rootVnode.$elm$ = oldVNode.$elm$ = (BUILD.shadowDom ? hostElm.shadowRoot || hostElm : hostElm) as any;

  if (BUILD.scoped || BUILD.shadowDom) {
    scopeId = hostElm['s-sc'];
  }
  if (BUILD.slotRelocation) {
    contentRef = hostElm['s-cr'];
    useNativeShadowDom = supportsShadow && (cmpMeta.$flags$ & CMP_FLAGS.shadowDomEncapsulation) !== 0;

    // always reset
    checkSlotFallbackVisibility = false;
  }

  // synchronous patch
  patch(oldVNode, rootVnode);

  if (BUILD.slotRelocation) {
    // while we're moving nodes around existing nodes, temporarily disable
    // the disconnectCallback from working
    plt.$flags$ |= PLATFORM_FLAGS.isTmpDisconnected;

    if (checkSlotRelocate) {
      relocateSlotContent(rootVnode.$elm$);

      let relocateData: RelocateNodeData;
      let nodeToRelocate: d.RenderNode;
      let orgLocationNode: d.RenderNode;
      let parentNodeRef: Node;
      let insertBeforeNode: Node;
      let refNode: d.RenderNode;
      let ogInsertBeforeNode: Node;
      let i = 0;

      for (; i < relocateNodes.length; i++) {
        relocateData = relocateNodes[i];
        nodeToRelocate = relocateData.$nodeToRelocate$;

        if (!nodeToRelocate['s-ol']) {
          // add a reference node marking this node's original location
          // keep a reference to this node for later lookups
          orgLocationNode =
            BUILD.isDebug || BUILD.hydrateServerSide
              ? originalLocationDebugNode(nodeToRelocate)
              : (doc.createTextNode('') as any);
          orgLocationNode['s-nr'] = nodeToRelocate;

          nodeToRelocate.parentNode.insertBefore((nodeToRelocate['s-ol'] = orgLocationNode), nodeToRelocate);
        }
      }

      for (i = 0; i < relocateNodes.length; i++) {
        relocateData = relocateNodes[i];
        nodeToRelocate = relocateData.$nodeToRelocate$;

        if (relocateData.$slotRefNode$) {
          // by default we're just going to insert it directly
          // after the slot reference node
          parentNodeRef = relocateData.$slotRefNode$.parentNode;
          insertBeforeNode = relocateData.$slotRefNode$.nextSibling;
          orgLocationNode = nodeToRelocate['s-ol'] as any;
          ogInsertBeforeNode = insertBeforeNode;

          while ((orgLocationNode = orgLocationNode.previousSibling as any)) {
            refNode = orgLocationNode['s-nr'];
            if (refNode && refNode['s-sn'] === nodeToRelocate['s-sn'] && parentNodeRef === refNode.parentNode) {
              refNode = refNode.nextSibling as any;
              if (!refNode || !refNode['s-nr']) {
                insertBeforeNode = refNode;
                break;
              }
            }
          }

          if (
            (!insertBeforeNode && parentNodeRef !== nodeToRelocate.parentNode) ||
            nodeToRelocate.nextSibling !== insertBeforeNode
          ) {
            // we've checked that it's worth while to relocate
            // since that the node to relocate
            // has a different next sibling or parent relocated

            if (nodeToRelocate !== insertBeforeNode) {
              if (!nodeToRelocate['s-hn'] && nodeToRelocate['s-ol']) {
                // probably a component in the index.html that doesn't have it's hostname set
                nodeToRelocate['s-hn'] = nodeToRelocate['s-ol'].parentNode.nodeName;
              }
              // add it back to the dom but in its new home
              parentNodeRef.insertBefore(nodeToRelocate, insertBeforeNode);
              // the node may have been hidden from when it didn't have a home. Re-show.
              nodeToRelocate.hidden = false;
            } else {
              parentNodeRef.insertBefore(nodeToRelocate, ogInsertBeforeNode);
            }
          }
        } else {
          // this node doesn't have a slot home to go to, so let's hide it
          if (nodeToRelocate.nodeType === NODE_TYPE.ElementNode) {
            nodeToRelocate.hidden = true;
          }
        }
      }
    }

    if (checkSlotFallbackVisibility) {
      updateFallbackSlotVisibility(rootVnode.$elm$);
    }

    // done moving nodes around
    // allow the disconnect callback to work again
    plt.$flags$ &= ~PLATFORM_FLAGS.isTmpDisconnected;

    // always reset
    relocateNodes.length = 0;
  }
};

// slot comment debug nodes only created with the `--debug` flag
// otherwise these nodes are text nodes w/out content
const slotReferenceDebugNode = (slotVNode: d.VNode) =>
  doc.createComment(
    `<slot${slotVNode.$name$ ? ' name="' + slotVNode.$name$ + '"' : ''}> (host=${hostTagName.toLowerCase()})`
  );

const originalLocationDebugNode = (nodeToRelocate: d.RenderNode): any =>
  doc.createComment(
    `org-location for ` +
      (nodeToRelocate.localName
        ? `<${nodeToRelocate.localName}> (host=${nodeToRelocate['s-hn']})`
        : `[${nodeToRelocate.textContent}]`)
  );
