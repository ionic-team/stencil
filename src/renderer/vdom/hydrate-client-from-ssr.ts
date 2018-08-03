import * as d from '../../declarations';
import { NODE_TYPE, SSR_CHILD_ID, SSR_HOST_ID, SSR_LIGHT_DOM_NODE_COMMENT, SSR_SHADOW_DOM_HOST_ID, SSR_SLOT_NODE_COMMENT, SSR_TEXT_NODE_COMMENT } from '../../util/constants';


export function createVNodesFromSsr(plt: d.PlatformApi, domApi: d.DomApi, rootElm: Element) {
  const allSsrElms = rootElm.querySelectorAll(`[${SSR_HOST_ID}]`) as NodeListOf<d.HostElement>;
  const ilen = allSsrElms.length;
  const removeNodes: Node[] = [];
  let elm: d.HostElement,
      ssrVNodeId: string,
      ssrVNode: d.VNode,
      i: number,
      j: number,
      jlen: number;

  if (ilen > 0) {
    plt.hasLoadedMap.set(rootElm as d.HostElement, true);

    for (i = 0; i < ilen; i++) {
      elm = allSsrElms[i];
      ssrVNodeId = domApi.$getAttribute(elm, SSR_HOST_ID);
      domApi.$removeAttribute(elm, SSR_HOST_ID);
      ssrVNode = {};
      ssrVNode.vtag = domApi.$tagName(ssrVNode.elm = elm);
      plt.vnodeMap.set(elm, ssrVNode);

      for (j = 0, jlen = elm.childNodes.length; j < jlen; j++) {
        addChildSsrVNodes(domApi, elm.childNodes[j] as d.RenderNode, ssrVNode, ssrVNodeId, true, removeNodes);
      }
    }

    for (i = 0; i < removeNodes.length; i++) {
      domApi.$remove(removeNodes[i]);
    }

    if (__BUILD_CONDITIONALS__.hasShadowDom && domApi.$supportsShadowDom) {
      upgradeShadowDomComponents(domApi, rootElm as HTMLElement);
    }
  }
}


