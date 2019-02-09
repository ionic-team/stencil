import * as d from '@declarations';
import { BUILD } from '@build-conditionals';
import { doc, getHostRef, plt, tick } from '@platform';
import { getHostListenerTarget, hostListenerOpts, hostListenerProxy } from './host-listener';
import { HOST_STATE, LISTENER_FLAGS } from '@utils';
import { initializeComponent } from './initialize-component';


export const connectedCallback = (elm: d.HostElement, cmpMeta: d.ComponentRuntimeMeta, hostRef?: d.HostRef, ancestorHostElement?: d.HostElement) => {
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

    if ((hostRef.flags & HOST_STATE.hasConnected) === 0) {
      // first time this element has connected
      hostRef.flags |= HOST_STATE.hasConnected;

      if (BUILD.slotRelocation) {
        // initUpdate, BUILD.slotRelocation
        // if the slot polyfill is required we'll need to put some nodes
        // in here to act as original content anchors as we move nodes around
        // host element has been connected to the DOM
        if ((BUILD.slot && cmpMeta.cmpHasSlotRelocation) || (BUILD.shadowDom && !plt.supportsShadowDom && cmpMeta.cmpShadowDomEncapsulation)) {
          // only required when we're NOT using native shadow dom (slot)
          // or this browser doesn't support native shadow dom
          // and this host element was NOT created with SSR
          // let's pick out the inner content for slot projection
          // create a node to represent where the original
          // content was first placed, which is useful later on
          elm['s-cr'] = doc.createComment(BUILD.isDebug ? `content-reference:${elm.tagName.toLowerCase()}` : '') as any;
          elm['s-cr']['s-cn'] = true;
          elm.insertBefore(elm['s-cr'], elm.firstChild);
        }

        if (BUILD.es5 && !plt.supportsShadowDom && cmpMeta.cmpScopedCssEncapsulation) {
          try {
            (elm as any).shadowRoot = elm;
          } catch (e) {}
        }
      }

      if (BUILD.lifecycle) {
        // register this component as an actively
        // loading child to its parent component
        // find the first ancestor host element (if there is one) and register
        // this element as one of the actively loading child elements for its ancestor
        ancestorHostElement = elm;

        while ((ancestorHostElement = (ancestorHostElement.parentNode as any || ancestorHostElement.host as any))) {
          // climb up the ancestors looking for the first connected
          // component that hasn't finished loading yet
          if (ancestorHostElement['s-init']) {
            if (!ancestorHostElement['s-rn']) {
              // we found this elements the first ancestor host element
              // if the ancestor already rendered then do nothing, it's too late
              // keep a reference to this element's ancestor host element
              hostRef.ancestorHostElement = ancestorHostElement;

              // ensure there is an array to contain a reference to each of the child elements
              // and set this element as one of the ancestor's child elements it should wait on
              (ancestorHostElement['s-al'] = ancestorHostElement['s-al'] || new Set()).add(elm);
            }
            break;
          }
        }
      }

      if (BUILD.lifecycleDOMEvents) {
        hostRef.isRootComponent = !hostRef.ancestorHostElement;
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
