import * as d from '../../declarations';
import { getHostRef } from '@platform';
import { CONTENT_REF_ID, HYDRATE_CHILD_ID, HYDRATE_HOST_ID, NODE_TYPE, ORG_LOCATION_ID, SLOT_NODE_ID, TEXT_NODE_ID } from '../runtime-constants';


export const insertVdomAnnotations = (doc: Document) => {
  if (doc != null) {
    const data: DocData = {
      ids: 0
    };
    elementVNodeAnnotations(doc, doc.body, data);
  }
};


const elementVNodeAnnotations = (doc: Document, node: d.RenderNode, docData: DocData) => {
  if (node == null) {
    return;
  }

  if (node.nodeType === NODE_TYPE.ElementNode) {
    node.childNodes.forEach(childNode => {
      const hostRef = getHostRef(childNode);
      if (hostRef != null) {
        insertVNodeAnnotations(doc, childNode as any, hostRef.$vnode$, docData);
      }

      elementVNodeAnnotations(doc, childNode as any, docData);
    });
  }
};


const insertVNodeAnnotations = (doc: Document, hostElm: d.HostElement, vnode: d.VNode, docData: DocData) => {
  if (vnode != null) {
    const hostId = ++docData.ids;

    hostElm.setAttribute(HYDRATE_HOST_ID, hostId as any);

    if (hostElm['s-cr'] != null) {
      hostElm['s-cr'].nodeValue = `${CONTENT_REF_ID}.${hostId}`;
    }

    if (vnode.$children$ != null) {
      const depth = 0;
      vnode.$children$.forEach((vnodeChild, index) => {
        insertChildVNodeAnnotations(doc, vnodeChild, hostId, depth, index);
      });
    }
  }
};


const insertChildVNodeAnnotations = (doc: Document, vnodeChild: d.VNode, hostId: number, depth: number, index: number) => {
  const childElm = vnodeChild.$elm$ as d.RenderNode;
  if (childElm == null) {
    return;
  }

  const childId = `${hostId}.${depth}.${index}`;
  const orgLocation = childElm['s-ol'];
  if (orgLocation != null) {
    orgLocation.nodeValue = `${ORG_LOCATION_ID}.${childId}`;
  }

  if (childElm.nodeType === NODE_TYPE.ElementNode) {
    childElm.setAttribute(HYDRATE_CHILD_ID, childId);

  } else if (childElm.nodeType === NODE_TYPE.TextNode) {
    const textNodeId = `${TEXT_NODE_ID}.${childId}`;

    const commentBeforeTextNode = doc.createComment(textNodeId);
    childElm.parentNode.insertBefore(commentBeforeTextNode, childElm);

  } else if (childElm.nodeType === NODE_TYPE.CommentNode) {
    if (childElm['s-sr']) {
      const slotName = (childElm['s-sn'] || '');
      const slotNodeId = `${SLOT_NODE_ID}.${childId}.${slotName}`;
      childElm.nodeValue = slotNodeId;
    }
  }

  if (vnodeChild.$children$ != null) {
    const childDepth = depth + 1;
    vnodeChild.$children$.forEach((vnode, index) => {
      insertChildVNodeAnnotations(doc, vnode, hostId, childDepth, index);
    });
  }
};


interface DocData {
  ids: number;
}
