import * as d from '../declarations';
import { BUILD } from '@build-conditionals';
import { CONTENT_REF_ID, HYDRATE_CHILD_ID, HYDRATE_ID, NODE_TYPE, ORG_LOCATION_ID, SLOT_NODE_ID, TEXT_NODE_ID } from './runtime-constants';
import { getDoc, plt } from '@platform';
import { toLowerCase } from '@utils';


export const initializeClientHydrate = (hostElm: d.HostElement, tagName: string, hostId: string, hostRef: d.HostRef) => {
  const shadowRoot = hostElm.shadowRoot;
  const childRenderNodes: RenderNodeData[] = [];
  const slotNodes: RenderNodeData[] = [];
  const shadowRootNodes: d.RenderNode[] = (BUILD.shadowDom && shadowRoot ? [] : null);
  const vnode: d.VNode = hostRef.$vnode$ = {
    $flags$: 0,
    $tag$: tagName
  };

  if (!plt.$orgLocNodes$) {
    initializeDocumentHydrate(getDoc(hostElm).body, plt.$orgLocNodes$ = new Map());
  }

  hostElm[HYDRATE_ID] = hostId;
  hostElm.removeAttribute(HYDRATE_ID);

  clientHydrate(vnode, childRenderNodes, slotNodes, shadowRootNodes, hostElm, hostElm, hostId);

  childRenderNodes.forEach(c => {
    const orgLocationId = c.$hostId$ + '.' + c.$nodeId$;
    const orgLocationNode = plt.$orgLocNodes$.get(orgLocationId);
    const node = c.$elm$ as d.RenderNode;

    if (orgLocationNode && c.$hostId$ === '0') {
      orgLocationNode.parentNode.insertBefore(
        node,
        orgLocationNode.nextSibling
      );
    }

    if (!shadowRoot) {
      node['s-hn'] = tagName;

      if (orgLocationNode) {
        node['s-ol'] = orgLocationNode;
        node['s-ol']['s-nr'] = node;
      }
    }

    plt.$orgLocNodes$.delete(orgLocationId);
  });

  if (BUILD.shadowDom && shadowRoot) {
    shadowRootNodes.forEach(shadowRootNode => {
      if (shadowRootNode) {
        shadowRoot.appendChild(shadowRootNode as any);
      }
    });
  }
};

