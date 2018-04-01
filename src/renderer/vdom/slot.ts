import * as d from '../../declarations';
import { isDef } from '../../util/helpers';
import { NODE_TYPE } from '../../util/constants';


export function initHostContent(domApi: d.DomApi, elm: d.HostElement) {

  if (!elm.$defaultHolder) {
    // create a comment to represent where the original
    // content was first placed, which is useful later on
    domApi.$insertBefore(elm, (elm.$defaultHolder = domApi.$createComment('')), domApi.$childNodes(elm)[0]);
  }

}


export function loadHostContent(domApi: d.DomApi, elm: d.HostElement, defaultSlot?: d.DefaultSlot, namedSlots?: d.NamedSlots, i?: number, node?: Node, childNodes?: NodeList, slotName?: string) {
  if ((node = elm.$defaultHolder)) {
    node = domApi.$parentNode(node);

    if (node) {
      childNodes = domApi.$childNodes(node);

      for (i = 0; i < childNodes.length; i++) {
        node = childNodes[i];

        if (domApi.$nodeType(node) === NODE_TYPE.ElementNode && isDef(slotName = domApi.$getAttribute(node, 'slot'))) {
          // is element node
          // this element has a slot name attribute
          // so this element will end up getting relocated into
          // the component's named slot once it renders
          namedSlots = namedSlots || {};
          if (namedSlots[slotName]) {
            namedSlots[slotName].push(node);
          } else {
            namedSlots[slotName] = [node];
          }

        } else {
          // this is a text node
          // or it's an element node that doesn't have a slot attribute
          // let's add this node to our collection for the default slot
          if (defaultSlot) {
            defaultSlot.push(node);
          } else {
            defaultSlot = [node];
          }
        }
      }
    }
  }

  return {
    defaultSlot,
    namedSlots
  } as d.HostContent;
}
