import { NODE_TYPE, SLOT_META, SSR_CHILD_ID, SSR_VNODE_ID } from '../../util/constants';
import { DomApi, HostElement, VNode } from '../../util/interfaces';
import { t } from './h';
import { VNode as VNodeObj } from './vnode';


export function createVNodesFromSsr(domApi: DomApi, rootElm: Element) {
  var allSsrElms: HostElement[] = <any>rootElm.querySelectorAll(`[${SSR_VNODE_ID}]`),
      elm: HostElement,
      ssrVNodeId: string,
      ssrVNode: VNode,
      i: number,
      ilen = allSsrElms.length,
      j: number,
      jlen: number;

  if ((<HostElement>rootElm)._hasLoaded = ilen > 0) {
    for (i = 0; i < ilen; i++) {
      elm = allSsrElms[i];
      ssrVNodeId = domApi.$getAttribute(elm, SSR_VNODE_ID);
      ssrVNode = elm._vnode = new VNodeObj();
      ssrVNode.vtag = domApi.$tagName(ssrVNode.elm = elm);

      for (j = 0, jlen = elm.childNodes.length; j < jlen; j++) {
        addChildSsrVNodes(domApi, elm.childNodes[j], ssrVNode, ssrVNodeId, true);
      }
    }
  }
}


function addChildSsrVNodes(domApi: DomApi, node: Node, parentVNode: VNode, ssrVNodeId: string, checkNestedElements: boolean) {
  var nodeType = domApi.$nodeType(node);
  var previousComment: Comment;
  var childVNodeId: string,
      childVNodeSplt: string[],
      childVNode: VNode;

  if (checkNestedElements && nodeType === NODE_TYPE.ElementNode) {
    childVNodeId = domApi.$getAttribute(node, SSR_CHILD_ID);

    if (childVNodeId) {
      // split the start comment's data with a period
      childVNodeSplt = childVNodeId.split('.');

      // ensure this this element is a child element of the ssr vnode
      if (childVNodeSplt[0] === ssrVNodeId) {
        // cool, this element is a child to the parent vnode
        childVNode = new VNodeObj();
        childVNode.vtag = domApi.$tagName(childVNode.elm = node);

        // this is a new child vnode
        // so ensure its parent vnode has the vchildren array
        if (!parentVNode.vchildren) {
          parentVNode.vchildren = [];
        }

        // add our child vnode to a specific index of the vnode's children
        parentVNode.vchildren[<any>childVNodeSplt[1]] = childVNode;

        // this is now the new parent vnode for all the next child checks
        parentVNode = childVNode;

        // if there's a trailing period, then it means there aren't any
        // more nested elements, but maybe nested text nodes
        // either way, don't keep walking down the tree after this next call
        checkNestedElements = (childVNodeSplt[2] !== '');
      }
    }

    // keep drilling down through the elements
    for (var i = 0; i < node.childNodes.length; i++) {
      addChildSsrVNodes(domApi, <any>node.childNodes[i], parentVNode, ssrVNodeId, checkNestedElements);
    }

  } else if (nodeType === NODE_TYPE.TextNode &&
            (previousComment = <Comment>node.previousSibling) &&
            domApi.$nodeType(previousComment) === NODE_TYPE.CommentNode) {

    // split the start comment's data with a period
    childVNodeSplt = domApi.$getTextContent(previousComment).split('.');

    // ensure this is an ssr text node start comment
    // which should start with an "s" and delimited by periods
    if (childVNodeSplt[0] === 's' && childVNodeSplt[1] === ssrVNodeId) {
      // cool, this is a text node and it's got a start comment
      childVNode = t(domApi.$getTextContent(node));
      childVNode.elm = node;

      // this is a new child vnode
      // so ensure its parent vnode has the vchildren array
      if (!parentVNode.vchildren) {
        parentVNode.vchildren = [];
      }

      // add our child vnode to a specific index of the vnode's children
      parentVNode.vchildren[<any>childVNodeSplt[2]] = childVNode;
    }
  }
}


export function assignHostContentSlots(domApi: DomApi, elm: HostElement, slotMeta: SLOT_META) {
  // compiler has already figured out if this component has slots or not
  // if the component doesn't even have slots then we'll skip over all of this code
  const childNodes = elm.childNodes;

  if (slotMeta && !elm.$defaultHolder) {
    domApi.$insertBefore(elm, (elm.$defaultHolder = domApi.$createComment('')), childNodes[0]);
  }

  if (slotMeta === SLOT_META.HasNamedSlots) {
    // looks like this component has named slots
    // so let's loop through each of the childNodes to the host element
    // and pick out the ones that have a slot attribute
    // if it doesn't have a slot attribute, than it's a default slot
    let slotName: string;
    let defaultSlot: Node[];
    let namedSlots: {[slotName: string]: Node[]};

    for (let i = 0, childNodeLen = childNodes.length; i < childNodeLen; i++) {
      var childNode = childNodes[i];

      if (domApi.$nodeType(childNode) === 1 && ((slotName = domApi.$getAttribute(childNode, 'slot')) != null)) {
        // is element node
        // this element has a slot name attribute
        // so this element will end up getting relocated into
        // the component's named slot once it renders
        namedSlots = namedSlots || {};
        if (namedSlots[slotName]) {
          namedSlots[slotName].push(childNode);
        } else {
          namedSlots[slotName] = [childNode];
        }

      } else {
        // this is a text node
        // or it's an element node that doesn't have a slot attribute
        // let's add this node to our collection for the default slot
        if (defaultSlot) {
          defaultSlot.push(childNode);
        } else {
          defaultSlot = [childNode];
        }
      }
    }

    // keep a reference to all of the initial nodes
    // found as immediate childNodes to the host element
    elm._hostContentNodes = {
      defaultSlot: defaultSlot,
      namedSlots: namedSlots
    };

  } else if (slotMeta === SLOT_META.HasSlots) {
    // this component doesn't have named slots, but it does
    // have at least a default slot, so the work here is alot easier than
    // when we're not looping through each element and reading attribute values
    elm._hostContentNodes = {
      defaultSlot: childNodes.length ? Array.apply(null, childNodes) : null
    };
  }

}
