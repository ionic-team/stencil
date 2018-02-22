import { DomApi, HostElement, PlatformApi } from '../../declarations';
import { NODE_TYPE } from '../../util/constants';


export function assignHostContentSlots(plt: PlatformApi, domApi: DomApi, elm: HostElement, childNodes: NodeList, childNode?: Node, slotName?: string, defaultSlot?: Node[], namedSlots?: {[slotName: string]: Node[]}, i?: number) {
  // so let's loop through each of the childNodes to the host element
  // and pick out the ones that have a slot attribute
  // if it doesn't have a slot attribute, than it's a default slot

  if (!elm.$defaultHolder) {
    // create a comment to represent where the original
    // content was first placed, which is useful later on
    domApi.$insertBefore(elm, (elm.$defaultHolder = domApi.$createComment('')), childNodes[0]);
  }

  for (i = 0; i < childNodes.length; i++) {
    childNode = childNodes[i];

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
  plt.defaultSlotsMap.set(elm, defaultSlot);
  plt.namedSlotsMap.set(elm, namedSlots);
}
