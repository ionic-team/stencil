import { HostElement, PlatformApi } from '../../util/interfaces';
import { getParentElement } from '../../util/helpers';


export function connectedCallback(plt: PlatformApi, elm: HostElement) {
  // do not reconnect if we've already created an instance for this element

  if (!elm._hasConnected) {
    // first time we've connected
    elm._hasConnected = true;

    // if somehow this node was reused, ensure we've removed this property
    delete elm._hasDestroyed;

    // get the component meta data about this component
    const cmpMeta = elm.$meta;

    // only do slot work if this component even has slots
    if (cmpMeta.hasSlotsMeta || true /* TODO!! */) {
      // TODO!!
      cmpMeta.namedSlotsMeta = ['start', 'end', 'mode-start', 'mode-end'];

      plt.collectHostContent(elm, cmpMeta.namedSlotsMeta);
    }

    // add to the queue to load the bundle
    // it's important to have an async tick in here so we can
    // ensure the "mode" attribute has been added to the element
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
    });
  }
}


export function getParentHostElement(plt: PlatformApi, elm: HostElement) {
  while (elm = getParentElement(elm)) {
    if (plt.getComponentMeta(elm.tagName)) {
      return elm;
    }
  }
  return null;
}


export function getRenderChildren(elm: HostElement) {
  const renderChildren: Node[] = [];
  for (var i = 0; i < elm.childNodes.length; i++) {
    renderChildren.push(elm.childNodes[i]);
  }
  return renderChildren;
}
