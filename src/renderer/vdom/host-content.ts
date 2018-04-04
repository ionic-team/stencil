import * as d from '../../declarations';
import { isDef } from '../../util/helpers';
import { NODE_TYPE } from '../../util/constants';


export function loadHostContent(domApi: d.DomApi, contentRef: Comment, contentSlots: d.ContentSlots = {}, node?: Node, childNodes?: NodeList, i?: number, slotName?: string) {
  node = contentRef && domApi.$parentNode(contentRef);

  if (node) {
    childNodes = domApi.$childNodes(node);

    for (i = 0; i < childNodes.length; i++) {
      node = childNodes[i];

      if (domApi.$nodeType(node) === NODE_TYPE.ElementNode && isDef(slotName = domApi.$getAttribute(node, 'slot'))) {
        // is element node
        // this element has a slot name attribute
        // so this element will end up getting relocated into
        // the component's named slot once it renders
        if (contentSlots[slotName]) {
          contentSlots[slotName].push(node);
        } else {
          contentSlots[slotName] = [node];
        }

      } else {
        // this is a text node
        // or it's an element node that doesn't have a slot attribute
        // let's add this node to our collection for the default slot
        if (contentSlots.$defaultSlot) {
          contentSlots.$defaultSlot.push(node);
        } else {
          contentSlots.$defaultSlot = [node];
        }
      }
    }
  }

  return contentSlots;
}
