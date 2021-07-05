import type * as d from '../../declarations';
import { NODE_TYPE } from '../runtime-constants';
import { patchNodeRemove } from '../dom-extras';

const renderSlotFallbackContent = (sr: d.RenderNode, hide: boolean) => {
  if (!sr['s-hsf']) return;
  let n: d.RenderNode = sr;

  while ((n = (n.previousSibling || n.parentNode) as d.RenderNode) && (n.tagName !== sr['s-hn'])) {
    if (n['s-sr'] && hide && n['s-psn'] && n['s-psn'] === sr['s-sn']) {
      renderSlotFallbackContent(n, true);
      continue;
    }
    if (n['s-sn'] !== sr['s-sn']) continue;

    if (n.nodeType === NODE_TYPE.ElementNode) {
      n.hidden = hide;
    } else if (!!n['s-sfc']) {
      if (hide) {
        n['s-sfc'] = n.textContent;
        n.textContent = '';
      } else if (n.textContent.trim() === '') {
        n.textContent = n['s-sfc'];
      }
    }
  }
}

export const updateFallbackSlotVisibility = (elm: d.RenderNode) => {
  let childNodes: d.RenderNode[] = ((elm as d.RenderNode).__childNodes || elm.childNodes as any);
  let childNode: d.RenderNode;
  let i: number;
  let ilen: number;
  let j: number;
  let slotNameAttr: string;
  let nodeType: number;

  for (i = 0, ilen = childNodes.length; i < ilen; i++) {
    childNode = childNodes[i];

    if (childNode['s-sr']) {
      // this is a slot fallback node

      // get the slot name for this slot reference node
      slotNameAttr = childNode['s-sn'];

      // by default always show a fallback slot node
      // then hide it if there are other slots in the light dom
      renderSlotFallbackContent(childNode, false);

      for (j = 0; j < ilen; j++) {
        nodeType = childNodes[j].nodeType;

        if (childNodes[j]['s-sf']) continue;

        if (childNodes[j]['s-hn'] !== childNode['s-hn'] || slotNameAttr !== '') {
          // this sibling node is from a different component OR is a named fallback slot node
          if (nodeType === NODE_TYPE.ElementNode && slotNameAttr === childNodes[j]['s-sn']) {
            renderSlotFallbackContent(childNode, true);
            patchNodeRemove(childNodes[j]);
            break;
          }
        } else if (childNodes[j]['s-sn'] === slotNameAttr) {
          // this is a default fallback slot node
          // any element or text node (with content)
          // should hide the default fallback slot node
          if (
            nodeType === NODE_TYPE.ElementNode ||
            (nodeType === NODE_TYPE.TextNode && childNodes[j].textContent.trim() !== '')
          ) {
            renderSlotFallbackContent(childNode, true);
            patchNodeRemove(childNodes[j]);
            break;
          }
        }
      }
    }
    // keep drilling down
    updateFallbackSlotVisibility(childNode);
  }
};
