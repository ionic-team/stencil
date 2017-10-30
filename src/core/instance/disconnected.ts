import { callNodeRefs } from '../renderer/patch';
import { detachListeners } from './listeners';
import { HostElement, PlatformApi } from '../../util/interfaces';
import { propagateElementLoaded } from './init-component';


export function disconnectedCallback(plt: PlatformApi, elm: HostElement) {
  // only disconnect if we're not temporarily disconnected
  // tmpDisconnected will happen when slot nodes are being relocated
  if (!plt.tmpDisconnected && isDisconnected(elm)) {

    // ok, let's officially destroy this thing
    // set this to true so that any of our pending async stuff
    // doesn't continue since we already decided to destroy this node
    elm._hasDestroyed = true;

    // double check that we've informed the ancestor host elements
    // that they're good to go and loaded (cuz this one is on its way out)
    propagateElementLoaded(elm);

    callNodeRefs(elm._vnode, true);

    // detatch any event listeners that may have been added
    // this will also set _listeners to null if there are any
    detachListeners(elm);

    if (elm._hostContentNodes) {
      // overreacting here just to reduce any memory leak issues
      elm._hostContentNodes = elm._hostContentNodes.defaultSlot = elm._hostContentNodes.namedSlots = null;
    }

    // call instance Did Unload and destroy instance stuff
    // if we've created an instance for this
    const instance = elm.$instance;
    if (instance) {
      // call the user's componentDidUnload if there is one
      instance.componentDidUnload && instance.componentDidUnload();
      elm.$instance = instance.__el = null;
    }

    // fuhgeddaboudit
    // set it all to null to ensure we forget references
    // and reset values incase this node gets reused somehow
    // (possible that it got disconnected, but the node was reused)
    elm.$activeLoading = elm.$connected = elm.$defaultHolder = elm._root = elm._values = elm._vnode = elm._ancestorHostElement = elm._hasLoaded = elm._isQueuedForUpdate = elm._observer = null;
  }
}


function isDisconnected(elm: HTMLElement) {
  while (elm) {
    if (elm.parentElement === null) {
      return elm.tagName !== 'HTML';
    }
    elm = elm.parentElement;
  }
  return false;
}
