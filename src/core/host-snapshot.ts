import * as d from '../declarations';
import { Build } from '../util/build-conditionals';
import { ENCAPSULATION, SSR_VNODE_ID } from '../util/constants';
import { useShadowDom } from '../renderer/vdom/encapsulation';


export function initHostSnapshot(domApi: d.DomApi, cmpMeta: d.ComponentMeta, elm: d.HostElement) {
  // MAIN THREAD
  if (Build.slotPolyfill) {
    // host element has been connected to the DOM
    if (!elm['s-cr'] && !domApi.$getAttribute(elm, SSR_VNODE_ID) && !useShadowDom(domApi.$supportsShadowDom, cmpMeta)) {
      // only required when we're NOT using native shadow dom (slot)
      // this host element was NOT created with SSR
      // let's pick out the inner content for slot projection
      // create a comment to represent where the original
      // content was first placed, which is useful later on
      domApi.$insertBefore(elm, (elm['s-cr'] = domApi.$createComment('')), domApi.$childNodes(elm)[0]);

      if (Build.isDev) {
        // only add this extra data in dev mode
        (elm['s-cr'] as any)['s-host-id'] = elm['s-id'];
        (elm['s-cr'] as any)['s-host-tag'] = elm.tagName.toLowerCase();
      }
    }

    if (!domApi.$supportsShadowDom && cmpMeta.encapsulation === ENCAPSULATION.ShadowDom) {
      // this component should use shadow dom
      // but this browser doesn't support it
      // so let's polyfill a few things for the user
      (elm as any).shadowRoot = elm;
    }
  }

  const hostSnapshot: d.HostSnapshot = {
    $id: elm['s-id'],
    $attributes: {}
  };

  cmpMeta.membersMeta && Object.keys(cmpMeta.membersMeta).forEach(memberName => {
    if (cmpMeta.membersMeta[memberName].attribName) {
      hostSnapshot.$attributes[memberName] = domApi.$getAttribute(elm, cmpMeta.membersMeta[memberName].attribName);
    }
  });

  return hostSnapshot;
}
