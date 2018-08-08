import * as d from '../../declarations';
import { NODE_TYPE, SSR_CHILD_ID, SSR_CONTENT_REF_NODE_COMMENT, SSR_HOST_ID, SSR_LIGHT_DOM_ATTR, SSR_LIGHT_DOM_NODE_COMMENT, SSR_ORIGINAL_LOCATION_NODE_ATTR, SSR_ORIGINAL_LOCATION_NODE_COMMENT, SSR_SHADOW_DOM_HOST_ID, SSR_SLOT_NODE_COMMENT, SSR_TEXT_NODE_COMMENT } from '../../util/constants';


// Welcome SSR Friends!!!

export function hydrateClientFromSsr(plt: d.PlatformApi, domApi: d.DomApi, rootElm: Element) {
  // mark the root element has fully loaded since it was prerendered
  plt.hasLoadedMap.set(rootElm as d.HostElement, true);

  const removeNodes: d.RenderNode[] = [];
  const slottedCmps: d.SlottedComponent[] = [];

  // start drilling down through the dom looking
  // for elements that are actually hydrated components
  hydrateElementFromSsr(plt, domApi, rootElm as d.RenderNode, slottedCmps, removeNodes);

  // remove all the nodes we identified we no longer need in the dom
  removeNodes.forEach(removeNode => removeNode.remove());

  slottedCmps.forEach(slottedCmp => {
    if (__BUILD_CONDITIONALS__.hasShadowDom && slottedCmp.useShadowDom) {
      // cool so we finished up building a vnode out of the ssr data found in the html
      // and turns out that this host element is a component that should use shadow dom
      // we've also collected up all of the nodes that should be relocated to the light dom
      // now it is time for some pixie dust to magically turn this element to use shadow dom ;)
      // If you're reading this, you rock, and we appreciate you. You stay classy San Dieago.

      // attach a shadow root to the host element
      const shadowRoot = domApi.$attachShadow(slottedCmp.hostElm);

      // move all of the current content child nodes into the shadow root
      // get all the child nodes of this host element
      const childNodes = domApi.$childNodes(slottedCmp.hostElm) as NodeListOf<d.RenderNode>;
      for (let i = childNodes.length - 1; i >= 0; i--) {
        // relocate all of the host content nodes into the shadow root
        const node = childNodes[i];
        if (!node['s-cn']) {
          // remove from the host content
          node.remove();

          // add the shadow root
          domApi.$insertBefore(shadowRoot, node, shadowRoot.firstChild);
        }
      }

      slottedCmp.lightDomNodes.sort((a, b) => {
        if (a.contentIndex < b.contentIndex) return 1;
        return -1;
      });

      slottedCmp.lightDomNodes.forEach(lightDomNode => {
        lightDomNode.elm.remove();
        domApi.$insertBefore(slottedCmp.hostElm, lightDomNode.elm);
      });
    }
  });
}


function hydrateElementFromSsr(plt: d.PlatformApi, domApi: d.DomApi, parentNode: d.RenderNode, slottedCmps: d.SlottedComponent[], removeNodes: d.RenderNode[], ssrHostId?: string, ssrVNode?: d.VNode) {
  // get all the child nodes for this element
  // this includes elements, text nodes and comment nodes
  Array.prototype.slice.call(domApi.$childNodes(parentNode)).forEach((node: d.RenderNode) => {

    if (domApi.$nodeType(node) === NODE_TYPE.ElementNode) {
      // this is an element node :)
      // keep drilling down first so we hydrate from bottom up
      hydrateElementFromSsr(plt, domApi, node, slottedCmps, removeNodes);

      // see if this element has a host id attribute
      ssrHostId = domApi.$getAttribute(node, SSR_HOST_ID);
      if (ssrHostId) {
        // this element is a server side rendered component!!

        // remove the ssr host attribute
        domApi.$removeAttribute(node, SSR_HOST_ID);

        // create a new vnode to fill in with data from the elements
        ssrVNode = {
          vtag: domApi.$tagName(node),
          elm: node,
          ishost: true
        };

        // store this vnode data with the actual element as the key
        plt.vnodeMap.set(node, ssrVNode);

        const slottedCmp: d.SlottedComponent = {
          hostElm: node,
          lightDomNodes: [] as any,
          useShadowDom: (__BUILD_CONDITIONALS__.hasShadowDom && domApi.$supportsShadowDom && ssrHostId.includes(SSR_SHADOW_DOM_HOST_ID))
        };
        slottedCmps.push(slottedCmp);

        if (slottedCmp.useShadowDom) {
          // we know this is host node cuz of the id had some prefix
          // well let's trim it off to get the real host id
          ssrHostId = ssrHostId.substring(1);
        }

        // keep drilling down through child nodes and build up the vnode
        addChildSsrVNodes(domApi, ssrVNode.vtag as string, node, node, NODE_TYPE.ElementNode, ssrVNode, ssrHostId, true, slottedCmp, removeNodes);
      }
    }

  });
}


