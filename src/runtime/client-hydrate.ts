import * as d from '../declarations';
import { BUILD } from '@build-conditionals';
import { CONTENT_REF_ID, HYDRATE_CHILD_ID, HYDRATE_HOST_ID, NODE_TYPE, ORG_LOCATION_ID, SLOT_NODE_ID, TEXT_NODE_ID } from './runtime-constants';
import { convertScopedToShadow, registerStyle } from './styles';
import { getDoc } from '@platform';
import { toLowerCase } from '@utils';


export const initializeClientHydrate = (hostElm: d.HostElement, tagName: string, hydrateId: string, hostRef: d.HostRef) => {
  const rootNodes: Element[] = [];
  const removeNodes: Element[] = [];
  const orgLocationRefs = new Map<string, d.RenderNode>();
  const shadowRoot = hostElm.shadowRoot;

  hostElm[HYDRATE_HOST_ID] = hydrateId;
  hostElm.removeAttribute(HYDRATE_HOST_ID);
  hostElm.classList.add('hydrated');

  clientHydrate(
    hostElm,
    tagName,
    shadowRoot,
    hostElm,
    (hostRef.$vnode$ = { $flags$: 0, $tag$: tagName, $elm$: hostElm }),
    hydrateId,
    false,
    rootNodes,
    orgLocationRefs,
    removeNodes
  );

  rootNodes.forEach(rootNode => {
    if (rootNode) {
      if (BUILD.shadowDom && shadowRoot) {
        shadowRoot.appendChild(rootNode);
      } else {
        hostElm.appendChild(rootNode);
      }
    }
  });

  removeNodes.forEach(removeNode => removeNode.remove());
};


