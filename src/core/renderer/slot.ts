import { COMMENT_NODE, ELEMENT_NODE, HAS_SLOTS, HAS_NAMED_SLOTS,
  SSR_SLOT_END, SSR_SLOT_START, SLOT_TAG, SSR_ID, TEXT_NODE } from '../../util/constants';
import { DomApi, HostElement, VNode } from '../../util/interfaces';
import { VNode as VNodeObj } from './vnode';


export function createVNodeFromSsr(domApi: DomApi, node: Node, ssrId: string) {
  let vnode: VNode = null;

  if (domApi.$getAttribute(node, SSR_ID) === ssrId) {
    vnode = new VNodeObj();
    vnode.elm = node;
    vnode.vtag = domApi.$tagName(node).toLowerCase();

    const childNodes = domApi.$childNodes(node);
    let childVnode: VNode;
    let childNode: Node;
    let isWithinSlot = false;
    let nodeType: number;
    let nodeValue: string;

    for (let i = 0, l = childNodes.length; i < l; i++) {
      childVnode = null;
      childNode = childNodes[i];
      nodeType = domApi.$nodeType(childNode);

      if (nodeType === COMMENT_NODE) {
        nodeValue = childNode.nodeValue;

        if (nodeValue.indexOf(SSR_SLOT_START) === 0) {
          isWithinSlot = true;
          childVnode = new VNodeObj();
          childVnode.vtag = SLOT_TAG;

          nodeValue = nodeValue.substring(2);
          if (nodeValue) {
            childVnode.vattrs = {
              'name': nodeValue
            };
          }

        } else if (nodeValue === SSR_SLOT_END) {
          isWithinSlot = false;
        }

      } else if (!isWithinSlot) {
        if (nodeType === ELEMENT_NODE) {
          childVnode = createVNodeFromSsr(domApi, childNode, ssrId);

        } else if (nodeType === TEXT_NODE) {
          childVnode = new VNodeObj();
          childVnode.elm = childNode;
          childVnode.vtext = domApi.$getTextContent(childNode);
        }
      }

      if (childVnode) {
        if (vnode.vchildren) {
          vnode.vchildren.push(childVnode);
        } else {
          vnode.vchildren = [childVnode];
        }
      }
    }
  }

  return vnode;
}


export function assignHostContentSlots(domApi: DomApi, elm: HostElement, slotMeta: number) {
  // compiler has already figured out if this component has slots or not
  // if the component doesn't even have slots then we'll skip over all of this code
  const childNodes = elm.childNodes;

  if (slotMeta === HAS_NAMED_SLOTS) {
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

  } else if (slotMeta === HAS_SLOTS) {
    // this component doesn't have named slots, but it does
    // have at least a default slot, so the work here is alot easier than
    // when we're not looping through each element and reading attribute values
    elm._hostContentNodes = {
      defaultSlot: childNodes.length ? Array.apply(null, childNodes) : null
    };
  }

}
