import { Build } from '../../util/build-conditionals';
import { HostElement, PlatformApi } from '../../util/interfaces';
import { initComponentInstance } from './init-component';
import { render } from './render';
import { RUNTIME_ERROR } from '../../util/constants';


export function queueUpdate(plt: PlatformApi, elm: HostElement) {
  // only run patch if it isn't queued already
  if (!elm._isQueuedForUpdate) {
    elm._isQueuedForUpdate = true;

    // run the patch in the next tick
    plt.queue.add(() => {
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
    const isInitialLoad = !elm._instance;
    let userPromise: Promise<void>;

    if (isInitialLoad) {
      const ancestorHostElement = elm._ancestorHostElement;
      if (ancestorHostElement && !ancestorHostElement.$rendered) {
        // this is the intial load
        // this element has an ancestor host element
        // but the ancestor host element has NOT rendered yet
        // so let's just cool our jets and wait for the ancestor to render
        (ancestorHostElement.$onRender = ancestorHostElement.$onRender || []).push(() => {
          // this will get fired off when the ancestor host element
          // finally gets around to rendering its lazy self
          update(plt, elm);
        });
        return;
      }

      // haven't created a component instance for this host element yet!
      // create the instance from the user's component class
      // https://www.youtube.com/watch?v=olLxrojmvMg
      initComponentInstance(plt, elm);

      if (Build.cmpWillLoad) {
        // fire off the user's componentWillLoad method (if one was provided)
        // componentWillLoad only runs ONCE, after instance's element has been
        // assigned as the host element, but BEFORE render() has been called
        try {
          if (elm._instance.componentWillLoad) {
            userPromise = elm._instance.componentWillLoad();
          }
        } catch (e) {
          plt.onError(e, RUNTIME_ERROR.WillLoadError, elm);
        }
      }

    } else if (Build.cmpWillUpdate) {
      // already created an instance and this is an update
      // fire off the user's componentWillUpdate method (if one was provided)
      // componentWillUpdate runs BEFORE render() has been called
      // but only BEFORE an UPDATE and not before the intial render
      // get the returned promise (if one was provided)
      try {
        if (elm._instance.componentWillUpdate) {
          userPromise = elm._instance.componentWillUpdate();
        }
      } catch (e) {
        plt.onError(e, RUNTIME_ERROR.WillUpdateError, elm);
      }
    }

    if (userPromise && userPromise.then) {
      // looks like the user return a promise!
      // let's not actually kick off the render
      // until the user has resolved their promise
      userPromise.then(() => renderUpdate(plt, elm, isInitialLoad));

    } else {
      // user never returned a promise so there's
      // no need to wait on anything, let's do the render now my friend
      renderUpdate(plt, elm, isInitialLoad);
    }
  }
}


export function renderUpdate(plt: PlatformApi, elm: HostElement, isInitialLoad: boolean) {
  if (Build.render || Build.hostData) {
    // if this component has a render function, let's fire
    // it off and generate a vnode for this
    try {
      render(plt, elm, plt.getComponentMeta(elm), !isInitialLoad);
      // _hasRendered was just set
      // _onRenderCallbacks were all just fired off

    } catch (e) {
      plt.onError(e, RUNTIME_ERROR.RenderError, elm, true);
    }
  }

  try {
    if (isInitialLoad) {
      // so this was the initial load i guess
      elm.$initLoad();
      // componentDidLoad just fired off

    } else {
      if (Build.cmpDidUpdate) {
        // fire off the user's componentDidUpdate method (if one was provided)
        // componentDidUpdate runs AFTER render() has been called
        // but only AFTER an UPDATE and not after the intial render
        elm._instance.componentDidUpdate && elm._instance.componentDidUpdate();
      }
    }

  } catch (e) {
    // derp
    plt.onError(e, RUNTIME_ERROR.DidUpdateError, elm, true);
  }
}
