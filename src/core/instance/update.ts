import { initComponentInstance } from './init';
import { HostElement, PlatformApi } from '../../util/interfaces';
import { INIT_INSTANCE_ERROR, INITIAL_LOAD_ERROR, RENDER_ERROR } from '../../util/constants';


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
      try {
        initComponentInstance(plt, elm);
      } catch (e) {
        plt.onError(INIT_INSTANCE_ERROR, e, elm);
      }
    }

    // if this component has a render function, let's fire
    // it off and generate a vnode for this
    try {
      elm._render(!isInitialLoad);
    } catch (e) {
      plt.onError(RENDER_ERROR, e, elm);
    }

    if (isInitialLoad) {
      try {
        elm._initLoad();
      } catch (e) {
        plt.onError(INITIAL_LOAD_ERROR, e, elm);
      }
    }
  }
}
