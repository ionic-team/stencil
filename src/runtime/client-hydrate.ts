import * as d from '../declarations';
import { HYDRATE_CHILD_ID, HYDRATE_HOST_ID, NODE_TYPE } from './runtime-constants';
import { toLowerCase } from '@utils';
import { BUILD } from '@build-conditionals';
import { getDoc } from '@platform';
import { convertScopedToShadow, registerStyle } from './styles';


export const initializeClientHydrate = (hostElm: d.HostElement, tagName: string, hydrateId: string, hostRef: d.HostRef) => {
  hostElm[HYDRATE_HOST_ID] = hydrateId;
  hostElm.removeAttribute(HYDRATE_HOST_ID);
  hostElm.classList.add('hydrated');

  clientHydrate(
    hostElm,
    hostElm.shadowRoot,
    hostElm,
    (hostRef.$vnode$ = { vtag: tagName, elm: hostElm }),
    hydrateId
  );
};


const clientHydrate = (hostElm: d.HostElement, shadowRoot: ShadowRoot, node: d.RenderNode, parentVNode: d.VNode, hydrateId: string) => {
  let previousComment: Comment;
  let childVNodeId: string;
  let childVNodeSplt: string[];
  let childVNode: d.VNode;

  if (node.nodeType === NODE_TYPE.ElementNode) {
    childVNodeId = (node as HTMLElement).getAttribute(HYDRATE_CHILD_ID);

    if (childVNodeId) {
      // split the start comment's data with a period
      childVNodeSplt = childVNodeId.split('.');

      // ensure this this element is a child element of the ssr vnode
      if (childVNodeSplt[0] === hydrateId) {
        // cool, this element is a child to the parent vnode
        node.removeAttribute(HYDRATE_CHILD_ID);

        childVNode = {
          vtag: toLowerCase(node.tagName),
          elm: node
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

        if (shadowRoot) {
          // ಠ‿ಠ
          node.remove();
          shadowRoot.appendChild(node);
        }
      }
    }

    if (node.shadowRoot && shadowRoot !== node.shadowRoot) {
      // keep drilling down through the shadow root nodes
      node.shadowRoot.childNodes.forEach(childShadowRootNode =>
        clientHydrate(hostElm, shadowRoot, childShadowRootNode as any, parentVNode, hydrateId));
    }

    // keep drilling down through the child nodes
    node.childNodes.forEach(childNode =>
      clientHydrate(hostElm, shadowRoot, childNode as any, parentVNode, hydrateId));

  } else if (node.nodeType === NODE_TYPE.CommentNode) {
    childVNodeSplt = node.nodeValue.split('.');

    if (childVNodeSplt[1] === hydrateId) {
      if (childVNodeSplt[0] === 's') {
        // slot node reference
        childVNode = {
          vtag: 'slot',
        };

        if (BUILD.shadowDom && shadowRoot) {
          childVNode.elm = getDoc(node).createElement('slot');
          node.parentNode.insertBefore(childVNode.elm, node);
          node.remove();

        } else if (BUILD.slotRelocation) {
          node['s-sr'] = true;
        }

        if (!parentVNode.vchildren) {
          parentVNode.vchildren = [];
        }
        parentVNode.vchildren[<any>childVNodeSplt[2]] = childVNode;

      } else if (childVNodeSplt[0] === 'r') {
        // content reference node for the host element
        if (BUILD.shadowDom && shadowRoot) {
          node.remove();

        } else if (BUILD.slotRelocation) {
          hostElm['s-cr'] = node;
          node['s-cn'] = true;
        }
      }
    }

  } else if (node.nodeType === NODE_TYPE.TextNode &&
            (previousComment = <Comment>node.previousSibling) &&
            previousComment.nodeType === NODE_TYPE.CommentNode) {

    // split the start comment's data with a period
    childVNodeSplt = previousComment.nodeValue.split('.');

    // ensure this is a hydrated text node start comment
    // which should start with an "t" and delimited by periods
    if (childVNodeSplt[0] === 't' && childVNodeSplt[1] === hydrateId) {
      previousComment.remove();
      if (node.nextSibling && node.nextSibling.nodeValue === '/') {
        (node.nextSibling as Comment).remove();
      }

      // cool, this is a text node and it's got a start comment
      childVNode = {
        vtext: node.textContent,
        elm: node
      };

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


export const convertToShadowCss = (styleElm: HTMLStyleElement) => {
  registerStyle(
    styleElm.getAttribute('h-id'),
    convertScopedToShadow(styleElm.innerHTML)
  );
  styleElm.remove();
};
