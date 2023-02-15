import type * as d from '../../declarations';
import { NODE_TYPE } from '../runtime-constants';
import { patchRemove } from '../dom-extras';

/**
 * Show or hide a slot nodes children
 * @param slotNode a slot node, the 'children' of which should be shown or hidden
 * @param hide whether to hide the slot node 'children'
 * @returns
 */
const renderSlotFallbackContent = (slotNode: d.RenderNode, hide: boolean) => {
  // if this slot doesn't have fallback content, return
  if (!slotNode['s-hsf'] || !slotNode.parentNode) return;

  // in non-shadow component, slot nodes are just empty text nodes or comment nodes
  // the 'children' nodes are therefore placed next to it.
  // let's loop through those now
  let childNodes = ((slotNode.parentNode as d.RenderNode).__childNodes ||
    slotNode.parentNode.childNodes) as NodeListOf<d.RenderNode>;
  let childNode: d.RenderNode;

  const childNodesLen = childNodes.length;
  let i = 0;

  for (i; i < childNodesLen; i++) {
    childNode = childNodes[i];

    if (childNode['s-sr'] && hide && childNode['s-psn'] === slotNode['s-sn']) {
      // if this child node is a nested slot
      // drill into it's children to hide them in-turn
      renderSlotFallbackContent(childNode, true);
      continue;
    }
    // this child node doesn't relate to this slot?
    if (childNode['s-sn'] !== slotNode['s-sn']) continue;

    if (childNode.nodeType === NODE_TYPE.ElementNode && childNode['s-sf']) {
      // we found an fallback element. Hide or show
      childNode.hidden = hide;
      childNode.style.display = hide ? 'none' : '';
    } else if (!!childNode['s-sfc']) {
      // this child has fallback text. Add or remove it
      if (hide) {
        childNode['s-sfc'] = childNode.textContent || undefined;
        childNode.textContent = '';
      } else if (!childNode.textContent || childNode.textContent.trim() === '') {
        childNode.textContent = childNode['s-sfc'];
      }
    }
  }
};

/**
 * Function applied to non-shadow component nodes to mimic native shadowDom behaviour:
 * - When slotted node/s are not present, show `<slot>` node children
 * - When slotted node/s *are* present, hide `<slot>` node children
 * @param node an entry whose children to iterate over
 */
export const updateFallbackSlotVisibility = (node: d.RenderNode) => {
  if (!node) return;

  const childNodes: d.RenderNode[] = (node as d.RenderNode).__childNodes || (node.childNodes as any);
  let slotNode: d.RenderNode;
  let i: number;
  let ilen: number;
  let j: number;
  let slotNameAttr: string | undefined;
  let nodeType: number;

  for (i = 0, ilen = childNodes.length; i < ilen; i++) {
    // slot reference node?
    if (childNodes[i]['s-sr']) {
      // this component uses slots and we're on a slot node
      // let's find all it's slotted children or lack thereof
      // and show or hide fallback nodes (`<slot />` children)

      // get the slot name for this slot reference node
      slotNameAttr = childNodes[i]['s-sn'];
      slotNode = childNodes[i];

      // by default always show a fallback slot node
      // then hide it if there are other slotted nodes in the light dom
      renderSlotFallbackContent(slotNode, false);

      // because we found a slot fallback node let's loop over all
      // the children again to
      for (j = 0; j < ilen; j++) {
        nodeType = childNodes[j].nodeType;

        // ignore slot fallback nodes
        if (childNodes[j]['s-sf']) continue;

        // is sibling node is from a different component OR is a named fallback slot node?
        if (childNodes[j]['s-hn'] !== slotNode['s-hn'] || slotNameAttr !== '') {
          // you can't slot a textNode in a named slot
          if (nodeType === NODE_TYPE.ElementNode && slotNameAttr === childNodes[j]['s-sn']) {
            // we found a slotted element!
            // let's hide all the fallback nodes
            renderSlotFallbackContent(slotNode, true);

            // patches this node's removal methods
            // so if it gets removed in the future
            // re-asses the fallback node status
            patchRemove(childNodes[j]);
            break;
          }
        } else if (childNodes[j]['s-sn'] === slotNameAttr) {
          // this is a default fallback slot node
          // any element or text node (with content)
          // should hide the default fallback slot node
          if (
            nodeType === NODE_TYPE.ElementNode ||
            (nodeType === NODE_TYPE.TextNode &&
              childNodes[j] &&
              childNodes[j].textContent &&
              (childNodes[j].textContent as string).trim() !== '')
          ) {
            // we found a slotted something
            // let's hide all the fallback nodes
            renderSlotFallbackContent(slotNode, true);

            // patches this node's removal methods
            // so if it gets removed in the future
            // re-asses the fallback node status
            patchRemove(childNodes[j]);
            break;
          }
        }
      }
    }
    // keep drilling down
    updateFallbackSlotVisibility(childNodes[i]);
  }
};
