import { initComponentInstance } from './init';
import { HostElement, PlatformApi } from '../../util/interfaces';
import { stopObserving, startObserving } from './mutation-observer';
import { INIT_INSTANCE_ERROR, INITIAL_LOAD_ERROR, RENDER_ERROR, WILL_LOAD_ERROR, WILL_UPDATE_ERROR } from '../../util/constants';


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
    let userPromise: Promise<void> = null;

    if (isInitialLoad) {
      // haven't created a component instance for this host element yet
      try {
        // create the instance from the user's component class
        initComponentInstance(plt, elm);

        // fire off the user's componentWillLoad method (if one was provided)
        // componentWillLoad only runs ONCE, after instance's element has been
        // assigned as the host element, but BEFORE render() has been called
        try {
          if (elm.$instance.componentWillLoad) {
            userPromise = elm.$instance.componentWillLoad();
          }
        } catch (e) {
          plt.onError(WILL_LOAD_ERROR, e, elm);
        }

      } catch (e) {
        plt.onError(INIT_INSTANCE_ERROR, e, elm);
      }

    } else {
      // already created an instance and this is an update
      // fire off the user's componentWillUpdate method (if one was provided)
      // componentWillUpdate runs BEFORE render() has been called
      // but only BEFORE an UPDATE and not before the intial render
      // get the returned promise (if one was provided)
      try {
        if (elm.$instance.componentWillUpdate) {
          userPromise = elm.$instance.componentWillUpdate();
        }
      } catch (e) {
        plt.onError(WILL_UPDATE_ERROR, e, elm);
      }
    }

    if (userPromise && userPromise.then) {
      // looks like the user return a promise!
      // let's not actually kick off the render
      // until the user has resolved their promise
      userPromise.then(function componentWillLoadResolved() {
        renderUpdate(plt, elm, isInitialLoad);
      });

    } else {
      // user never returned a promise so there's
      // no need to wait on anything, let's do the render now
      renderUpdate(plt, elm, isInitialLoad);
    }
  }
}


function renderUpdate(plt: PlatformApi, elm: HostElement, isInitialLoad: boolean) {
  // stop the observer so that we do not observe our own changes
  stopObserving(plt, elm);

  // if this component has a render function, let's fire
  // it off and generate a vnode for this
  try {
    elm._render(!isInitialLoad);

  } catch (e) {
    plt.onError(RENDER_ERROR, e, elm);
  }

  // after render we need to start the observer back up.
  startObserving(plt, elm);

  if (isInitialLoad) {
    try {
      elm._initLoad();
    } catch (e) {
      plt.onError(INITIAL_LOAD_ERROR, e, elm);
    }
  }
}