function addChildSsrVNodes(domApi: d.DomApi, node: d.RenderNode, parentVNode: d.VNode, ssrVNodeId: string, checkNestedElements: boolean, removeNodes: Node[]) {
  const nodeType = domApi.$nodeType(node);
  let childVNodeId: string,
      childVNodeSplt: any[],
      childVNode: d.VNode;

  if (checkNestedElements && nodeType === NODE_TYPE.ElementNode) {
    childVNodeId = domApi.$getAttribute(node, SSR_CHILD_ID);

    if (childVNodeId) {
      // split the start comment's data with a period
      childVNodeSplt = childVNodeId.split('.');

      // ensure this this element is a child element of the ssr vnode
      if (childVNodeSplt[0] === ssrVNodeId) {
        // cool, this element is a child to the parent vnode
        childVNode = {
          vattrs: null,
          vchildren: null
        };
        childVNode.vtag = domApi.$tagName(childVNode.elm = node);

        // this is a new child vnode
        // so ensure its parent vnode has the vchildren array
        if (!parentVNode.vchildren) {
          parentVNode.vchildren = [];
        }

        // add our child vnode to a specific index of the vnode's children
        parentVNode.vchildren[childVNodeSplt[1]] = childVNode;

        // this is now the new parent vnode for all the next child checks
        parentVNode = childVNode;

        // if there's a trailing period, then it means there aren't any
        // more nested elements, but maybe nested text nodes
        // either way, don't keep walking down the tree after this next call
        checkNestedElements = (childVNodeSplt[2] !== '');

        domApi.$removeAttribute(node, SSR_CHILD_ID);
      }
    }

    // keep drilling down through the elements
    const childNodes = domApi.$childNodes(node) as NodeListOf<d.RenderNode>;
    for (let i = 0; i < childNodes.length; i++) {
      addChildSsrVNodes(domApi, childNodes[i], parentVNode, ssrVNodeId, checkNestedElements, removeNodes);
    }

  } else if (domApi.$nodeType(node) === NODE_TYPE.CommentNode) {
    // this is a comment node, so it could have ssr data in it
    // split the start comment's data with a period
    childVNodeSplt = domApi.$getTextContent(node).split('.');

    if (childVNodeSplt[1] === ssrVNodeId) {
      let nextTextNode = node;
      while ((nextTextNode = domApi.$nextSibling(nextTextNode) as d.RenderNode)) {
        if (domApi.$nodeType(nextTextNode) === NODE_TYPE.TextNode) {

          if (childVNodeSplt[0] === SSR_TEXT_NODE_COMMENT) {
            // this is an ssr text node start comment
            // which should start with an "s" and delimited by periods
            childVNode = {
              vtext: domApi.$getTextContent(nextTextNode),
              elm: nextTextNode
            };

            // this is a new child vnode
            // so ensure its parent vnode has the vchildren array
            if (!parentVNode.vchildren) {
              parentVNode.vchildren = [];
            }

            // add our child vnode to a specific index of the vnode's children
            parentVNode.vchildren[childVNodeSplt[2]] = childVNode;

          } else if (childVNodeSplt[0] === SSR_LIGHT_DOM_NODE_COMMENT) {


          } else if (__BUILD_CONDITIONALS__.hasSlot && childVNodeSplt[0] === SSR_SLOT_NODE_COMMENT) {
            // this comment node represents where a real <slot> node should go
            // replace with an actual <slot>
            childVNode = {
              vtag: 'slot',
              vattrs: null,
              vchildren: null
            };
            domApi.$insertBefore(parentVNode.elm, childVNode.elm = domApi.$createElement(childVNode.vtag), node);
            domApi.$remove(node);

            if (childVNodeSplt[3]) {
              // this slot has a "name" attribute
              childVNode.vattrs = childVNode.vattrs || {};
              domApi.$setAttribute(childVNode.elm, 'name', childVNode.vattrs.name = (childVNode.vname = childVNodeSplt[3]));
            }

            // this is a new child vnode
            // so ensure its parent vnode has the vchildren array
            if (!parentVNode.vchildren) {
              parentVNode.vchildren = [];
            }

            // add our child vnode to a specific index of the vnode's children
            parentVNode.vchildren[childVNodeSplt[2]] = childVNode;
          }

          break;
        }
      }
    }
  }
}


export function upgradeShadowDomComponents(domApi: d.DomApi, node: d.HostElement) {
  const nodeType = domApi.$nodeType(node);
  let i: number;
  let childNode: HTMLElement;
  let cssClasses: string[];

  if (nodeType === NODE_TYPE.ElementNode) {
    // this is and element node

    // keep drilling down through the elements
    // do this before we start adding shadow roots
    // this way we're adding them from bottom up
    let childNodes = domApi.$childNodes(node) as NodeListOf<d.HostElement>;
    for (i = 0; i < childNodes.length; i++) {
      childNode = childNodes[i];

      if (domApi.$nodeType(childNode) === NODE_TYPE.ElementNode) {
        // remove the scoped css classes
        cssClasses = childNode.className.split(' ');

        for (let i = 0; i < cssClasses.length; i++) {
          if (cssClasses[i].startsWith('scs-')) {
            cssClasses[i] = '';
          }
        }

        childNode.className = cssClasses.join(' ').trim();
        if (childNode.className === '') {
          domApi.$removeAttribute(childNode, 'class');
        }
      }

      upgradeShadowDomComponents(domApi, childNode);
    }

    const ssrHostId = domApi.$getAttribute(node, SSR_HOST_ID);
    console.log('\n\n\n\n\n', ssrHostId, '\n\n\n\n\n')
    if (ssrHostId && ssrHostId.includes(SSR_SHADOW_DOM_HOST_ID)) {
      // attach a shadow root to the host element
      const shadowRoot = domApi.$attachShadow(node, { mode: 'open' });

      // get all the child nodes of this host element
      // that should be converted to use native shadow dom
      childNodes = domApi.$childNodes(node) as NodeListOf<d.HostElement>;

      for (i = childNodes.length - 1; i >= 0; i--) {
        // relocate all of the host content nodes into the shadow root
        childNode = childNodes[i];

        // remove from the host content
        childNode.remove();

        // add the shadow root
        domApi.$insertBefore(shadowRoot, childNode, shadowRoot.firstChild);
      }
    }
  }
}
