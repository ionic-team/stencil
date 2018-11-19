import * as d from '../declarations';
import { DEFAULT_STYLE_MODE, ENCAPSULATION, SSR_VNODE_ID } from '../util/constants';


export const initHostSnapshot = (domApi: d.DomApi, cmpMeta: d.ComponentMeta, hostElm: d.HostElement, hostSnapshot?: d.HostSnapshot, attribName?: string) => {
  // the host element has connected to the dom
  // and we've waited a tick to make sure all frameworks
  // have finished adding attributes and child nodes to the host
  // before we go all out and hydrate this beast
  // let's first take a snapshot of its original layout before render
  if (_BUILD_.hasMode && !hostElm.mode) {
    // looks like mode wasn't set as a property directly yet
    // first check if there's an attribute
    // next check the app's global
    hostElm.mode = domApi.$getMode(hostElm);
  } else {
    hostElm.mode = DEFAULT_STYLE_MODE;
  }

  if (_BUILD_.slotPolyfill) {
    // if the slot polyfill is required we'll need to put some nodes
    // in here to act as original content anchors as we move nodes around
    // host element has been connected to the DOM
    if (!hostElm['s-cr'] && !domApi.$getAttribute(hostElm, SSR_VNODE_ID) && (!domApi.$supportsShadowDom || cmpMeta.encapsulationMeta !== ENCAPSULATION.ShadowDom)) {
      // only required when we're NOT using native shadow dom (slot)
      // or this browser doesn't support native shadow dom
      // and this host element was NOT created with SSR
      // let's pick out the inner content for slot projection
      // create a node to represent where the original
      // content was first placed, which is useful later on
      hostElm['s-cr'] = domApi.$createTextNode('') as any;
      hostElm['s-cr']['s-cn'] = true;
      domApi.$insertBefore(hostElm, hostElm['s-cr'], domApi.$childNodes(hostElm)[0]);
    }

    if ((_BUILD_.es5 || _BUILD_.scoped) && !domApi.$supportsShadowDom && cmpMeta.encapsulationMeta === ENCAPSULATION.ShadowDom as number) {
      // this component should use shadow dom
      // but this browser doesn't support it
      // so let's polyfill a few things for the user

      if (_BUILD_.isDev && _BUILD_.clientSide) {
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

  if (_BUILD_.shadowDom) {
    if (cmpMeta.encapsulationMeta === ENCAPSULATION.ShadowDom && domApi.$supportsShadowDom && !hostElm.shadowRoot) {
      // this component is using shadow dom
      // and this browser supports shadow dom
      // add the read-only property "shadowRoot" to the host element
      domApi.$attachShadow(hostElm, { mode: 'open', ...cmpMeta.shadowRootOptions });
    }
  }

  // create a host snapshot object we'll
  // use to store all host data about to be read later
  hostSnapshot = {
    $attributes: {}
  };

  if (_BUILD_.hasMembers) {
    // loop through and gather up all the original attributes on the host
    // this is useful later when we're creating the component instance
    cmpMeta.membersMeta && Object.keys(cmpMeta.membersMeta).forEach(memberName => {
      if (attribName = cmpMeta.membersMeta[memberName].attribName) {
        hostSnapshot.$attributes[attribName] = domApi.$getAttribute(hostElm, attribName);
      }
    });
  }

  return hostSnapshot;
};
