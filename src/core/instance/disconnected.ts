import { detachListeners } from './events';
import { HostElement, PlatformApi } from '../../util/interfaces';
import { invokeDestroy } from '../renderer/patch';


export function disconnectedCallback(plt: PlatformApi, elm: HostElement) {
  // only disconnect if we're not temporarily disconnected
  // tmpDisconnected will happen when slot nodes are being relocated
  if (!plt.tmpDisconnected) {

    // ok, let's officially destroy this thing
    // set this to true so that any of our pending async stuff
    // doesn't continue since we already decided to destroy this node
    elm._hasDestroyed = true;

    // call instance Did Unload and destroy instance stuff
    // if we've created an instance for this
    const instance = elm.$instance;
    if (instance) {
      // call the user's componentDidUnload if there is one
      instance.componentDidUnload && instance.componentDidUnload();
      elm.$instance = instance.__el = instance.__values = instance.__values.__propWillChange = instance.__values.__propDidChange = null;
    }

    // detatch any event listeners that may have been added
    // this will also set _listeners to null if there are any
    detachListeners(elm);

    // destroy the vnode and child vnodes if they exist
    elm._vnode && invokeDestroy(elm._vnode);

    if (elm._hostContentNodes) {
      // overreacting here just to reduce any memory leak issues
      elm._hostContentNodes = elm._hostContentNodes.defaultSlot = elm._hostContentNodes.namedSlots = null;
    }

    // fuhgeddaboudit
    // set it all to null to ensure we forget references
    // and reset values incase this node gets reused somehow
    // (possible that it got disconnected, but the node was reused)
    elm._root = elm._vnode = elm._ancestorHostElement = elm._activelyLoadingChildren = elm._hasConnected = elm._isQueuedForUpdate = elm._hasLoaded = null;
  }
}