const clientHydrate = (hostElm: d.HostElement, tagName: string, shadowRoot: ShadowRoot, node: d.RenderNode, parentVNode: d.VNode, hydrateId: string, withinComponentShadow: boolean, rootNodes: Node[], orgLocationRefs: Map<string, d.RenderNode>, removeNodes: Node[]) => {
  let previousComment: Comment;
  let childVNodeId: string;
  let childVNodeSplt: string[];
  let childVNode: d.VNode;
  let orgLocationNode: d.RenderNode;

  if (node.nodeType === NODE_TYPE.ElementNode) {
    childVNodeId = (node as HTMLElement).getAttribute(HYDRATE_CHILD_ID);

    if (childVNodeId) {
      // split the start comment's data with a period
      // `${hostId}.${depth}.${index}`;
      childVNodeSplt = childVNodeId.split('.');

      // ensure this this element is a child element of the ssr vnode
      if (childVNodeSplt[0] === hydrateId) {
        // cool, this element is a child to the parent vnode
        node.removeAttribute(HYDRATE_CHILD_ID);
        node['s-hn'] = tagName;

        orgLocationNode = orgLocationRefs.get(childVNodeId);
        if (orgLocationNode) {
          node['s-ol'] = orgLocationNode;
          node['s-ol']['s-nr'] = node;
        }

        childVNode = {
          $flags$: 0,
          $tag$: toLowerCase(node.tagName),
          $elm$: node
        };

        // this is a new child vnode
        // so ensure its parent vnode has the vchildren array
        if (!parentVNode.$children$) {
          parentVNode.$children$ = [];
        }

        // add our child vnode to a specific index of the vnode's children
        parentVNode.$children$[<any>childVNodeSplt[2]] = childVNode;

        // this is now the new parent vnode for all the next child checks
        parentVNode = childVNode;

        if (BUILD.shadowDom && shadowRoot && childVNodeSplt[1] === '0') {
          rootNodes[childVNodeSplt[2] as any] = node;
        }
      }
    }

    if (node.shadowRoot) {
      // keep drilling down through the shadow root nodes
      node.shadowRoot.childNodes.forEach(childShadowRootNode =>
        clientHydrate(hostElm, tagName, shadowRoot, childShadowRootNode as any, parentVNode, hydrateId, withinComponentShadow, rootNodes, orgLocationRefs, removeNodes));
    }

    // keep drilling down through the child nodes
    node.childNodes.forEach(childNode =>
      clientHydrate(hostElm, tagName, shadowRoot, childNode as any, parentVNode, hydrateId, withinComponentShadow, rootNodes, orgLocationRefs, removeNodes));

  } else if (node.nodeType === NODE_TYPE.CommentNode) {
    childVNodeSplt = node.nodeValue.split('.');

    if (childVNodeSplt[1] === hydrateId) {
      node['s-hn'] = tagName;

      if (childVNodeSplt[0] === SLOT_NODE_ID) {
        // slot node reference
        // `${SLOT_NODE_ID}.${hostId}.${depth}.${index}.${(childElm['s-sn'] || '')}`;
        childVNode = {
          $flags$: 0,
          $tag$: 'slot'
        };

        if (childVNodeSplt[4]) {
          node['s-sn'] = childVNode.$name$ = childVNodeSplt[4];
        } else {
          node['s-sn'] = '';
        }

        if (BUILD.shadowDom && shadowRoot && childVNodeSplt[2] === '0') {
          childVNode.$elm$ = getDoc(node).createElement('slot');
          rootNodes[<any>childVNodeSplt[3]] = childVNode.$elm$;
          removeNodes.push(node);

        } else if (BUILD.slotRelocation) {
          childVNode.$elm$ = node;
          node['s-sr'] = true;
        }

        if (!parentVNode.$children$) {
          parentVNode.$children$ = [];
        }
        parentVNode.$children$[<any>childVNodeSplt[3]] = childVNode;

      } else if (childVNodeSplt[0] === CONTENT_REF_ID) {
        // content reference node for the host element
        if (BUILD.shadowDom && shadowRoot) {
          removeNodes.push(node);

        } else if (BUILD.slotRelocation) {
          hostElm['s-cr'] = node;
          node['s-cn'] = true;
        }

      } else if (childVNodeSplt[0] === ORG_LOCATION_ID) {
        // `${ORG_LOCATION_ID}.${hostId}.${depth}.${index}`;
        orgLocationRefs.set(childVNodeSplt.slice(1).join('.'), node);
      }
    }

  } else if (node.nodeType === NODE_TYPE.TextNode &&
            (previousComment = <Comment>node.previousSibling) &&
            previousComment.nodeType === NODE_TYPE.CommentNode) {

    // split the start comment's data with a period
    childVNodeId = previousComment.nodeValue;
    childVNodeSplt = childVNodeId.split('.');

    // ensure this is a hydrated text node start comment
    // which should start with an "t" and delimited by periods
    if (childVNodeSplt[0] === TEXT_NODE_ID && childVNodeSplt[1] === hydrateId) {
      // `${TEXT_NODE_ID}.${hostId}.${depth}.${index}`;
      node['s-hn'] = tagName;
      removeNodes.push(previousComment);

      orgLocationNode = orgLocationRefs.get(childVNodeId.replace(TEXT_NODE_ID + '.', ''));
      if (orgLocationNode) {
        node['s-ol'] = orgLocationNode;
        node['s-ol']['s-nr'] = node;
      }

      // cool, this is a text node and it's got a start comment
      childVNode = {
        $flags$: 0,
        $text$: node.textContent,
        $elm$: node
      };

      if (BUILD.shadowDom && shadowRoot && childVNodeSplt[2] === '0') {
        rootNodes[childVNodeSplt[3] as any] = node;
      }

      // this is a new child vnode
      // so ensure its parent vnode has the vchildren array
      if (!parentVNode.$children$) {
        parentVNode.$children$ = [];
      }

      // add our child vnode to a specific index of the vnode's children
      parentVNode.$children$[<any>childVNodeSplt[3]] = childVNode;
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
