import { getHostRef } from '@platform';

import type * as d from '../../declarations';
import {
  COMMENT_NODE_ID,
  CONTENT_REF_ID,
  HYDRATED_SLOT_FALLBACK_ID,
  HYDRATE_CHILD_ID,
  HYDRATE_ID,
  NODE_TYPE,
  ORG_LOCATION_ID,
  SLOT_NODE_ID,
  TEXT_NODE_ID,
} from '../runtime-constants';

export const insertVdomAnnotations = (doc: Document, staticComponents: string[]) => {
  if (doc != null) {
    const docData: DocData = {
      hostIds: 0,
      rootLevelIds: 0,
      staticComponents: new Set(staticComponents),
    };
    const orgLocationNodes: d.RenderNode[] = [];

    parseVNodeAnnotations(doc, doc.body, docData, orgLocationNodes);

    orgLocationNodes.forEach((orgLocationNode) => {
      if (orgLocationNode != null) {
        const nodeRef = orgLocationNode['s-nr'];

        let hostId = nodeRef['s-host-id'];
        let nodeId = nodeRef['s-node-id'];
        let childId = `${hostId}.${nodeId}`;

        if (hostId == null) {
          hostId = 0;
          docData.rootLevelIds++;
          nodeId = docData.rootLevelIds;
          childId = `${hostId}.${nodeId}`;

          if (nodeRef.nodeType === NODE_TYPE.ElementNode) {
            nodeRef.setAttribute(HYDRATE_CHILD_ID, childId);
            if (typeof nodeRef['s-sn'] === 'string') nodeRef.setAttribute('s-sn', nodeRef['s-sn']);
          } else if (nodeRef.nodeType === NODE_TYPE.TextNode) {
            if (hostId === 0) {
              const textContent = nodeRef.nodeValue.trim();
              if (textContent === '') {
                // useless whitespace node at the document root
                orgLocationNode.remove();
                return;
              }
            }
            const commentBeforeTextNode = doc.createComment(childId);
            commentBeforeTextNode.nodeValue = `${TEXT_NODE_ID}.${childId}`;
            nodeRef.parentNode.insertBefore(commentBeforeTextNode, nodeRef);
          } else if (nodeRef.nodeType === NODE_TYPE.CommentNode) {
            const commentBeforeTextNode = doc.createComment(childId);
            commentBeforeTextNode.nodeValue = `${COMMENT_NODE_ID}.${childId}`;
            nodeRef.parentNode.insertBefore(commentBeforeTextNode, nodeRef);
          }
        }

        let orgLocationNodeId = `${ORG_LOCATION_ID}.${childId}`;

        const orgLocationParentNode = orgLocationNode.parentElement as d.RenderNode;
        if (orgLocationParentNode) {
          if (orgLocationParentNode['s-en'] === '') {
            // ending with a "." means that the parent element
            // of this node's original location is a SHADOW dom element
            // and this node is a part of the root level light dom
            orgLocationNodeId += `.`;
          } else if (orgLocationParentNode['s-en'] === 'c') {
            // ending with a ".c" means that the parent element
            // of this node's original location is a SCOPED element
            // and this node is apart of the root level light dom
            orgLocationNodeId += `.c`;
          }
        }

        orgLocationNode.nodeValue = orgLocationNodeId;
      }
    });
  }
};

const parseVNodeAnnotations = (
  doc: Document,
  node: d.RenderNode,
  docData: DocData,
  orgLocationNodes: d.RenderNode[]
) => {
  if (node == null) {
    return;
  }

  if (node['s-nr'] != null) {
    orgLocationNodes.push(node);
  }

  if (node.nodeType === NODE_TYPE.ElementNode) {
    node.childNodes.forEach((childNode) => {
      const hostRef = getHostRef(childNode);
      if (hostRef != null && !docData.staticComponents.has(childNode.nodeName.toLowerCase())) {
        const cmpData: CmpData = {
          nodeIds: 0,
        };
        insertVNodeAnnotations(doc, childNode as any, hostRef.$vnode$, docData, cmpData);
      }

      parseVNodeAnnotations(doc, childNode as any, docData, orgLocationNodes);
    });
  }
};