const clientHydrate = (
  parentVNode: d.VNode,
  childRenderNodes: RenderNodeData[],
  slotNodes: RenderNodeData[],
  shadowRootNodes: d.RenderNode[],
  hostElm: d.HostElement,
  node: d.RenderNode,
  hostId: string
) => {
  let childNodeType: string;
  let childIdSplt: string[];
  let childVNode: RenderNodeData;

  if (node.nodeType === NODE_TYPE.ElementNode) {

    childNodeType = (node as HTMLElement).getAttribute(HYDRATE_CHILD_ID);
    if (childNodeType) {
      // got the node data from the element's attribute
      // `${hostId}.${nodeId}.${depth}.${index}`
      childIdSplt = childNodeType.split('.');

      if (childIdSplt[0] === hostId || childIdSplt[0] === '0') {
        childVNode = {
          $flags$: 0,
          $hostId$: childIdSplt[0],
          $nodeId$: childIdSplt[1],
          $depth$: childIdSplt[2],
          $index$: childIdSplt[3],
          $tag$: toLowerCase(node.tagName),
          $elm$: node
        };

        childRenderNodes.push(childVNode);
        node.removeAttribute(HYDRATE_CHILD_ID);

        // this is a new child vnode
        // so ensure its parent vnode has the vchildren array
        if (!parentVNode.$children$) {
          parentVNode.$children$ = [];
        }

        // add our child vnode to a specific index of the vnode's children
        parentVNode.$children$[childVNode.$index$ as any] = childVNode;

        // this is now the new parent vnode for all the next child checks
        parentVNode = childVNode;

        if (shadowRootNodes && childVNode.$depth$ === '0') {
          shadowRootNodes[childVNode.$index$ as any] = childVNode.$elm$;
        }
      }
    }

    // recursively drill down, end to start so we can remove nodes
    let i = node.childNodes.length - 1;
    for (; i >= 0; i--) {
      clientHydrate(parentVNode, childRenderNodes, slotNodes, shadowRootNodes, hostElm, node.childNodes[i] as any, hostId);
    }

    if (node.shadowRoot) {
      // keep drilling down through the shadow root nodes
      for (i = node.shadowRoot.childNodes.length - 1; i >= 0; i--) {
        clientHydrate(parentVNode, childRenderNodes, slotNodes, shadowRootNodes, hostElm, node.shadowRoot.childNodes[i] as any, hostId);
      }
    }

  } else if (node.nodeType === NODE_TYPE.CommentNode) {
    // `${COMMENT_TYPE}.${hostId}.${nodeId}.${depth}.${index}`
    childIdSplt = node.nodeValue.split('.');

    if (childIdSplt[1] === hostId || childIdSplt[1] === '0') {
      // comment node for either the host id or a 0 host id
      childNodeType = childIdSplt[0];

      childVNode = {
        $flags$: 0,
        $hostId$: childIdSplt[1],
        $nodeId$: childIdSplt[2],
        $depth$: childIdSplt[3],
        $index$: childIdSplt[4],
        $elm$: node
      };

      if (childNodeType === TEXT_NODE_ID) {
        childVNode.$elm$ = node.nextSibling as any;
        if (childVNode.$elm$ && childVNode.$elm$.nodeType === NODE_TYPE.TextNode) {
          childRenderNodes.push(childVNode);

          // remove the text comment since it's no longer needed
          node.remove();

          if (!parentVNode.$children$) {
            parentVNode.$children$ = [];
          }
          parentVNode.$children$[childVNode.$index$ as any] = childVNode;

          if (shadowRootNodes && childVNode.$depth$ === '0') {
            shadowRootNodes[childVNode.$index$ as any] = childVNode.$elm$;
          }
        }

      } else if (childVNode.$hostId$ === hostId) {
        // this comment node is specifcally for this host id

        if (childNodeType === SLOT_NODE_ID) {
          // `${SLOT_NODE_ID}.${hostId}.${nodeId}.${depth}.${index}.${slotName}`;
          childVNode.$tag$ = 'slot';

          if (childIdSplt[5]) {
            node['s-sn'] = childVNode.$name$ = childIdSplt[5];
          } else {
            node['s-sn'] = '';
          }
          node['s-sr'] = true;

          if (BUILD.shadowDom && shadowRootNodes) {
            // browser support shadowRoot and this is a shadow dom component
            // create an actual slot element
            childVNode.$elm$ = getDoc(node).createElement(childVNode.$tag$);

            if (childVNode.$name$) {
              // add the slot name attribute
              childVNode.$elm$.setAttribute('name', childVNode.$name$);
            }

            // insert the new slot element before the slot comment
            node.parentNode.insertBefore(childVNode.$elm$, node);

            // remove the slot comment since it's not needed for shadow
            node.remove();

            if (childVNode.$depth$ === '0') {
              shadowRootNodes[childVNode.$index$ as any] = childVNode.$elm$;
            }
          }

          slotNodes.push(childVNode);

          if (!parentVNode.$children$) {
            parentVNode.$children$ = [];
          }
          parentVNode.$children$[childVNode.$index$ as any] = childVNode;

        } else if (childNodeType === CONTENT_REF_ID) {
          // `${CONTENT_REF_ID}.${hostId}`;
          if (BUILD.shadowDom && shadowRootNodes) {
            // remove the content ref comment since it's not needed for shadow
            node.remove();

          } else if (BUILD.slotRelocation) {
            hostElm['s-cr'] = node;
            node['s-cn'] = true;
          }
        }
      }
    }
  }
};


export const initializeDocumentHydrate = (node: d.HostElement, rootOriginalLocations: Map<string, any>) => {
  if (node.nodeType === NODE_TYPE.ElementNode) {
    let i = 0;
    for (; i < node.childNodes.length; i++) {
      initializeDocumentHydrate(node.childNodes[i] as any, rootOriginalLocations);
    }
    if (node.shadowRoot) {
      for (i = 0; i < node.shadowRoot.childNodes.length; i++) {
        initializeDocumentHydrate(node.shadowRoot.childNodes[i] as any, rootOriginalLocations);
      }
    }

  } else if (node.nodeType === NODE_TYPE.CommentNode) {
    const childIdSplt = node.nodeValue.split('.');
    if (childIdSplt[0] === ORG_LOCATION_ID) {
      rootOriginalLocations.set(childIdSplt[1] + '.' + childIdSplt[2], node);
      node.nodeValue = '';
    }
  }
};


interface RenderNodeData extends d.VNode {
  $hostId$: string;
  $nodeId$: string;
  $depth$: string;
  $index$: string;
}
