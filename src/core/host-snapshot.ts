import * as d from '../declarations';
import { Build } from '../util/build-conditionals';
import { ENCAPSULATION, SSR_VNODE_ID } from '../util/constants';
import { useShadowDom } from '../renderer/vdom/encapsulation';


export function initHostSnapshot(domApi: d.DomApi, cmpMeta: d.ComponentMeta, elm: d.HostElement, hostSnapshot?: d.HostSnapshot, attribName?: string) {
  // MAIN THREAD
  if (Build.slotPolyfill) {
    // host element has been connected to the DOM
    if (!elm['s-cr'] && !domApi.$getAttribute(elm, SSR_VNODE_ID) && !useShadowDom(domApi.$supportsShadowDom, cmpMeta)) {
      // only required when we're NOT using native shadow dom (slot)
      // this host element was NOT created with SSR
      // let's pick out the inner content for slot projection
      // create a node to represent where the original
      // content was first placed, which is useful later on
      elm['s-cr'] = domApi.$createTextNode('') as any;
      elm['s-cr']['s-cn'] = true;
      domApi.$insertBefore(elm, elm['s-cr'], domApi.$childNodes(elm)[0]);
    }

    if (!domApi.$supportsShadowDom && cmpMeta.encapsulation === ENCAPSULATION.ShadowDom) {
      // this component should use shadow dom
      // but this browser doesn't support it
      // so let's polyfill a few things for the user

      if (Build.isDev && Build.clientSide) {
        // it's possible we're manually forcing the slot polyfill
        // but this browser may already support the read-only shadowRoot
        // do an extra check here, but only for dev mode on the client
        if (!('shadowRoot' in HTMLElement.prototype)) {
          (elm as any).shadowRoot = elm;
        }

      } else {
        (elm as any).shadowRoot = elm;
      }
    }
  }

  hostSnapshot = {
    $id: elm['s-id'],
    $attributes: {}
  };

  cmpMeta.membersMeta && Object.keys(cmpMeta.membersMeta).forEach(memberName => {
    if (attribName = cmpMeta.membersMeta[memberName].attribName) {
      hostSnapshot.$attributes[attribName] = domApi.$getAttribute(elm, attribName);
    }
  });

  return hostSnapshot;
}
