import { DomApi, HostElement } from '../../util/interfaces';



export function assignHostContentSlots(domApi: DomApi, elm: HostElement, validNamedSlots: string[]) {
  const childNodes = elm.childNodes;

  if (validNamedSlots) {
    let defaultSlot: Node[];
    let namedSlots: {[slotName: string]: Node[]};
    const validNamedSlotsLen = validNamedSlots.length;

    for (let i = 0, childNodeLen = childNodes.length; i < childNodeLen; i++) {
      var isDefaultSlot = true;
      var childNode = childNodes[i];

      if (domApi.$isElement(childNode)) {
        var slotName = domApi.$getAttribute(childNode, 'slot');

        for (var j = 0; j < validNamedSlotsLen; j++) {
          if (slotName === validNamedSlots[j]) {
            namedSlots = namedSlots || {};
            if (namedSlots[slotName]) {
              namedSlots[slotName].push(childNode);
            } else {
              namedSlots[slotName] = [childNode];
            }
            isDefaultSlot = false;
            break;
          }
        }
      }

      if (isDefaultSlot) {
        if (defaultSlot) {
          defaultSlot.push(childNode);
        } else {
          defaultSlot = [childNode];
        }
      }
    }

    elm._hostContentNodes = {
      defaultSlot: defaultSlot,
      namedSlots: namedSlots
    };

  } else {
    // fast path for elements without named slots
    elm._hostContentNodes = {
      defaultSlot: childNodes.length ? Array.apply(null, childNodes) : null
    };
  }

}
