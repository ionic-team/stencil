import { BUILD } from '@app-data';
import { doc, plt } from '@platform';

import type * as d from '../declarations';
import { createTime } from './profile';
import {
  CONTENT_REF_ID,
  HYDRATED_SLOT_FALLBACK_ID,
  HYDRATE_CHILD_ID,
  HYDRATE_ID,
  NODE_TYPE,
  ORG_LOCATION_ID,
  SLOT_NODE_ID,
  TEXT_NODE_ID,
} from './runtime-constants';
import { newVNode } from './vdom/h';
import { addSlotRelocateNode, patchNextPrev } from './dom-extras';

interface RenderNodeData extends d.VNode {
  $hostId$: string;
  $nodeId$: string;
  $depth$: string;
  $index$: string;
}

type SlottedNodes = Array<{ slot: d.RenderNode; node: d.RenderNode; hostId: string }>;

/**
 * Takes an SSR rendered document, as annotated by 'vdom-annotations.ts' and:
 * 1) Recreate an accurate VDOM tree to reconcile with during 'vdom-render.ts'
 *    (a failure to do so will result in DOM nodes being duplicated when rendering)
 * 2) Add `shadow: true` DOM trees to their document-fragment
 * 3) Move slotted nodes out of shadowDOMs
 * 4) Add meta nodes to non-shadow DOMs and their 'slotted' nodes
 *
 * @param hostElm - the current custom element being hydrated
 * @param tagName - the custom element's tag
 * @param hostId - a unique custom element id
 * @param hostRef - the VNode representing this custom element
 */
