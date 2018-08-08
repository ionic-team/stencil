import * as d from '../declarations';
import * as c from '../util/constants';


export function ssrComment(domApi: d.DomApi, node: d.RenderNode) {
  const nodeType = domApi.$nodeType(node);

  if (node.ssrIsHost) {
    ssrCommentHostElement(domApi, node);
  }

  if (node.ssrIsLightDom) {
    ssrCommentLightDom(domApi, node, nodeType);
  }

  if (node.ssrIsComponentChild) {
    ssrCommentComponentChild(domApi, node, nodeType);
  }

  if (node.ssrIsSlotRef) {
    ssrCommentSlotRef(domApi, node);
  }

  if (nodeType === c.NODE_TYPE.ElementNode) {
    const childNodes = Array.prototype.slice.call(domApi.$childNodes(node)) as d.RenderNode[];

    childNodes.forEach(childNode => {
      ssrComment(domApi, childNode);
    });
  }
}


function ssrCommentHostElement(domApi: d.DomApi, hostElm: d.RenderNode) {
  ssrCommentHostAttr(domApi, hostElm);
  ssrCommentHostContentRef(domApi, hostElm);
}


function ssrCommentHostAttr(domApi: d.DomApi, hostElm: d.RenderNode) {
  const attrId = hostElm.ssrHostId;
  domApi.$setAttribute(hostElm, c.SSR_HOST_ID, attrId);
}


function ssrCommentComponentChild(domApi: d.DomApi, node: d.RenderNode, nodeType: number) {
  if (nodeType === c.NODE_TYPE.ElementNode) {
    const attrId = `${node.ssrComponentChildOfHostId}.${node.ssrComponentChildIndex}`;
    domApi.$setAttribute(node, c.SSR_CHILD_ID, attrId);

  } else if (nodeType === c.NODE_TYPE.TextNode && domApi.$getTextContent(node).trim() !== '') {
    const startCommentId = `${c.SSR_TEXT_NODE_COMMENT}.${node.ssrComponentChildOfHostId}.${node.ssrComponentChildIndex}`;
    const parentNode = domApi.$parentNode(node);

    const startComment = domApi.$createComment(startCommentId) as any;
    domApi.$insertBefore(parentNode, startComment, node);

    const endCommentId = `/${c.SSR_TEXT_NODE_COMMENT}`;
    const endComment = domApi.$createComment(endCommentId) as any;
    domApi.$insertBefore(parentNode, endComment, node.nextSibling);
  }
}


function ssrCommentLightDom(domApi: d.DomApi, node: d.RenderNode, nodeType: number) {
  if (nodeType === c.NODE_TYPE.ElementNode) {
    const attrId = `${node.ssrLightDomChildOfHostId}.${node.ssrLightDomIndex}`;
    domApi.$setAttribute(node, c.SSR_LIGHT_DOM_ATTR, attrId);

  } else if (nodeType === c.NODE_TYPE.TextNode && domApi.$getTextContent(node).trim() !== '') {
    const commentId = `${c.SSR_LIGHT_DOM_NODE_COMMENT}.${node.ssrLightDomChildOfHostId}.${node.ssrLightDomIndex}`;
    const parentNode = domApi.$parentNode(node);

    const startComment = domApi.$createComment(commentId) as any;
    domApi.$insertBefore(parentNode, startComment, node);
  }
}


function ssrCommentSlotRef(domApi: d.DomApi, elm: d.RenderNode) {
  let commentId = `${c.SSR_SLOT_NODE_COMMENT}.${elm.ssrSlotChildOfHostId}.${elm.ssrSlotChildIndex}`;

  if (elm['s-sn']) {
    commentId += '.' + elm['s-sn'];
  }

  const slotRefComment = domApi.$createComment(commentId) as any;
  domApi.$insertBefore(domApi.$parentNode(elm), slotRefComment, elm);

  domApi.$remove(elm);
}


function ssrCommentHostContentRef(domApi: d.DomApi, hostElm: d.RenderNode) {
  const commentId = `${c.SSR_CONTENT_REF_NODE_COMMENT}.${hostElm.ssrHostId}`;

  const contentRefComment = domApi.$createComment(commentId) as any;
  domApi.$insertBefore(hostElm, contentRefComment, hostElm['s-cr']);

  domApi.$remove(hostElm['s-cr']);

  hostElm['s-cr'] = contentRefComment;
  hostElm['s-cr']['s-cn'] = true;
}
