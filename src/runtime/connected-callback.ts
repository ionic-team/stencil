import * as d from '@declarations';
import { BUILD } from '@build-conditionals';
import { getDoc, getHostRef, supportsShadowDom, tick } from '@platform';
import { addEventListeners } from './host-listener';
import { CMP_FLAG, HOST_STATE } from '@utils';
import { initializeComponent } from './initialize-component';


export const connectedCallback = (elm: d.HostElement, cmpMeta: d.ComponentRuntimeMeta) => {
    // connectedCallback
  if (!BUILD.updatable && !BUILD.member && !BUILD.lifecycle && !BUILD.hostListener) {
    // connectedCallback, initialLoad
    initializeComponent(elm, getHostRef(elm), cmpMeta);

  } else {
    const hostRef = getHostRef(elm);

    if (BUILD.hostListener && cmpMeta.l) {
      // initialize our event listeners on the host element
      // we do this now so that we can listening to events that may
      // have fired even before the instance is ready
      hostRef.$rmListeners$ = addEventListeners(elm, hostRef, cmpMeta.l);
    }

    if (!(hostRef.$stateFlags$ & HOST_STATE.hasConnected)) {
      // first time this component has connected
      hostRef.$stateFlags$ |= HOST_STATE.hasConnected;

      if (BUILD.slotRelocation) {
        // initUpdate, BUILD.slotRelocation
        // if the slot polyfill is required we'll need to put some nodes
        // in here to act as original content anchors as we move nodes around
        // host element has been connected to the DOM
        if ((BUILD.slot && cmpMeta.f & CMP_FLAG.hasSlotRelocation) || (BUILD.shadowDom && !supportsShadowDom && cmpMeta.f & CMP_FLAG.shadowDomEncapsulation)) {
          // only required when we're NOT using native shadow dom (slot)
          // or this browser doesn't support native shadow dom
          // and this host element was NOT created with SSR
          // let's pick out the inner content for slot projection
          // create a node to represent where the original
          // content was first placed, which is useful later on
          elm['s-cr'] = getDoc(elm).createComment(BUILD.isDebug ? `content-reference:${cmpMeta.t}` : '') as any;
          elm['s-cr']['s-cn'] = true;
          elm.insertBefore(elm['s-cr'], elm.firstChild);
        }

        if (BUILD.es5 && !supportsShadowDom && cmpMeta.f & CMP_FLAG.scopedCssEncapsulation) {
          try {
            (elm as any).shadowRoot = elm;
          } catch (e) {}
        }
      }

      if (BUILD.lifecycle) {
        // find the first ancestor component (if there is one) and register
        // this component as one of the actively loading child components for its ancestor
        let ancestorComponent = elm;

        while ((ancestorComponent = (ancestorComponent.parentNode as any || ancestorComponent.host as any))) {
          // climb up the ancestors looking for the first
          // component that hasn't finished its lifecycle update yet
          if (ancestorComponent['s-init'] && !ancestorComponent['s-lr']) {
            // we found this components first ancestor component
            // keep a reference to this component's ancestor component
            hostRef.$ancestorComponent$ = ancestorComponent;

            // ensure there is an array to contain a reference to each of the child components
            // and set this component as one of the ancestor's child components it should wait on
            (ancestorComponent['s-al'] = ancestorComponent['s-al'] || new Set()).add(elm);
            break;
          }
        }
      }

      // Lazy properties
      // https://developers.google.com/web/fundamentals/web-components/best-practices#lazy-properties
      if (BUILD.prop && cmpMeta.m) {
        Object.keys(cmpMeta.m).forEach(memberName => {
          if (elm.hasOwnProperty(memberName)) {
            const value = (elm as any)[memberName];
            delete (elm as any)[memberName];
            (elm as any)[memberName] = value;
          }
        });
      }

      if (BUILD.taskQueue && BUILD.mode) {
        // connectedCallback, taskQueue, initialLoad
        // angular sets attribute AFTER connectCallback
        // https://github.com/angular/angular/issues/18909
        // https://github.com/angular/angular/issues/19940
        tick.then(() => initializeComponent(elm, hostRef, cmpMeta));

      } else {
        initializeComponent(elm, hostRef, cmpMeta);
      }
    }
  }
};
