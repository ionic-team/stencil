import * as d from '../declarations';
import { ENCAPSULATION, SSR_CONTENT_REF_NODE_COMMENT, SSR_HOST_ID, NODE_TYPE, SSR_LIGHT_DOM_ATTR, SSR_LIGHT_DOM_NODE_COMMENT } from '../util/constants';


export function initHostSnapshot(plt: d.PlatformApi, domApi: d.DomApi, cmpMeta: d.ComponentMeta, hostElm: d.HostElement, hostSnapshot?: d.HostSnapshot, attribName?: string) {
  // the host element has connected to the dom
  // and we've waited a tick to make sure all frameworks
  // have finished adding attributes and child nodes to the host
  // before we go all out and hydrate this beast
  // let's first take a snapshot of its original layout before render
  if (!hostElm.mode) {
    // looks like mode wasn't set as a property directly yet
    // first check if there's an attribute
    // next check the app's global
    hostElm.mode = domApi.$getMode(hostElm);
  }

  if (__BUILD_CONDITIONALS__.slotPolyfill) {
    // if the slot polyfill is required we'll need to put some nodes
    // in here to act as original content anchors as we move nodes around
    // host element has been connected to the DOM

    if (__BUILD_CONDITIONALS__.ssrServerSide && !hostElm['s-cr']) {
      // we're doing server side rendering
      // and this component is either a shadow dom or scoped css component
      // so let's add this content reference as a comment
      if (!domApi.$hasAttribute(hostElm, SSR_HOST_ID)) {
        // during ssr, let's add a unique ssr id to each host element
        const ssrId = plt.nextSsrId();

        // get an array of all the child nodes of this host element
        // const childNodes = Array.prototype.slice.call(domApi.$childNodes(hostElm)) as d.RenderNode[];

        // childNodes.forEach((childNode, i) => {
        //   // before we got ahead and hydrate anything
        //   // since we're in the middle of server side rendering
        //   // let's also add attributes to the direct child nodes
        //   // of this shadow dom component. This way the client side
        //   // knows what nodes should stay in the light dom
        //   childNode['s-light-dom-id'] = `${ssrId}.${i}`;

        //   if (domApi.$nodeType(childNode) === NODE_TYPE.ElementNode) {
        //     // this is an element that's an immediate child of the host element
        //     domApi.$setAttribute(childNode, SSR_LIGHT_DOM_ATTR, childNode['s-light-dom-id']);

        //   } else if (domApi.$nodeType(childNode) === NODE_TYPE.TextNode && domApi.$getTextContent(childNode).trim() !== '') {
        //     // this is a text node that's an immediate child of the host element
        //     const startComment = domApi.$createComment(`${SSR_LIGHT_DOM_NODE_COMMENT}.${childNode['s-light-dom-id']}`);
        //     domApi.$insertBefore(hostElm, startComment, childNode);
        //   }
        // });

        hostElm['s-ssr-id'] = ssrId;
        domApi.$setAttribute(hostElm, SSR_HOST_ID, ssrId);
        hostElm['s-cr'] = domApi.$createComment(`${SSR_CONTENT_REF_NODE_COMMENT}.${ssrId}`) as any;
        hostElm['s-cr']['s-cn'] = true;
        domApi.$insertBefore(hostElm, hostElm['s-cr'], domApi.$childNodes(hostElm)[0]);
      }

    } else if (!hostElm['s-cr'] && (!domApi.$supportsShadowDom || cmpMeta.encapsulationMeta !== ENCAPSULATION.ShadowDom)) {
      // only required when we're NOT using native shadow dom (slot)
      // or this browser doesn't support native shadow dom
      // let's pick out the inner content for slot projection
      // create a node to represent where the original
      // content was first placed, which is useful later on
      (hostElm['s-cr'] = domApi.$createTextNode('') as any)['s-cn'] = true;
      domApi.$insertBefore(hostElm, hostElm['s-cr'], domApi.$childNodes(hostElm)[0]);
    }

    if (!domApi.$supportsShadowDom && cmpMeta.encapsulationMeta === ENCAPSULATION.ShadowDom as number) {
      // this component should use shadow dom
      // but this browser doesn't support it
      // so let's polyfill a few things for the user

      if (__BUILD_CONDITIONALS__.isDev && __BUILD_CONDITIONALS__.clientSide) {
        // it's possible we're manually forcing the slot polyfill
        // but this browser may already support the read-only shadowRoot
        // do an extra check here, but only for dev mode on the client
        if (!('shadowRoot' in HTMLElement.prototype)) {
          (hostElm as any).shadowRoot = hostElm;
        }

      } else {
        (hostElm as any).shadowRoot = hostElm;
      }
    }
  }

  if (__BUILD_CONDITIONALS__.hasShadowDom) {
    if (cmpMeta.encapsulationMeta === ENCAPSULATION.ShadowDom && domApi.$supportsShadowDom && !hostElm.shadowRoot) {
      // this component is using shadow dom
      // and this browser supports shadow dom
      // add the read-only property "shadowRoot" to the host element
      domApi.$attachShadow(hostElm);
    }
  }

  // create a host snapshot object we'll
  // use to store all host data about to be read later
  hostSnapshot = {
    $id: hostElm['s-id'],
    $attributes: {}
  };

  // loop through and gather up all the original attributes on the host
  // this is useful later when we're creating the component instance
  cmpMeta.membersMeta && Object.keys(cmpMeta.membersMeta).forEach(memberName => {
    if (attribName = cmpMeta.membersMeta[memberName].attribName) {
      hostSnapshot.$attributes[attribName] = domApi.$getAttribute(hostElm, attribName);
    }
  });

  return hostSnapshot;
}
