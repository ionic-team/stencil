import { HostElement, PlatformApi } from '../../util/interfaces';
import { initComponentInstance } from './init';
import { RUNTIME_ERROR } from '../../util/constants';
import { stopObserving, startObserving } from './mutation-observer';


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
    let userPromise: Promise<void>;

    if (isInitialLoad) {
      const ancestorHostElement = elm._ancestorHostElement;
      if (ancestorHostElement && !ancestorHostElement._hasRendered) {
        // this is the intial load
        // this element has an ancestor host element
        // but the ancestor host element has NOT rendered yet
        // so let's just cool our jets and wait for the ancestor to render
        (ancestorHostElement._onRenderCallbacks = ancestorHostElement._onRenderCallbacks || []).push(() => {
          // this will get fired off when the ancestor host element
          // finally gets around to rendering its lazy self
          update(plt, elm);
        });
        return;
      }

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
          plt.onError(RUNTIME_ERROR.WillLoadError, e, elm);
        }

      } catch (e) {
        plt.onError(RUNTIME_ERROR.InitInstanceError, e, elm);
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
        plt.onError(RUNTIME_ERROR.WillUpdateError, e, elm);
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


export function renderUpdate(plt: PlatformApi, elm: HostElement, isInitialLoad: boolean) {
  // stop the observer so that we do not observe our own changes
  stopObserving(plt, elm);

  // if this component has a render function, let's fire
  // it off and generate a vnode for this
  try {
    elm._render(!isInitialLoad);
    // _hasRendered was just set
    // _onRenderCallbacks were all just fired off

  } catch (e) {
    plt.onError(RUNTIME_ERROR.RenderError, e, elm);
  }

  // after render we need to start the observer back up.
  startObserving(plt, elm);

  try {
    if (isInitialLoad) {
      // so this was the initial load i guess
      elm._initLoad();
      // componentDidLoad just fired off

    } else {
      // fire off the user's componentDidUpdate method (if one was provided)
      // componentDidUpdate runs AFTER render() has been called
      // but only AFTER an UPDATE and not after the intial render
      elm.$instance.componentDidUpdate && elm.$instance.componentDidUpdate();
    }

  } catch (e) {
    // derp
    plt.onError(RUNTIME_ERROR.DidUpdateError, e, elm);
  }
}
