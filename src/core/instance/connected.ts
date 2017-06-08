import { HostElement, PlatformApi } from '../../util/interfaces';
import { getParentElement } from '../../util/helpers';
import { PRIORITY_HIGH } from '../../util/constants';


export function connectedCallback(plt: PlatformApi, elm: HostElement) {
  // do not reconnect if we've already created an instance for this element

  if (!elm._hasConnected) {
    // first time we've connected
    elm._hasConnected = true;

    // if somehow this node was reused, ensure we've removed this property
    delete elm._hasDestroyed;

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
          (ancestorHostElement._activelyLoadingChildren = ancestorHostElement._activelyLoadingChildren || []).push(elm);
        }
        break;
      }
    }

    // get the component meta data about this component
    const cmpMeta = plt.getComponentMeta(elm);

    // only do slot work if this component even has slots
    if (cmpMeta.hasSlotsMeta || true /* TODO!! */) {
      // TODO!!
      cmpMeta.namedSlotsMeta = ['start', 'end', 'mode-start', 'mode-end'];

      plt.collectHostContent(elm, cmpMeta.namedSlotsMeta);
    }

    // add to the queue to load the bundle
    // it's important to have an async tick in here so we can
    // ensure the "mode" attribute has been added to the element
    // place in high priority since it's not much work and we need
    // to know as fast as possible, but still an async tick in between
    plt.queue.add(() => {

      // get the mode the element which is loading
      // if there is no mode, then use "default"
      const cmpMode = cmpMeta.modesMeta[plt.getMode(elm)] || cmpMeta.modesMeta['default'];

      // start loading this component mode's bundle
      // if it's already loaded then the callback will be synchronous
      plt.loadBundle(cmpMode.bundleId, cmpMeta.priorityMeta, function loadComponentCallback() {

        // we've fully loaded the component mode data
        // let's queue it up to be rendered next
        elm._queueUpdate();
      });

    }, PRIORITY_HIGH);
  }
}