const insertVNodeAnnotations = (
  doc: Document,
  hostElm: d.HostElement,
  vnode: d.VNode,
  docData: DocData,
  cmpData: CmpData
) => {
  if (vnode != null) {
    const hostId = ++docData.hostIds;

    hostElm.setAttribute(HYDRATE_ID, hostId as any);

    if (hostElm['s-cr'] != null) {
      hostElm['s-cr'].nodeValue = `${CONTENT_REF_ID}.${hostId}`;
    }

    if (vnode.$children$ != null) {
      const depth = 0;
      vnode.$children$.forEach((vnodeChild, index) => {
        insertChildVNodeAnnotations(doc, vnodeChild, cmpData, hostId, depth, index);
      });
    }

    if (hostElm && vnode && vnode.$elm$ && !hostElm.hasAttribute(HYDRATE_CHILD_ID)) {
      const parent: HTMLElement = hostElm.parentElement;
      if (parent && parent.childNodes) {
        const parentChildNodes: ChildNode[] = Array.from(parent.childNodes);
        const comment: d.RenderNode | undefined = parentChildNodes.find(
          (node) => node.nodeType === NODE_TYPE.CommentNode && (node as d.RenderNode)['s-sr']
        ) as d.RenderNode | undefined;
        if (comment) {
          const index: number = parentChildNodes.indexOf(hostElm) - 1;
          (vnode.$elm$ as d.RenderNode).setAttribute(
            HYDRATE_CHILD_ID,
            `${comment['s-host-id']}.${comment['s-node-id']}.0.${index}`
          );
        }
      }
    }
  }
};

const insertChildVNodeAnnotations = (
  doc: Document,
  vnodeChild: d.VNode,
  cmpData: CmpData,
  hostId: number,
  depth: number,
  index: number
) => {
  const childElm = vnodeChild.$elm$ as d.RenderNode;
  if (childElm == null) {
    return;
  }

  const nodeId = cmpData.nodeIds++;
  const childId = `${hostId}.${nodeId}.${depth}.${index}`;

  childElm['s-host-id'] = hostId;
  childElm['s-node-id'] = nodeId;

  if (childElm.nodeType === NODE_TYPE.ElementNode) {
    childElm.setAttribute(HYDRATE_CHILD_ID, childId);
    if (typeof childElm['s-sn'] === 'string') childElm.setAttribute('s-sn', childElm['s-sn']);
  } else if (childElm.nodeType === NODE_TYPE.TextNode) {
    const parentNode = childElm.parentNode;
    const nodeName = parentNode.nodeName;
    if (nodeName !== 'STYLE' && nodeName !== 'SCRIPT') {
      const slotName = childElm['s-sn'] || '';
      const textNodeId = `${TEXT_NODE_ID}.${childId}.${childElm['s-sf'] ? '1' : '0'}.${slotName}`;

      const commentBeforeTextNode = doc.createComment(textNodeId);
      parentNode.insertBefore(commentBeforeTextNode, childElm);
    }
  } else if (childElm.nodeType === NODE_TYPE.CommentNode) {
    if (childElm['s-sr']) {
      const slotName = childElm['s-sn'] || '';
      const fallBackText = vnodeChild.$children$
        ?.filter((c) => c.$elm$?.nodeType === NODE_TYPE.TextNode)
        .map((ce) => {
          ce.$elm$['s-sf'] = true;
          return ce.$text$;
        })
        .join(' ');
      const slotNodeId = `${SLOT_NODE_ID}.${childId}.${slotName}.${childElm['s-hsf'] ? '1' : '0'}.${
        childElm['s-sfc'] || fallBackText ? '1' : '0'
      }`;
      childElm.nodeValue = slotNodeId;

      // this mock slot node has fallback text
      // add the content to a comment node
      if (childElm['s-sfc'] || fallBackText) {
        const parentNode = childElm.parentNode;
        const commentBeforeFallbackTextNode = doc.createComment(childElm['s-sfc'] || fallBackText);
        parentNode.insertBefore(commentBeforeFallbackTextNode, childElm);
      }

      // this mock slot node has fallback nodes
      // add the mock slot id as an serializable attribute
      if (childElm['s-hsf'] && vnodeChild.$children$ && vnodeChild.$children$.length) {
        vnodeChild.$children$.forEach((vNode) => {
          if (vNode.$elm$.nodeType === NODE_TYPE.ElementNode) {
            vNode.$elm$.setAttribute(HYDRATED_SLOT_FALLBACK_ID, slotNodeId);
          }
        });
      }
      childElm.nodeValue = slotNodeId;
    }
  }

  if (vnodeChild.$children$ != null) {
    const childDepth = depth + 1;
    vnodeChild.$children$.forEach((vnode, index) => {
      insertChildVNodeAnnotations(doc, vnode, cmpData, hostId, childDepth, index);
    });
  }
};

interface DocData {
  hostIds: number;
  rootLevelIds: number;
  staticComponents: Set<string>;
}

interface CmpData {
  nodeIds: number;
}
