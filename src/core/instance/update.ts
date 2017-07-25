import { initComponentInstance } from './init';
import { HostElement, PlatformApi } from '../../util/interfaces';


export function queueUpdate(plt: PlatformApi, elm: HostElement) {
  // only run patch if it isn't queued already
  if (!elm._isQueuedForUpdate) {
    elm._isQueuedForUpdate = true;

    // run the patch in the next tick
    plt.queue.add(function queueUpdateNextTick() {
      // no longer queued
      elm._isQueuedForUpdate = false;

      // vdom diff and patch the host element for differences
      update(plt, elm);
    });
  }
}


export function update(plt: PlatformApi, elm: HostElement) {
  // everything is async, so somehow we could have already disconnected
  // this node, so be sure to do nothing if we've already disconnected
  if (!elm._hasDestroyed) {
    const isInitialLoad = !elm.$instance;

    if (isInitialLoad) {
      // haven't created a component instance for this host element yet
      initComponentInstance(plt, elm);
    }

    // if this component has a render function, let's fire
    // it off and generate a vnode for this
    elm._render(!isInitialLoad);

    if (isInitialLoad) {
      elm._initLoad();
    }
  }
}
