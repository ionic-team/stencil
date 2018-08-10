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

  if (node.ssrIsLightDomElm) {
    ssrCommentLightDomElm(domApi, node);
  }

  if (node.ssrIsLightDomText) {
    ssrCommentLightDomText(domApi, node);
  }

  if (node.ssrIsCmpChildElm) {
    ssrCommentCmpChildElm(domApi, node);
  }

  if (node.ssrIsCmpChildText) {
    ssrCommentCmpChildText(domApi, node);
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


function ssrCommentLightDomElm(domApi: d.DomApi, node: d.RenderNode) {
  const attrId = `${node.ssrLightDomElmHostId}.${node.ssrLightDomElmIndex}`;
  domApi.$setAttribute(node, c.SSR_LIGHT_DOM_ATTR, attrId);
}


function ssrCommentLightDomText(domApi: d.DomApi, node: d.RenderNode) {
  if (domApi.$getTextContent(node).trim() === '') {
    return;
  }

  const parentNode = domApi.$parentNode(node) as d.RenderNode;

  const startCommentId = `${c.SSR_LIGHT_DOM_NODE_COMMENT}.${node.ssrLightDomTextHostId}.${node.ssrLightDomTextIndex}`;

  const startComment = domApi.$createComment(startCommentId) as any;
  domApi.$insertBefore(parentNode, startComment, node);
}


function ssrCommentCmpChildElm(domApi: d.DomApi, node: d.RenderNode) {
  let attrId = `${node.ssrCmpChildElmHostId}.${node.ssrCmpChildElmIndex}`;

  if (node.ssrIsLastCmpChildElm) {
    attrId += `.`;

    if (node.ssrHasLastCmpChildText) {
      node.ssrHasLastCmpChildText = false;
      const childNodes = domApi.$childNodes(node);
      if (childNodes.length === 1) {
        if (domApi.$nodeType(childNodes[0]) === c.NODE_TYPE.TextNode) {
          attrId += `t`;
          node.ssrHasLastCmpChildText = true;
        }
      }
    }
  }

  domApi.$setAttribute(node, c.SSR_CHILD_ID, attrId);
}


function ssrCommentCmpChildText(domApi: d.DomApi, node: d.RenderNode) {
  const parentNode = domApi.$parentNode(node) as d.RenderNode;

  if (parentNode.ssrHasLastCmpChildText) {
    return;
  }

  const startCommentId = `${c.SSR_TEXT_NODE_COMMENT}.${node.ssrCmpChildTextHostId}.${node.ssrCmpChildTextIndex}`;

  const startComment = domApi.$createComment(startCommentId) as any;
  domApi.$insertBefore(parentNode, startComment, node);

  const endComment = domApi.$createComment(c.SSR_TEXT_NODE_COMMENT_END) as any;
  domApi.$insertBefore(parentNode, endComment, node.nextSibling);
}


function ssrCommentSlotRef(domApi: d.DomApi, elm: d.RenderNode) {
  let commentId = `${c.SSR_SLOT_NODE_COMMENT}.${elm.ssrSlotHostId}.${elm.ssrSlotIndex}`;

  if (elm['s-sn']) {
    commentId += '.' + elm['s-sn'];
  }

  const slotRefComment = domApi.$createComment(commentId) as any;
  domApi.$insertBefore(domApi.$parentNode(elm), slotRefComment, elm);

  domApi.$remove(elm);
}
