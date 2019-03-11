import * as d from '../declarations';
import { HYDRATE_CHILD_ID, NODE_TYPE } from './runtime-constants';
import { toLowerCase } from '@utils';
import { getDoc } from '@platform';


export const addChildVNodes = (hostElm: d.HostElement, node: d.RenderNode, parentVNode: d.VNode, hydrateId: string) => {
  const nodeType = node.nodeType;
  let previousComment: Comment;
  let childVNodeId: string;
  let childVNodeSplt: string[];
  let childVNode: d.HydrateVNode;

  if (nodeType === NODE_TYPE.ElementNode) {
    childVNodeId = (node as HTMLElement).getAttribute(HYDRATE_CHILD_ID);

    if (childVNodeId) {
      // split the start comment's data with a period
      childVNodeSplt = childVNodeId.split('.');

      // ensure this this element is a child element of the ssr vnode
      if (childVNodeSplt[0] === hydrateId) {
        // cool, this element is a child to the parent vnode
        childVNode = {
          vtag: toLowerCase(node.tagName),
          elm: node,
          hydrateFn() {
            node.removeAttribute(HYDRATE_CHILD_ID);
          }
        };

        // this is a new child vnode
        // so ensure its parent vnode has the vchildren array
        if (!parentVNode.vchildren) {
          parentVNode.vchildren = [];
        }

        // add our child vnode to a specific index of the vnode's children
        parentVNode.vchildren[<any>childVNodeSplt[1]] = childVNode;

        // this is now the new parent vnode for all the next child checks
        parentVNode = childVNode;
      }
    }

    // keep drilling down through the elements
    for (let i = 0; i < node.childNodes.length; i++) {
      addChildVNodes(hostElm, <any>node.childNodes[i], parentVNode, hydrateId);
    }

  } else if (nodeType === NODE_TYPE.CommentNode) {
    childVNodeSplt = node.nodeValue.split('.');

    if (childVNodeSplt[1] === hydrateId) {
      if (childVNodeSplt[0] === 's') {
        // slot node reference
        childVNode = {
          vtag: 'slot',
          hydrateFn(childVNode, useNativeShadowDom) {
            if (useNativeShadowDom) {
              childVNode.elm = getDoc(node).createElement('slot');
              node.parentNode.insertBefore(childVNode.elm, node);
              node.remove();
            } else {
              node['s-sr'] = true;
            }
          }
        };

        if (!parentVNode.vchildren) {
          parentVNode.vchildren = [];
        }
        parentVNode.vchildren[<any>childVNodeSplt[2]] = childVNode;

      } else if (childVNodeSplt[0] === 'r') {
        // content reference node for the host element
        hostElm['s-cr'] = node;
        node['s-cn'] = true;
      }
    }

  } else if (nodeType === NODE_TYPE.TextNode &&
            (previousComment = <Comment>node.previousSibling) &&
            previousComment.nodeType === NODE_TYPE.CommentNode) {

    // split the start comment's data with a period
    childVNodeSplt = previousComment.nodeValue.split('.');

    // ensure this is a hydrated text node start comment
    // which should start with an "t" and delimited by periods
    if (childVNodeSplt[0] === 't' && childVNodeSplt[1] === hydrateId) {
      // cool, this is a text node and it's got a start comment
      childVNode = {
        vtext: node.textContent,
        elm: node,
        hydrateFn() {
          previousComment.remove();
          if (node.nextSibling && node.nextSibling.nodeValue === '/') {
            (node.nextSibling as Comment).remove();
          }
        }
      } as d.VNode;

      // this is a new child vnode
      // so ensure its parent vnode has the vchildren array
      if (!parentVNode.vchildren) {
        parentVNode.vchildren = [];
      }

      // add our child vnode to a specific index of the vnode's children
      parentVNode.vchildren[<any>childVNodeSplt[2]] = childVNode;
    }
  }
};
