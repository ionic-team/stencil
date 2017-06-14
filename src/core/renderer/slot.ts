import { DomApi, HostElement } from '../../util/interfaces';
import { HAS_SLOTS, HAS_NAMED_SLOTS } from '../../util/constants';


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
