import * as d from '../declarations';
import * as c from '../util/constants';


export function ssrComment(domApi: d.DomApi, node: d.RenderNode) {
  const nodeType = domApi.$nodeType(node);

  if (node.ssrIsHost) {
    ssrCommentHostElement(domApi, node);
  }

  if (node.ssrIsOriginalLocRef) {
    ssrCommentOriginalLocationRef(domApi, node);
  }

  if ((nodeType === c.NODE_TYPE.TextNode && node.ssrIsLightDom) || node.ssrIsCmpText) {
    ssrCommentTextChild(domApi, node);

  } else if (node.ssrIsLightDom) {
    ssrCommentLightDomElm(domApi, node);
  }

  if (node.ssrIsCmpElm) {
    ssrCommentCmpElmChild(domApi, node);
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
  let attrId = hostElm.ssrHostId + '';

  if (hostElm.ssrHostEncapsulation === c.ENCAPSULATION.ShadowDom) {
    attrId = c.SSR_SHADOW_DOM_HOST_ID + attrId;
  }

  domApi.$setAttribute(hostElm, c.SSR_HOST_ID, attrId);
}


function ssrCommentHostContentRef(domApi: d.DomApi, hostElm: d.RenderNode) {
  const commentId = `${c.SSR_CONTENT_REF_NODE_COMMENT}.${hostElm.ssrHostId}`;

  const contentRefComment = domApi.$createComment(commentId) as any;
  domApi.$insertBefore(hostElm, contentRefComment, hostElm['s-cr']);

  domApi.$remove(hostElm['s-cr']);

  hostElm['s-cr'] = contentRefComment;
  hostElm['s-cr']['s-cn'] = true;
}


function ssrCommentOriginalLocationRef(domApi: d.DomApi, elm: d.RenderNode) {
  const commentId = `${c.SSR_ORIGINAL_LOCATION_NODE_COMMENT}.${elm.ssrOrgignalLocLightDomId}`;

  const orgLocRefComment = domApi.$createComment(commentId) as any;
  domApi.$insertBefore(domApi.$parentNode(elm), orgLocRefComment, elm);

  domApi.$remove(elm);
}


function ssrCommentCmpElmChild(domApi: d.DomApi, node: d.RenderNode) {
  const attrId = `${node.ssrCmpElmChildOfHostId}.${node.ssrCmpElmChildIndex}`;
  domApi.$setAttribute(node, c.SSR_CHILD_ID, attrId);
}


function ssrCommentTextChild(domApi: d.DomApi, node: d.RenderNode) {
  const ssrCmpTextChildOfHostId = typeof node.ssrCmpTextChildOfHostId === 'number' ? node.ssrCmpTextChildOfHostId : '';
  const ssrCmpTextChildIndex = typeof node.ssrCmpTextChildIndex === 'number' ? node.ssrCmpTextChildIndex : '';

  let startCommentId = `${c.SSR_TEXT_NODE_COMMENT}.${ssrCmpTextChildOfHostId}.${ssrCmpTextChildIndex}`;

  if (node.ssrIsLightDom) {
    if (domApi.$getTextContent(node).trim() === '') {
      return;
    }
    startCommentId += `.${node.ssrLightDomChildOfHostId}.${node.ssrLightDomIndex}`;
  }

  const parentNode = domApi.$parentNode(node);

  const startComment = domApi.$createComment(startCommentId) as any;
  domApi.$insertBefore(parentNode, startComment, node);

  const endCommentId = `/${c.SSR_TEXT_NODE_COMMENT}`;
  const endComment = domApi.$createComment(endCommentId) as any;
  domApi.$insertBefore(parentNode, endComment, node.nextSibling);
}


function ssrCommentLightDomElm(domApi: d.DomApi, node: d.RenderNode) {
  const attrId = `${node.ssrLightDomChildOfHostId}.${node.ssrLightDomIndex}`;
  domApi.$setAttribute(node, c.SSR_LIGHT_DOM_ATTR, attrId);
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