function addChildSsrVNodes(domApi: d.DomApi, hostTagName: string, hostElm: d.HostElement, node: d.RenderNode, nodeType: number, parentVNode: d.VNode, ssrHostId: string, checkNestedElements: boolean, slottedCmp: d.SlottedComponent, removeNodes: d.RenderNode[]) {
  let attrId: string;
  let dataIdSplt: any[];
  let childVNode: d.VNode;
  let nextNode: d.RenderNode;

  if (checkNestedElements && nodeType === NODE_TYPE.ElementNode) {
    // we should keep checking for nested element to this component
    // and this node is an element

    // see if this element has a ssr child attribute
    if ((attrId = domApi.$getAttribute(node, SSR_CHILD_ID))) {
      // so apparently this is element is a ssr child node to something
      // split the start comment's data with a period
      dataIdSplt = attrId.split('.');

      // check if this element is a child element of the ssr vnode
      if (dataIdSplt[0] === ssrHostId) {
        // cool, turns out this element is a child to the parent vnode
        childVNode = {
          vtag: domApi.$tagName(node),
          elm: node,
          vattrs: null,
          vchildren: null
        };

        node['s-hn'] = hostTagName;

        // this is a new child vnode
        // so ensure its parent vnode has the vchildren array
        if (!parentVNode.vchildren) {
          parentVNode.vchildren = [];
        }

        // add our child vnode to a specific index of the vnode's children
        parentVNode.vchildren[dataIdSplt[1]] = childVNode;

        // this is now the new parent vnode for all the next child checks
        parentVNode = childVNode;

        // if there's a trailing period, then it means there aren't any
        // more nested elements, but maybe nested text nodes
        // either way, don't keep walking down the tree after this next call
        checkNestedElements = (dataIdSplt[2] !== '');

        // remove the ssr child attribute
        domApi.$removeAttribute(node, SSR_CHILD_ID);
      }
    }

    if ((attrId = domApi.$getAttribute(node, SSR_ORIGINAL_LOCATION_NODE_ATTR)) && (dataIdSplt = attrId.split('.')) && (dataIdSplt[0] === ssrHostId)) {
      console.log('\n\n\n\n\n\n SSR_ORIGINAL_LOCATION_NODE_ATTR', dataIdSplt, '\n\n\n\n\n\n')

      // remove the ssr original location attribute
      domApi.$removeAttribute(node, SSR_ORIGINAL_LOCATION_NODE_ATTR);
    }

    if ((attrId = domApi.$getAttribute(node, SSR_LIGHT_DOM_ATTR)) && (dataIdSplt = attrId.split('.')) && (dataIdSplt[0] === ssrHostId)) {
      // since this is a shadow dom component let's also check to
      // to see if this element is a light dom node that should
      // be relocated to be a direct child of the host component
      // cool, so looks like this element is a light dom that should
      // be relocated to be a direct child of the host component
      slottedCmp.lightDomNodes.push({
        contentIndex: parseInt(dataIdSplt[2], 10),
        elm: node
      });

      // remove the ssr light dom attribute
      domApi.$removeAttribute(node, SSR_LIGHT_DOM_ATTR);
    }

    // keep drilling down through the elements
    (Array.prototype.slice.call(domApi.$childNodes(node)) as d.RenderNode[]).forEach(childNode => {
      addChildSsrVNodes(domApi, hostTagName, hostElm, childNode, domApi.$nodeType(childNode), parentVNode, ssrHostId, checkNestedElements, slottedCmp, removeNodes);
    });

  } else if (nodeType === NODE_TYPE.CommentNode) {
    // this is a comment node, so it could have ssr data in it
    // split the start comment's data with a period
    dataIdSplt = domApi.$getTextContent(node).split('.');

    if (dataIdSplt[1] === ssrHostId) {
      // cool, so this is a comment node representing some ssr data
      // about a child node of this host element

      if (__BUILD_CONDITIONALS__.hasSlot && dataIdSplt[0] === SSR_CONTENT_REF_NODE_COMMENT) {
        // this is a content reference html comment
        (hostElm['s-cr'] = domApi.$createTextNode('') as any)['s-cn'] = true;
        domApi.$insertBefore(hostElm, hostElm['s-cr'], node);
        node.remove();

      } else if (__BUILD_CONDITIONALS__.hasSlot && dataIdSplt[0] === SSR_SLOT_NODE_COMMENT) {
        // this comment node represents where a real <slot> node should go
        // replace the comment node with an actual <slot>
        childVNode = {
          vtag: 'slot',
          vattrs: null,
          vchildren: null
        };

        if (dataIdSplt[3]) {
          // this slot has a "name" attribute
          // add the "name" to the vnode data
          childVNode.vattrs = childVNode.vattrs || {};
          childVNode.vattrs.name = (childVNode.vname = dataIdSplt[3]);
        }

        if (__BUILD_CONDITIONALS__.hasShadowDom && domApi.$supportsShadowDom) {
          // add the new <slot> element
          childVNode.elm = domApi.$createElement('slot');
          domApi.$insertBefore(parentVNode.elm, childVNode.elm, node);

          if (dataIdSplt[3]) {
            domApi.$setAttribute(childVNode.elm, 'name', dataIdSplt[3]);
          }
        }

        // remove the old html comment node
        domApi.$remove(node);

        // this is a new child vnode
        // so ensure its parent vnode has the vchildren array
        if (!parentVNode.vchildren) {
          parentVNode.vchildren = [];
        }

        // add our child vnode to a specific index of the vnode's children
        parentVNode.vchildren[dataIdSplt[2]] = childVNode;

      } else {
        // this is not a slot node, so it might be a comment before a text node data
        // loop through looking for the next text node which
        // the comment node may have ssr data about
        nextNode = node;
        while ((nextNode = domApi.$nextSibling(nextNode) as d.RenderNode)) {
          if (domApi.$nodeType(nextNode) === NODE_TYPE.TextNode) {
            // so we already had a starting html comment
            // and we just found the next sibling text node

            if (dataIdSplt[0] === SSR_TEXT_NODE_COMMENT) {
              // this is an ssr text node starting comment for a vnode
              // create a new vnode about this text node
              childVNode = {
                vtext: domApi.$getTextContent(nextNode),
                elm: nextNode
              };

              nextNode['s-hn'] = hostTagName;

              // this is a new child vnode
              // so ensure its parent vnode has the vchildren array
              if (!parentVNode.vchildren) {
                parentVNode.vchildren = [];
              }

              // add our child vnode to a specific index of the vnode's children
              parentVNode.vchildren[dataIdSplt[2]] = childVNode;

              // remove this node later on
              removeNodes.push(node);

              nextNode = domApi.$nextSibling(nextNode) as d.RenderNode;
              if (nextNode && domApi.$nodeType(nextNode) === NODE_TYPE.CommentNode && domApi.$getTextContent(nextNode) === '/') {
                removeNodes.push(nextNode);
              }

            } if (dataIdSplt[0] === SSR_ORIGINAL_LOCATION_NODE_COMMENT) {
              console.log('\n\n\n\n\n\n comment', dataIdSplt, '\n\n\n\n\n\n')

              // remove this node later on
              removeNodes.push(node);

            } else if (dataIdSplt[0] === SSR_LIGHT_DOM_NODE_COMMENT) {
              // this is an ssr text node start comment for light dom content
              // let's remember the content index number for this node
              // so we can later sort them to the correct order in the light dom
              slottedCmp.lightDomNodes.push({
                contentIndex: parseInt(dataIdSplt[2], 10),
                elm: nextNode
              });

              // remove this node later on
              removeNodes.push(node);
            }

            break;
          }
        }
      }
    }
  }
}
