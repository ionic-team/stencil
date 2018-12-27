import * as d from '../declarations';
import { initialLoad } from './initial-load';
import { refs } from './data';
import { resolved } from './task-queue';


export const connectedCallback = (elm: d.HostElement, elmData?: d.ElementData) => {
  // connectedCallback

  if (BUILD.updatable || BUILD.member || BUILD.lifecycle || BUILD.listener) {
    elmData = refs.get(elm);

    if (!elmData) {
      refs.set(elm, elmData = {
        elm: elm,
        instanceValues: new Map(),
        instance: BUILD.lazyLoad ? null : elm
      });
    }

    if (BUILD.listener) {
      // initialize our event listeners on the host element
      // we do this now so that we can listening to events that may
      // have fired even before the instance is ready
      // if (!elmData.hasListeners) {
        // it's possible we've already connected
        // then disconnected
        // and the same element is reconnected again
        // elmData.hasListeners = true;
        // initHostListeners(plt, elm, elmData, cmpCstr);
      // }
    }

    if (!elmData.hasConnected) {
      // first time this element has connected
      elmData.hasConnected = true;

      if (BUILD.lifecycle) {
        // register this component as an actively
        // loading child to its parent component
        // registerWithParentComponent(plt, elm, elmData);
      }

      if (BUILD.taskQueue) {
        // connectedCallback, initUpdate BUILD.taskQueue
        resolved.then(() => initialLoad(elm, elmData));

      } else {
        // connectedCallback, initUpdate
        initialLoad(elm, elmData);
      }
    }

  } else {
    // connectedCallback, initUpdate
    initialLoad(elm, { instance: elm });
  }
};


// export const registerWithParentComponent = (elm: d.HostElement, elmData: d.ElementData, ancestorHostElement?: d.HostElement) => {
//   // registerWithParentComponent

//   // find the first ancestor host element (if there is one) and register
//   // this element as one of the actively loading child elements for its ancestor
//   ancestorHostElement = elm;

//   while ((ancestorHostElement = ancestorHostElement.parentNode as any)) {
//     // climb up the ancestors looking for the first registered component
//     if (plt.isDefinedComponent(ancestorHostElement)) {
//       // we found this elements the first ancestor host element
//       // if the ancestor already loaded then do nothing, it's too late
//       if (!elmData.firedDidLoad) {

//         // keep a reference to this element's ancestor host element
//         // elm._ancestorHostElement = ancestorHostElement;
//         elmData.ancestorHostElement = ancestorHostElement;

//         // ensure there is an array to contain a reference to each of the child elements
//         // and set this element as one of the ancestor's child elements it should wait on
//         (ancestorHostElement['s-ld'] = ancestorHostElement['s-ld'] || []).push(elm);
//       }
//       break;
//     }
//   }
// };
