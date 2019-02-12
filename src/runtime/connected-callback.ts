import * as d from '@declarations';
import { BUILD } from '@build-conditionals';
import { doc, getHostRef, plt, tick } from '@platform';
import { getHostListenerTarget, hostListenerOpts, hostListenerProxy } from './host-listener';
import { CMP_FLAG, HOST_STATE, LISTENER_FLAGS } from '@utils';
import { initializeComponent } from './initialize-component';


export const connectedCallback = (elm: d.HostElement, cmpMeta: d.ComponentRuntimeMeta, hostRef?: d.HostRef, ancestorComponent?: d.HostElement) => {
  // connectedCallback

  if (!BUILD.lazyLoad) {
    cmpMeta = (elm.constructor as d.ComponentConstructor).cmpMeta;
  }

  if (BUILD.updatable || BUILD.member || BUILD.lifecycle || BUILD.hostListener) {
    hostRef = getHostRef(elm);

    if (BUILD.hostListener && cmpMeta.cmpHostListeners) {
      // initialize our event listeners on the host element
      // we do this now so that we can listening to events that may
      // have fired even before the instance is ready
      cmpMeta.cmpHostListeners.forEach(([flags, name, method]) => {
        if ((flags & LISTENER_FLAGS.Disabled) === 0) {
          if (BUILD.lazyLoad) {
            (hostRef.queuedReceivedHostEvents || (hostRef.queuedReceivedHostEvents = []));
          }
          (BUILD.hostListenerTarget ? getHostListenerTarget(elm, flags) : elm).addEventListener(name, hostListenerProxy(hostRef, method), hostListenerOpts(flags));
        }
      });
    }

    if (!(hostRef.flags & HOST_STATE.hasConnected)) {
      // first time this component has connected
      hostRef.flags |= HOST_STATE.hasConnected;

      if (BUILD.slotRelocation) {
        // initUpdate, BUILD.slotRelocation
        // if the slot polyfill is required we'll need to put some nodes
        // in here to act as original content anchors as we move nodes around
        // host element has been connected to the DOM
        if ((BUILD.slot && cmpMeta.cmpFlags & CMP_FLAG.hasSlotRelocation) || (BUILD.shadowDom && !plt.supportsShadowDom && cmpMeta.cmpFlags & CMP_FLAG.shadowDomEncapsulation)) {
          // only required when we're NOT using native shadow dom (slot)
          // or this browser doesn't support native shadow dom
          // and this host element was NOT created with SSR
          // let's pick out the inner content for slot projection
          // create a node to represent where the original
          // content was first placed, which is useful later on
          elm['s-cr'] = doc.createComment(BUILD.isDebug ? `content-reference:${cmpMeta.cmpTag}` : '') as any;
          elm['s-cr']['s-cn'] = true;
          elm.insertBefore(elm['s-cr'], elm.firstChild);
        }

        if (BUILD.es5 && !plt.supportsShadowDom && cmpMeta.cmpFlags & CMP_FLAG.scopedCssEncapsulation) {
          try {
            (elm as any).shadowRoot = elm;
          } catch (e) {}
        }
      }

      if (BUILD.lifecycle) {
        // find the first ancestor component (if there is one) and register
        // this component as one of the actively loading child components for its ancestor
        ancestorComponent = elm;

        while ((ancestorComponent = (ancestorComponent.parentNode as any || ancestorComponent.host as any))) {
          // climb up the ancestors looking for the first
          // component that hasn't finished its lifecycle update yet
          if (ancestorComponent['s-init'] && !ancestorComponent['s-lr']) {
            // we found this components first ancestor component
            // keep a reference to this component's ancestor component
            hostRef.ancestorComponent = ancestorComponent;

            // ensure there is an array to contain a reference to each of the child components
            // and set this component as one of the ancestor's child components it should wait on
            (ancestorComponent['s-al'] = ancestorComponent['s-al'] || new Set()).add(elm);
            break;
          }
        }
      }

      if (BUILD.taskQueue) {
        // connectedCallback, taskQueue, initialLoad
        tick.then(() => initializeComponent(elm, hostRef, cmpMeta));

      } else {
        initializeComponent(elm, hostRef, cmpMeta);
      }
    }

  } else {
    // connectedCallback, initialLoad
    initializeComponent(elm, getHostRef(elm), cmpMeta);
  }
};
