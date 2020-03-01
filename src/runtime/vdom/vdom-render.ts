/**
 * Virtual DOM patching algorithm based on Snabbdom by
 * Simon Friis Vindum (@paldepind)
 * Licensed under the MIT License
 * https://github.com/snabbdom/snabbdom/blob/master/LICENSE
 *
 * Modified for Stencil's renderer and slot projection
 */
import * as d from '../../declarations';
import { BUILD } from '@app-data';
import { CMP_FLAGS, HTML_NS, SVG_NS, isDef } from '@utils';
import { consoleError, doc, plt } from '@platform';
import { h, isHost, newVNode } from './h';
import { NODE_TYPE, PLATFORM_FLAGS, VNODE_FLAGS } from '../runtime-constants';
import { updateElement } from './update-element';


let scopeId: string;
let contentRef: d.RenderNode;
let hostTagName: string;
let useNativeShadowDom = false;
let checkSlotFallbackVisibility = false;
let checkSlotRelocate = false;
let isSvgMode = false;


const createElm = (oldParentVNode: d.VNode, newParentVNode: d.VNode, childIndex: number, parentElm: d.RenderNode) => {
  // tslint:disable-next-line: prefer-const
  let newVNode = newParentVNode.$children$[childIndex];
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

      newVNode.$flags$ |= (newVNode.$children$)
        // slot element has fallback content
        // still create an element that "mocks" the slot element
        ? VNODE_FLAGS.isSlotFallback
        // slot element does not have fallback content
        // create an html comment we'll use to always reference
        // where actual slot content should sit next to
        : VNODE_FLAGS.isSlotReference;
    }
  }


  if (BUILD.isDev && newVNode.$elm$) {
    consoleError(`The JSX ${newVNode.$text$ !== null ? `"${newVNode.$text$}" text` : `"${newVNode.$tag$}" element`} node should not be shared within the same renderer. The renderer caches element lookups in order to improve performance. However, a side effect from this is that the exact same JSX node should not be reused. For more information please see https://stenciljs.com/docs/templating-jsx#avoid-shared-jsx-nodes`);
  }

  if (BUILD.vdomText && newVNode.$text$ !== null) {
    // create text node
    elm = newVNode.$elm$ = doc.createTextNode(newVNode.$text$) as any;

  } else if (BUILD.slotRelocation && newVNode.$flags$ & VNODE_FLAGS.isSlotReference) {
    // create a slot reference node
    elm = newVNode.$elm$ = (BUILD.isDebug || BUILD.hydrateServerSide) ? slotReferenceDebugNode(newVNode) : doc.createTextNode('') as any;

  } else {
    if (BUILD.svg && !isSvgMode) {
      isSvgMode = newVNode.$tag$ === 'svg';
    }
    // create element
    elm = newVNode.$elm$ = ((BUILD.svg)
      ? doc.createElementNS(isSvgMode ? SVG_NS : HTML_NS, (BUILD.slotRelocation && newVNode.$flags$ & VNODE_FLAGS.isSlotFallback) ? 'slot-fb' : newVNode.$tag$ as string)
      : doc.createElement((BUILD.slotRelocation && newVNode.$flags$ & VNODE_FLAGS.isSlotFallback) ? 'slot-fb' : newVNode.$tag$ as string)) as any;

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
          elm.appendChild(childNode);
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
      // remember the content reference comment
      elm['s-sr'] = true;

      // remember the content reference comment
      elm['s-cr'] = contentRef;

      // remember the slot name, or empty string for default slot
      elm['s-sn'] = newVNode.$name$ || '';

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

  const oldSlotChildNodes = parentElm.childNodes;
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
  endIdx: number,
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

const removeVnodes = (vnodes: d.VNode[], startIdx: number, endIdx: number, vnode?: d.VNode, elm?: d.RenderNode) => {
  for (; startIdx <= endIdx; ++startIdx) {
    if (vnode = vnodes[startIdx]) {
      elm = vnode.$elm$;
      callNodeRefs(vnode);

      if (BUILD.slotRelocation) {
        // we're removing this element
        // so it's possible we need to show slot fallback content now
        checkSlotFallbackVisibility = true;

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

const updateChildren = (parentElm: d.RenderNode, oldCh: d.VNode[], newVNode: d.VNode, newCh: d.VNode[]) => {
  let oldStartIdx = 0;
  let newStartIdx = 0;
  let idxInOld = 0;
  let i = 0;
  let oldEndIdx = oldCh.length - 1;
  let oldStartVnode = oldCh[0];
  let oldEndVnode = oldCh[oldEndIdx];
  let newEndIdx = newCh.length - 1;
  let newStartVnode = newCh[0];
  let newEndVnode = newCh[newEndIdx];
  let node: Node;
  let elmToMove: d.VNode;

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
      patch(oldStartVnode, newStartVnode);
      oldStartVnode = oldCh[++oldStartIdx];
      newStartVnode = newCh[++newStartIdx];

    } else if (isSameVnode(oldEndVnode, newEndVnode)) {
      patch(oldEndVnode, newEndVnode);
      oldEndVnode = oldCh[--oldEndIdx];
      newEndVnode = newCh[--newEndIdx];

    } else if (isSameVnode(oldStartVnode, newEndVnode)) {
      // Vnode moved right
      if (BUILD.slotRelocation && (oldStartVnode.$tag$ === 'slot' || newEndVnode.$tag$ === 'slot')) {
        putBackInOriginalLocation(oldStartVnode.$elm$.parentNode, false);
      }
      patch(oldStartVnode, newEndVnode);
      parentElm.insertBefore(oldStartVnode.$elm$, oldEndVnode.$elm$.nextSibling as any);
      oldStartVnode = oldCh[++oldStartIdx];
      newEndVnode = newCh[--newEndIdx];

    } else if (isSameVnode(oldEndVnode, newStartVnode)) {
      // Vnode moved left
      if (BUILD.slotRelocation && (oldStartVnode.$tag$ === 'slot' || newEndVnode.$tag$ === 'slot')) {
        putBackInOriginalLocation(oldEndVnode.$elm$.parentNode, false);
      }
      patch(oldEndVnode, newStartVnode);
      parentElm.insertBefore(oldEndVnode.$elm$, oldStartVnode.$elm$);
      oldEndVnode = oldCh[--oldEndIdx];
      newStartVnode = newCh[++newStartIdx];

    } else {
      // createKeyToOldIdx
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
        elmToMove = oldCh[idxInOld];

        if (elmToMove.$tag$ !== newStartVnode.$tag$) {
          node = createElm(oldCh && oldCh[newStartIdx], newVNode, idxInOld, parentElm);

        } else {
          patch(elmToMove, newStartVnode);
          oldCh[idxInOld] = undefined;
          node = elmToMove.$elm$;
        }

        newStartVnode = newCh[++newStartIdx];

      } else {
        // new element
        node = createElm(oldCh && oldCh[newStartIdx], newVNode, newStartIdx, parentElm);
        newStartVnode = newCh[++newStartIdx];
      }

      if (node) {
        if (BUILD.slotRelocation) {
          parentReferenceNode(oldStartVnode.$elm$).insertBefore(node, referenceNode(oldStartVnode.$elm$));
        } else {
          oldStartVnode.$elm$.parentNode.insertBefore(node, oldStartVnode.$elm$);
        }
      }
    }
  }

  if (oldStartIdx > oldEndIdx) {
    addVnodes(
      parentElm,
      (newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].$elm$),
      newVNode,
      newCh,
      newStartIdx,
      newEndIdx
    );

  } else if (BUILD.updatable && newStartIdx > newEndIdx) {
    removeVnodes(oldCh, oldStartIdx, oldEndIdx);
  }
};

export const isSameVnode = (vnode1: d.VNode, vnode2: d.VNode) => {
  // compare if two vnode to see if they're "technically" the same
  // need to have the same element tag, and same key to be the same
  if (vnode1.$tag$ === vnode2.$tag$) {
    if (BUILD.slotRelocation && vnode1.$tag$ === 'slot') {
      return vnode1.$name$ === vnode2.$name$;
    }
    if (BUILD.vdomKey) {
      return vnode1.$key$ === vnode2.$key$;
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

export const patch = (oldVNode: d.VNode, newVNode: d.VNode) => {
  const elm = newVNode.$elm$ = oldVNode.$elm$;
  const oldChildren = oldVNode.$children$;
  const newChildren = newVNode.$children$;
  const tag = newVNode.$tag$;
  const text = newVNode.$text$;
  let defaultHolder: Comment;

  if (!BUILD.vdomText || text === null) {

    if (BUILD.svg) {
      // test if we're rendering an svg element, or still rendering nodes inside of one
      // only add this to the when the compiler sees we're using an svg somewhere
      isSvgMode = (tag === 'svg')
        ? true
        : (tag === 'foreignObject')
          ? false
          : isSvgMode;
    }

    // element node

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

  } else if (BUILD.vdomText && BUILD.slotRelocation && (defaultHolder = (elm['s-cr'] as any))) {
    // this element has slotted content
    defaultHolder.parentNode.textContent = text;

  } else if (BUILD.vdomText && oldVNode.$text$ !== text) {
    // update the text content for the text only vnode
    // and also only if the text is different than before
    elm.data = text;
  }
};

const updateFallbackSlotVisibility = (elm: d.RenderNode) => {
  // tslint:disable-next-line: prefer-const
  let childNodes: d.RenderNode[] = elm.childNodes as any;
  let childNode: d.RenderNode;
  let i: number;
  let ilen: number;
  let j: number;
  let slotNameAttr: string;
  let nodeType: number;

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
  let childNodes: d.RenderNode[] = elm.childNodes as any;
  let ilen = childNodes.length;

  for (; i < ilen; i++) {
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

          if (isNodeLocatedInSlot(node, slotNameAttr)) {
            // it's possible we've already decided to relocate this node
            relocateNodeData = relocateNodes.find(r => r.$nodeToRelocate$ === node);

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
              relocateNodes.map(relocateNode => {
                if (isNodeLocatedInSlot(relocateNode.$nodeToRelocate$, node['s-sn'])) {
                  relocateNodeData = relocateNodes.find(r => r.$nodeToRelocate$ === node);
                  if (relocateNodeData && !relocateNode.$slotRefNode$) {
                    relocateNode.$slotRefNode$ = relocateNodeData.$slotRefNode$;
                  }
                }
              });
            }

          } else if (!relocateNodes.some(r => r.$nodeToRelocate$ === node)) {
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
  const rootVnode = isHost(renderFnResults)
    ? renderFnResults
    : h(null, null, renderFnResults as any);

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
    cmpMeta.$attrsToReflect$.map(([propName, attribute]) =>
      rootVnode.$attrs$[attribute] = (hostElm as any)[propName]);
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
    useNativeShadowDom = plt.$supportsShadow$ && (cmpMeta.$flags$ & CMP_FLAGS.shadowDomEncapsulation) !== 0;

    // always reset
    checkSlotFallbackVisibility = false;
  }

  // synchronous patch
  patch(oldVNode, rootVnode);

  if (BUILD.slotRelocation) {
    if (checkSlotRelocate) {
      relocateSlotContent(rootVnode.$elm$);

      let relocateData: RelocateNodeData;
      let nodeToRelocate: d.RenderNode;
      let orgLocationNode: d.RenderNode;
      let parentNodeRef: Node;
      let insertBeforeNode: Node;
      let refNode: d.RenderNode;
      let i = 0;

      for (; i < relocateNodes.length; i++) {
        relocateData = relocateNodes[i];
        nodeToRelocate = relocateData.$nodeToRelocate$;

        if (!nodeToRelocate['s-ol']) {
          // add a reference node marking this node's original location
          // keep a reference to this node for later lookups
          orgLocationNode = (BUILD.isDebug || BUILD.hydrateServerSide)
            ? originalLocationDebugNode(nodeToRelocate)
            : doc.createTextNode('') as any;
          orgLocationNode['s-nr'] = nodeToRelocate;

          nodeToRelocate.parentNode.insertBefore(
            (nodeToRelocate['s-ol'] = orgLocationNode),
            nodeToRelocate
          );
        }
      }

      // while we're moving nodes around existing nodes, temporarily disable
      // the disconnectCallback from working
      plt.$flags$ |= PLATFORM_FLAGS.isTmpDisconnected;

      for (i = 0; i < relocateNodes.length; i++) {
        relocateData = relocateNodes[i];
        nodeToRelocate = relocateData.$nodeToRelocate$;

        if (relocateData.$slotRefNode$) {
          // by default we're just going to insert it directly
          // after the slot reference node
          parentNodeRef = relocateData.$slotRefNode$.parentNode;
          insertBeforeNode = relocateData.$slotRefNode$.nextSibling;
          orgLocationNode = nodeToRelocate['s-ol'] as any;

          while (orgLocationNode = orgLocationNode.previousSibling as any) {
            refNode = orgLocationNode['s-nr'];
            if (
              refNode &&
              refNode['s-sn'] === nodeToRelocate['s-sn'] &&
              parentNodeRef === refNode.parentNode
            ) {
              refNode = refNode.nextSibling as any;
              if (!refNode || !refNode['s-nr']) {
                insertBeforeNode = refNode;
                break;
              }
            }
          }

          if (
            (!insertBeforeNode && parentNodeRef !== nodeToRelocate.parentNode) ||
            (nodeToRelocate.nextSibling !== insertBeforeNode)
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
            }
          }

        } else {
          // this node doesn't have a slot home to go to, so let's hide it
          if (nodeToRelocate.nodeType === NODE_TYPE.ElementNode) {
            nodeToRelocate.hidden = true;
          }
        }
      }

      // done moving nodes around
      // allow the disconnect callback to work again
      plt.$flags$ &= ~PLATFORM_FLAGS.isTmpDisconnected;
    }

    if (checkSlotFallbackVisibility) {
      updateFallbackSlotVisibility(rootVnode.$elm$);
    }

    // always reset
    relocateNodes.length = 0;
  }
};

// slot comment debug nodes only created with the `--debug` flag
// otherwise these nodes are text nodes w/out content
const slotReferenceDebugNode = (slotVNode: d.VNode) =>
  doc.createComment(
    `<slot${slotVNode.$name$ ?
      (' name="' + slotVNode.$name$) + '"' :
      ''}> (host=${hostTagName.toLowerCase()})`)

const originalLocationDebugNode = (nodeToRelocate: d.RenderNode): any =>
  doc.createComment(
    `org-location for ` +
    (nodeToRelocate.localName ?
      `<${nodeToRelocate.localName}> (host=${nodeToRelocate['s-hn']})` :
      `[${nodeToRelocate.textContent}]`)
  );
