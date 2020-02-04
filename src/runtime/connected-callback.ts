import * as d from '../declarations';
import { addEventListeners } from './host-listener';
import { addStyle } from './styles';
import { BUILD } from '@build-conditionals';
import { CMP_FLAGS, HOST_FLAGS, MEMBER_FLAGS } from '@utils';
import { doc, getHostRef, nextTick, plt, supportsShadowDom } from '@platform';
import { HYDRATE_ID, NODE_TYPE, PLATFORM_FLAGS } from './runtime-constants';
import { initializeClientHydrate } from './client-hydrate';
import { initializeComponent } from './initialize-component';
import { attachToAncestor, safeCall } from './update-component';
import { createTime } from './profile';

export const fireConnectedCallback = (instance: any) => {
  if (BUILD.lazyLoad && BUILD.connectedCallback) {
    safeCall(instance, 'connectedCallback');
  }
};

export const connectedCallback = (elm: d.HostElement, cmpMeta: d.ComponentRuntimeMeta) => {
  if ((plt.$flags$ & PLATFORM_FLAGS.isTmpDisconnected) === 0) {
    const endConnected = createTime('connectedCallback', cmpMeta.$tagName$);
    // connectedCallback
    const hostRef = getHostRef(elm);

    if (BUILD.hostListener && cmpMeta.$listeners$) {
      // initialize our event listeners on the host element
      // we do this now so that we can listening to events that may
      // have fired even before the instance is ready
      hostRef.$rmListeners$ = addEventListeners(elm, hostRef, cmpMeta.$listeners$);
    }

    if (!(hostRef.$flags$ & HOST_FLAGS.hasConnected)) {
      // first time this component has connected
      hostRef.$flags$ |= HOST_FLAGS.hasConnected;

      let hostId: string;
      if (BUILD.hydrateClientSide) {
        hostId = elm.getAttribute(HYDRATE_ID);
        if (hostId) {
          if (BUILD.shadowDom && supportsShadowDom && cmpMeta.$flags$ & CMP_FLAGS.shadowDomEncapsulation) {
            const scopeId = BUILD.mode ? addStyle(elm.shadowRoot, cmpMeta, elm.getAttribute('s-mode')) : addStyle(elm.shadowRoot, cmpMeta);
            elm.classList.remove(scopeId + '-h', scopeId + '-s');
          }
          initializeClientHydrate(elm, cmpMeta.$tagName$, hostId, hostRef);
        }
      }

      if (BUILD.slotRelocation && !hostId) {
        // initUpdate
        // if the slot polyfill is required we'll need to put some nodes
        // in here to act as original content anchors as we move nodes around
        // host element has been connected to the DOM
        if (
          (BUILD.hydrateServerSide) ||
          (BUILD.slot && cmpMeta.$flags$ & CMP_FLAGS.hasSlotRelocation) ||
          (BUILD.shadowDom && cmpMeta.$flags$ & CMP_FLAGS.needsShadowDomShim)) {
          setContentReference(elm);
        }
      }

      if (BUILD.asyncLoading) {
        // find the first ancestor component (if there is one) and register
        // this component as one of the actively loading child components for its ancestor
        let ancestorComponent = elm;

        while ((ancestorComponent = (ancestorComponent.parentNode as any || ancestorComponent.host as any))) {
          // climb up the ancestors looking for the first
          // component that hasn't finished its lifecycle update yet
          if (
            (BUILD.hydrateClientSide && ancestorComponent.nodeType === NODE_TYPE.ElementNode && ancestorComponent.hasAttribute('s-id')) ||
            (ancestorComponent['s-p'])
          ) {
            // we found this components first ancestor component
            // keep a reference to this component's ancestor component
            attachToAncestor(hostRef, (hostRef.$ancestorComponent$ = ancestorComponent));
            break;
          }
        }
      }

      // Lazy properties
      // https://developers.google.com/web/fundamentals/web-components/best-practices#lazy-properties
      if (BUILD.prop && BUILD.lazyLoad && !BUILD.hydrateServerSide && cmpMeta.$members$) {
        Object.entries(cmpMeta.$members$).forEach(([memberName, [memberFlags]]) => {
          if (memberFlags & MEMBER_FLAGS.Prop && elm.hasOwnProperty(memberName)) {
            const value = (elm as any)[memberName];
            delete (elm as any)[memberName];
            (elm as any)[memberName] = value;
          }
        });
      }

      if (BUILD.initializeNextTick) {
        // connectedCallback, taskQueue, initialLoad
        // angular sets attribute AFTER connectCallback
        // https://github.com/angular/angular/issues/18909
        // https://github.com/angular/angular/issues/19940
        nextTick(() => initializeComponent(elm, hostRef, cmpMeta));

      } else {
        initializeComponent(elm, hostRef, cmpMeta);
      }
    }
    fireConnectedCallback(hostRef.$lazyInstance$);
    endConnected();
  }
};


const setContentReference = (elm: d.HostElement) => {
  // only required when we're NOT using native shadow dom (slot)
  // or this browser doesn't support native shadow dom
  // and this host element was NOT created with SSR
  // let's pick out the inner content for slot projection
  // create a node to represent where the original
  // content was first placed, which is useful later on
  const contentRefElm = elm['s-cr'] = (doc.createComment(
    BUILD.isDebug
      ? `content-ref (host=${elm.localName})`
      : ''
  ) as any);
  contentRefElm['s-cn'] = true;
  elm.insertBefore(contentRefElm, elm.firstChild);
};