export const initializeClientHydrate = (
  hostElm: d.HostElement,
  tagName: string,
  hostId: string,
  hostRef: d.HostRef
) => {
  const endHydrate = createTime('hydrateClient', tagName);
  const shadowRoot = hostElm.shadowRoot;
  const childRenderNodes: RenderNodeData[] = [];
  const slotNodes: RenderNodeData[] = [];
  const slottedNodes: SlottedNodes[] = [];
  const shadowRootNodes: d.RenderNode[] = BUILD.shadowDom && shadowRoot ? [] : null;
  let vnode: d.VNode = newVNode(tagName, null);
  vnode.$elm$ = hostElm;

  if (!plt.$orgLocNodes$) {
    // this is the first pass over of this whole document
    // does a quick scrape to construct a 'bare-bones' tree of
    // what elements we have and where content has been moved from
    initializeDocumentHydrate(doc.body, (plt.$orgLocNodes$ = new Map()));
  }

  hostElm[HYDRATE_ID] = hostId;
  hostElm.removeAttribute(HYDRATE_ID);

  hostRef.$vnode$ = clientHydrate(
    vnode,
    childRenderNodes,
    slotNodes,
    shadowRootNodes,
    hostElm,
    hostElm,
    hostId,
    slottedNodes
  );

  let crIndex = 0;
  const crLength = childRenderNodes.length;
  let childRenderNode: RenderNodeData;

  // Steps through childNodes we found.
  // If moved from an original location (by nature of being rendered in SSR markup)
  // we might be able to move it back there now,
  // so slotted nodes don't get added to internal shadowDOMs
  for (crIndex; crIndex < crLength; crIndex++) {
    childRenderNode = childRenderNodes[crIndex];

    const orgLocationId = childRenderNode.$hostId$ + '.' + childRenderNode.$nodeId$;
    const orgLocationNode = plt.$orgLocNodes$.get(orgLocationId);
    const node = childRenderNode.$elm$ as d.RenderNode;

    if (!shadowRoot) {
      node['s-hn'] = tagName.toUpperCase();

      if (childRenderNode.$tag$ === 'slot') {
        // if this is a 'mock slot'
        // add it's content position reference now.
        // otherwise vdom-render will try to add nodes to it
        // (it's a comment node so will error)
        node['s-cr'] = hostElm['s-cr'];
      }
    }

    if (orgLocationNode && orgLocationNode.isConnected) {
      if (shadowRoot && orgLocationNode['s-en'] === '') {
        // if this node is within a shadowDOM, with an original location home
        // we're safe to move it now
        orgLocationNode.parentNode.insertBefore(node, orgLocationNode.nextSibling);
      }
      // Remove original location comment now regardless:
      // 1) Stops SSR frameworks complaining about mismatches
      // 2) is un-required for non-shadow, slotted nodes as
      //    we'll add all the meta nodes we need when we deal with *all* slotted nodes ↓↓↓
      orgLocationNode.parentNode.removeChild(orgLocationNode);
    }
    // remove the original location from the map
    plt.$orgLocNodes$.delete(orgLocationId);
  }

  const hosts: d.HostElement[] = [];
  let snIndex = 0;
  const snLen = slottedNodes.length;
  let slotGroup: SlottedNodes;
  let snGroupIdx: number;
  let snGroupLen: number;
  let slottedItem: SlottedNodes[0];

  // Loops through all the slotted nodes we found while
  // stepping through this component
  //
  for (snIndex; snIndex < snLen; snIndex++) {
    slotGroup = slottedNodes[snIndex];

    if (!slotGroup || !slotGroup.length) continue;

    snGroupLen = slotGroup.length;
    snGroupIdx = 0;

    for (snGroupIdx; snGroupIdx < snGroupLen; snGroupIdx++) {
      slottedItem = slotGroup[snGroupIdx];

      if (!hosts[slottedItem.hostId as any]) {
        // cache this host for other grouped slotted nodes
        hosts[slottedItem.hostId as any] = plt.$orgLocNodes$.get(slottedItem.hostId);
      }
      // this shouldn't happen
      // as we collect all the custom elements first in `initializeDocumentHydrate`
      if (!hosts[slottedItem.hostId as any]) continue;

      // if (slottedItem.node['s-ol']) {
      //   // see if we've found this node's parent host before
      //   // (within orgLocNodes)
      //   hosts[slottedItem.hostId as any] = slottedItem.node['s-ol'].parentElement;
      //   // remove it now, we'll recreate with a text node in a minute
      //   // to tidy up the DOM
      //   slottedItem.node['s-ol'].remove();
      // }

      const hostEle = hosts[slottedItem.hostId as any];

      // this node is either slotted in a non-shadow host, OR
      // *that* host is nested in a non-shadow host
      if (!hostEle.shadowRoot || !shadowRoot) {
        // try to set an appropriate content position reference
        // (CR) node for this host element

        // a CR already set on the host?
        slottedItem.slot['s-cr'] = hostEle['s-cr'];

        if (!slottedItem.slot['s-cr'] && hostEle.shadowRoot) {
          // host is shadowDOM - just use the host itself as the CR for native slotting
          slottedItem.slot['s-cr'] = hostEle;
        } else {
          // if all else fails - just set the CR as the first child
          // (9/10 if node['s-cr'] hasn't been set, the node will be at the element root)
          const hostChildren = hostEle.__childNodes || hostEle.childNodes;
          slottedItem.slot['s-cr'] = hostChildren[0] as d.RenderNode;
        }
        // create our original location node
        addSlotRelocateNode(slottedItem.node, slottedItem.slot);

        // patch this node for accessors like `nextSibling` (et al)
        patchNextPrev(slottedItem.node);
      }

      if (hostEle.shadowRoot) {
        // shadowDOM - move the item to the element root for
        // native slotting
        hostEle.appendChild(slottedItem.node);
      }
    }
  }

  if (BUILD.shadowDom && shadowRoot) {
    // add all the root nodes in the shadowDOM
    // (a root node can have a whole nested DOM tree)
    let rnIdex = 0;
    const rnLen = shadowRootNodes.length;
    for (rnIdex; rnIdex < rnLen; rnIdex++) {
      shadowRoot.appendChild(shadowRootNodes[rnIdex] as any);
    }

    // tidy up left-over / unnecessary comments to stop
    // frameworks complaining about DOM mismatches
    Array.from(hostElm.childNodes).forEach((node) => {
      if (node.nodeType === NODE_TYPE.CommentNode && typeof (node as d.RenderNode)['s-sn'] !== 'string') {
        node.parentNode.removeChild(node);
      }
    });
  }

  hostRef.$hostElement$ = hostElm;
  endHydrate();
};

