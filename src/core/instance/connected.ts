import { getParentElement } from '../../util/helpers';
import { HostElement, PlatformApi } from '../../util/interfaces';
import { initElementListeners } from './listeners';
import { PRIORITY } from '../../util/constants';


export function connectedCallback(plt: PlatformApi, elm: HostElement) {
  // do not reconnect if we've already created an instance for this element

  if (!elm._hasConnected) {
    // first time we've connected
    elm._hasConnected = true;

    // if somehow this node was reused, ensure we've removed this property
    delete elm._hasDestroyed;

    // initialize our event listeners on the host element
    // we do this now so that we can listening to events that may
    // have fired even before the instance is ready
    initElementListeners(plt, elm);

    // register this component as an actively
    // loading child to its parent component
    registerWithParentComponent(plt, elm);

    // add to the queue to load the bundle
    // it's important to have an async tick in here so we can
    // ensure the "mode" attribute has been added to the element
    // place in high priority since it's not much work and we need
    // to know as fast as possible, but still an async tick in between
    plt.queue.add(() => {
      // get the component meta data about this component
      const cmpMeta = plt.getComponentMeta(elm);

      // only collects slot references if this component even has slots
      plt.connectHostElement(elm, cmpMeta.slotMeta);

      // start loading this component mode's bundle
      // if it's already loaded then the callback will be synchronous
      plt.loadBundle(cmpMeta, elm, function loadComponentCallback() {
        // we've fully loaded the component mode data
        // let's queue it up to be rendered next
        elm._queueUpdate();
      });

    }, PRIORITY.High);
  }
}


function registerWithParentComponent(plt: PlatformApi, elm: HostElement) {
  // find the first ancestor host element (if there is one) and register
  // this element as one of the actively loading child elements for its ancestor
  let ancestorHostElement = elm;

  while (ancestorHostElement = getParentElement(ancestorHostElement)) {
    // climb up the ancestors looking for the first registered component
    if (plt.getComponentMeta(ancestorHostElement)) {
      // we found this elements the first ancestor host element
      // if the ancestor already loaded then do nothing, it's too late
      if (!ancestorHostElement._hasLoaded) {

        // keep a reference to this element's ancestor host element
        elm._ancestorHostElement = ancestorHostElement;

        // ensure there is an array to contain a reference to each of the child elements
        // and set this element as one of the ancestor's child elements it should wait on
        if (ancestorHostElement._activelyLoadingChildren) {
          ancestorHostElement._activelyLoadingChildren.push(elm);
        } else {
          ancestorHostElement._activelyLoadingChildren = [elm];
        }
      }
      break;
    }
  }
}
