import { ComponentMeta, DomApi, HostElement } from '../../util/interfaces';
import { NODE_TYPE } from '../../util/constants';


export function assignHostContentSlots(domApi: DomApi, cmpMeta: ComponentMeta, elm: HostElement, childNodes: NodeList) {
  // compiler has already figured out if this component has slots or not
  // if the component doesn't even have slots then we'll skip over all of this code

  if (cmpMeta.slotMeta) {
    // looks like this component has slots
    // so let's loop through each of the childNodes to the host element
    // and pick out the ones that have a slot attribute
    // if it doesn't have a slot attribute, than it's a default slot

    if (!elm.$defaultHolder) {
      // create a comment to represent where the original
      // content was first placed, which is useful later on
      domApi.$insertBefore(elm, (elm.$defaultHolder = domApi.$createComment('')), childNodes[0]);
    }

    let slotName: string;
    let defaultSlot: Node[];
    let namedSlots: {[slotName: string]: Node[]};
    let i = 0;

    for (; i < childNodes.length; i++) {
      var childNode = childNodes[i];

      if (domApi.$nodeType(childNode) === NODE_TYPE.ElementNode && ((slotName = domApi.$getAttribute(childNode, 'slot')) != null)) {
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
  }
}