/**
 * Recursively step through a nodes' SSR DOM.
 * Constructs a VDOM. Finds and adds nodes to master arrays
 * (`childRenderNodes`, `shadowRootNodes` and `slottedNodes`)
 * these are used later for special consideration:
 * - Add `shadow: true` DOM trees to their document-fragment
 * - Move slotted nodes out of shadowDOMs
 * - Add meta nodes to non-shadow DOMs and their 'slotted' nodes
 * @param parentVNode - this nodes current parent vnode
 * @param childRenderNodes - flat array of all child vnodes
 * @param slotNodes - nodes that represent an element's `<slot />`s
 * @param shadowRootNodes - nodes that are at the root of this hydrating element
 * @param hostElm - the root, hydrating element
 * @param node - the node currently being iterated over
 * @param hostId - the root, hydrating element id
 * @param slottedNodes - nodes that have been slotted
 * @returns - the constructed VNode
 */
const clientHydrate = (
  parentVNode: d.VNode,
  childRenderNodes: RenderNodeData[],
  slotNodes: RenderNodeData[],
  shadowRootNodes: d.RenderNode[],
  hostElm: d.HostElement,
  node: d.RenderNode,
  hostId: string,
  slottedNodes: SlottedNodes[] = []
) => {
  let childNodeType: string;
  let childIdSplt: string[];
  let childVNode: RenderNodeData;
  let i: number;
  const scopeId = hostElm['s-sc'];

  if (node.nodeType === NODE_TYPE.ElementNode) {
    childNodeType = (node as HTMLElement).getAttribute(HYDRATE_CHILD_ID);
    if (childNodeType) {
      // got the node data from the element's attribute
      // `${hostId}.${nodeId}.${depth}.${index}`
      childIdSplt = childNodeType.split('.');

      if (childIdSplt[0] === hostId || childIdSplt[0] === '0') {
        childVNode = createSimpleVNode({
          $hostId$: childIdSplt[0],
          $nodeId$: childIdSplt[1],
          $depth$: childIdSplt[2],
          $index$: childIdSplt[3],
          $tag$: node.tagName.toLowerCase(),
          $elm$: node,
          // if we don't add the initial classes to the VNode,
          // the first vdom-render patch / reconciliation will fail;
          // any client side change before componentDidLoad will be ignored,
          // `setAccessor` will just take the element's initial classes
          $attrs$: { class: node.className },
        });

        childRenderNodes.push(childVNode);
        node.removeAttribute(HYDRATE_CHILD_ID);

        // this is a new child vnode
        // so ensure it's parent vnode has the vchildren array
        if (!parentVNode.$children$) {
          parentVNode.$children$ = [];
        }

        // test if this element was 'slotted'
        // recreate node attributes
        const slotName = childVNode.$elm$.getAttribute('s-sn');
        if (typeof slotName === 'string') {
          childVNode.$elm$['s-sn'] = slotName;
          childVNode.$elm$.removeAttribute('s-sn');
        }

        // test if this node is the child (a slot fallback node) of a slot
        const slotFbId = childVNode.$elm$.getAttribute(HYDRATED_SLOT_FALLBACK_ID);
        if (slotFbId) {
          childVNode.$elm$.removeAttribute(HYDRATED_SLOT_FALLBACK_ID);
          // find the relevant slot node
          const slotNode = slotNodes.find(
            (slot) =>
              (slot.$elm$.nodeType === NODE_TYPE.CommentNode && slot.$elm$.nodeValue === slotFbId) ||
              (slot.$elm$.tagName === 'SLOT' && slot.$elm$.name === childVNode.$elm$['s-sn'])
          );
          // add the relationship to the VDOM to stop re-renders
          if (slotNode) {
            childVNode.$elm$['s-sf'] = true;
            slotNode.$children$ = slotNode.$children$ || [];
            slotNode.$children$[childVNode.$index$ as any] = childVNode;
          }
        } else if (childVNode.$index$ !== undefined) {
          // add our child vnode to a specific index of the vnode's children
          parentVNode.$children$[childVNode.$index$ as any] = childVNode;
        }

        // host is `scoped: true` - add that flag to child.
        // used in 'setAccessor' to make sure our scoped class is present
        if (scopeId) node['s-si'] = scopeId;

        // this is now the new parent vnode for all the next child checks
        parentVNode = childVNode;

        if (
          shadowRootNodes &&
          childVNode.$depth$ === '0' &&
          // don't move slot fallback node into the root nodes array
          // they'll be moved into a new slot element ↓↓↓
          !slotFbId
        ) {
          shadowRootNodes[childVNode.$index$ as any] = childVNode.$elm$;
        }
      }
    }

    // recursively drill down, end to start so we can
    // construct a VDOM and add meta to nodes
    const nonShadowChildNodes = node.__childNodes || node.childNodes;
    for (i = nonShadowChildNodes.length - 1; i >= 0; i--) {
      clientHydrate(
        parentVNode,
        childRenderNodes,
        slotNodes,
        shadowRootNodes,
        hostElm,
        nonShadowChildNodes[i] as any,
        hostId,
        slottedNodes
      );
    }

    if (node.shadowRoot) {
      // keep drilling down through the shadow root nodes
      for (i = node.shadowRoot.childNodes.length - 1; i >= 0; i--) {
        clientHydrate(
          parentVNode,
          childRenderNodes,
          slotNodes,
          shadowRootNodes,
          hostElm,
          node.shadowRoot.childNodes[i] as any,
          hostId,
          slottedNodes
        );
      }
    }
  } else if (node.nodeType === NODE_TYPE.CommentNode) {
    // `${COMMENT_TYPE}.${hostId}.${nodeId}.${depth}.${index}`
    childIdSplt = node.nodeValue.split('.');

    if (childIdSplt[1] === hostId || childIdSplt[1] === '0') {
      // comment node for either the host id or a 0 host id
      childNodeType = childIdSplt[0];

      childVNode = createSimpleVNode({
        $hostId$: childIdSplt[1],
        $nodeId$: childIdSplt[2],
        $depth$: childIdSplt[3],
        $index$: childIdSplt[4] || '0',
        $elm$: node,
      });

      if (childNodeType === TEXT_NODE_ID) {
        childVNode.$elm$ = node.nextSibling as any;

        if (childVNode.$elm$ && childVNode.$elm$.nodeType === NODE_TYPE.TextNode) {
          childVNode.$text$ = childVNode.$elm$.textContent;
          childRenderNodes.push(childVNode);

          // remove the text comment since it's no longer needed
          node.remove();

          // check to make sure this node actually belongs to this host.
          // If it was slotted from another component, we don't want to add it
          // to this host's vdom; it can be removed on render reconciliation.
          // We want slotting logic to take care of it
          if (hostId === childVNode.$hostId$) {
            if (!parentVNode.$children$) {
              parentVNode.$children$ = [];
            }
            parentVNode.$children$[childVNode.$index$ as any] = childVNode;
          }

          if (shadowRootNodes && childVNode.$depth$ === '0') {
            shadowRootNodes[childVNode.$index$ as any] = childVNode.$elm$;
          }
        }
      } else if (childVNode.$hostId$ === hostId) {
        // this comment node is specifically for this host id

        if (childNodeType === SLOT_NODE_ID) {
          // `${SLOT_NODE_ID}.${hostId}.${nodeId}.${depth}.${index}.${slotName}.${hasSlotFallback}.${slotFallbackText}`;
          childVNode.$tag$ = 'slot';

          // TODO: this is clunky.
          // Clear out parent VNode attrs so the initial element state is used as a reference.
          // The reason: this is a slot container element and requires special scope classes
          // This does mean any class changes client-side before 'componentDidLoad',
          // will not be respected.
          parentVNode.$attrs$ = undefined;

          // add slot name
          const slotName = (node['s-sn'] = childVNode.$name$ = childIdSplt[5] || '');
          node['s-sr'] = true;

          // this slot node has fallback nodes?
          if (childIdSplt[6] === '1') {
            node['s-hsf'] = true;
          }
          // this slot node has fallback text?
          // (if so, the previous node will be that text)
          let textNode: d.RenderNode;
          if (childIdSplt[7] === '1' && node.previousSibling.nodeType === NODE_TYPE.CommentNode) {
            node['s-sfc'] = node.previousSibling.nodeValue;

            // create a text node
            textNode = doc.createTextNode(node['s-sfc']) as any as d.RenderNode;
            textNode['s-sf'] = true;
            textNode['s-hn'] = hostElm.tagName.toUpperCase();

            // add node to our vdom tree
            const textVnode = createSimpleVNode({
              $elm$: textNode,
            });
            childVNode.$children$ = childVNode.$children$ || [];
            childVNode.$children$[textVnode.$index$ as any] = textVnode;
          }

          // find this slots' current host parent as dictated by the vdom tree.
          // this is important because where it is now in the constructed SSR markup
          // might be different to where to should be
          const parentNodeId = parentVNode?.$elm$
            ? parentVNode.$elm$['s-id'] || parentVNode.$elm$.getAttribute('s-id')
            : '';

          if (BUILD.shadowDom && shadowRootNodes) {
            /* SHADOW */

            // browser supports shadowRoot and this is a shadow dom component
            // create an actual slot element
            const slot = (childVNode.$elm$ = doc.createElement(childVNode.$tag$) as d.RenderNode);

            if (childVNode.$name$) {
              // add the slot name attribute
              childVNode.$elm$.setAttribute('name', slotName);
            }

            if (parentNodeId && parentNodeId !== childVNode.$hostId$) {
              // shadow component's slot is placed inside a nested component's shadowDOM;
              // it doesn't belong to this host - it was forwarded by the SSR markup.
              // Insert it in the root of this host; it's lightDOM.
              // It doesn't really matter where in the host root; the component will take care of it.
              parentVNode.$elm$.insertBefore(slot, parentVNode.$elm$.children[0]);
            } else {
              // insert the new slot element before the slot comment
              node.parentNode.insertBefore(childVNode.$elm$, node);
            }

            let slottedNode = node as d.RenderNode;
            const slotEle = childVNode.$elm$ as HTMLSlotElement;

            // attempt to find any slotted fallback nodes;
            // and move them into our new slot element
            // in the correct order
            if (
              node['s-hsf'] &&
              slottedNode?.nodeType === NODE_TYPE.ElementNode &&
              slottedNode.getAttribute(HYDRATED_SLOT_FALLBACK_ID)
            ) {
              // move slot fallback elements into the slot
              while (
                slottedNode?.nodeType === NODE_TYPE.ElementNode &&
                slottedNode?.getAttribute(HYDRATED_SLOT_FALLBACK_ID) === node.nodeValue
              ) {
                slotEle.insertBefore(slottedNode, slotEle.children[0]);
                slottedNode = slottedNode.previousSibling as d.RenderNode;
              }
            }

            addSlottedNodes(slottedNodes, childIdSplt[2], slotName, node, childVNode.$hostId$);

            // remove the slot comment since it's not needed for shadow
            node.remove();

            if (childVNode.$depth$ === '0') {
              shadowRootNodes[childVNode.$index$ as any] = childVNode.$elm$;
            }
          } else {
            /* NON-SHADOW */
            const slot = childVNode.$elm$ as d.RenderNode;

            // test to see if this non-shadow component's mock 'slot' is placed
            // inside a nested component's shadowDOM. If so, it doesn't belong here;
            // it was forwarded by the SSR markup. So we'll insert it into the root of this host;
            // it's lightDOM with accompanying 'slotted' nodes
            const shouldMove = parentNodeId && parentNodeId !== childVNode.$hostId$ && parentVNode.$elm$.shadowRoot;

            // attempt to find any mock slotted nodes which we'll move later
            addSlottedNodes(
              slottedNodes,
              childIdSplt[2],
              slotName,
              node,
              shouldMove ? parentNodeId : childVNode.$hostId$
            );

            if (shouldMove) {
              // move slot comment node (to after any other comment nodes)
              parentVNode.$elm$.insertBefore(slot, parentVNode.$elm$.children[0]);
            }
            childRenderNodes.push(childVNode);
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
  } else if (parentVNode && parentVNode.$tag$ === 'style') {
    const vnode = newVNode(null, node.textContent) as any;
    vnode.$elm$ = node;
    vnode.$index$ = '0';
    parentVNode.$children$ = [vnode];
  }

  return parentVNode;
};

/**
 * Skims whole SSR document to create
 * a map of component IDs and 'original location ID's.
 * original location ID's are derived from comment nodes placed by 'vdom-annotations.ts'.
 * They relate to lightDOM nodes that were moved deeper into the SSR markup.
 * e.g. `<!--o.1-->` maps to `<div c-id="0.1">`
 *
 * @param node - a node in the document. If an element, will recursively drill down
 * @param orgLocNodes - a master map to add component ids and original location ids to
 */
export const initializeDocumentHydrate = (node: d.RenderNode, orgLocNodes: Map<string, any>) => {
  if (node.nodeType === NODE_TYPE.ElementNode) {
    // add all the loaded component IDs in this document
    // they're required to find nodes later
    // when deciding where slotted nodes should live
    const componentId = node[HYDRATE_ID] || node.getAttribute(HYDRATE_ID);
    if (componentId) {
      orgLocNodes.set(componentId, node);
    }

    let i = 0;
    const nonShadowChildNodes = node.__childNodes || node.childNodes;
    for (; i < nonShadowChildNodes.length; i++) {
      initializeDocumentHydrate(nonShadowChildNodes[i] as any, orgLocNodes);
    }
    if (node.shadowRoot) {
      for (i = 0; i < node.shadowRoot.childNodes.length; i++) {
        initializeDocumentHydrate(node.shadowRoot.childNodes[i] as any, orgLocNodes);
      }
    }
  } else if (node.nodeType === NODE_TYPE.CommentNode) {
    const childIdSplt = node.nodeValue.split('.');
    if (childIdSplt[0] === ORG_LOCATION_ID) {
      orgLocNodes.set(childIdSplt[1] + '.' + childIdSplt[2], node);

      // useful to know if the original location is
      // the root light-dom of a shadow dom component
      node['s-en'] = childIdSplt[3] as any;
    }
  }
};

/**
 * Creates a vnode to add to a hydrated component vdom
 * @param vnode - a vnode partial which will be augmented
 * @returns an complete vnode
 */
const createSimpleVNode = (vnode: Partial<RenderNodeData>): RenderNodeData => {
  const defaultVNode: RenderNodeData = {
    $flags$: 0,
    $hostId$: null,
    $nodeId$: null,
    $depth$: null,
    $index$: '0',
    $elm$: null,
    $attrs$: null,
    $children$: null,
    $key$: null,
    $name$: null,
    $tag$: null,
    $text$: null,
  };
  return { ...defaultVNode, ...vnode };
};

/**
 * Adds groups of slotted nodes (grouped by slot ID)
 * to this host element's 'master' array. We'll use this after
 * the host element's VDOM is completely constructed to
 * finally position or / and add meta information required by non-shadow slotted nodes
 * @param slottedNodes - the main host element 'master' array to add to
 * @param slotNodeId - the slot node unique ID
 * @param slotName - the slot node name (can be '')
 * @param slotNode - the slot node
 * @param hostId - the host element id where this node should be slotted
 */
const addSlottedNodes = (
  slottedNodes: SlottedNodes[],
  slotNodeId: string,
  slotName: string,
  slotNode: d.RenderNode,
  hostId: string
) => {
  let slottedNode = slotNode.nextSibling as d.RenderNode;
  slottedNodes[slotNodeId as any] = slottedNodes[slotNodeId as any] || [];

  while (
    slottedNode &&
    (slottedNode['s-sn'] === slotName ||
      (slotName === '' &&
        !slottedNode['s-sn'] &&
        ((slottedNode.nodeType === NODE_TYPE.CommentNode && slottedNode.nodeValue.indexOf('.') !== 1) ||
          slottedNode.nodeType === NODE_TYPE.TextNode)))
  ) {
    slottedNode['s-sn'] = slotName;
    slottedNodes[slotNodeId as any].push({ slot: slotNode, node: slottedNode, hostId });
    slottedNode = slottedNode.nextSibling as d.RenderNode;
  }
};
