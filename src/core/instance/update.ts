import { Build } from '../../util/build-conditionals';
import { callNodeRefs } from '../renderer/patch';
import { ComponentInstance, HostElement, PlatformApi } from '../../declarations';
import { initComponentInstance } from './init-component-instance';
import { render } from './render';
import { RUNTIME_ERROR } from '../../util/constants';


export function queueUpdate(plt: PlatformApi, elm: HostElement) {
  // only run patch if it isn't queued already
  if (!plt.isQueuedForUpdate.has(elm)) {
    plt.isQueuedForUpdate.set(elm, true);

    // run the patch in the next tick
    plt.queue.add(() => {
      // vdom diff and patch the host element for differences
      update(plt, elm);
    });
  }
}


export function update(plt: PlatformApi, elm: HostElement, isInitialLoad?: boolean, instance?: ComponentInstance, ancestorHostElement?: HostElement) {
  // no longer queued for update
  plt.isQueuedForUpdate.delete(elm);

  // everything is async, so somehow we could have already disconnected
  // this node, so be sure to do nothing if we've already disconnected
  if (!plt.isDisconnectedMap.has(elm)) {
    instance = plt.instanceMap.get(elm);
    isInitialLoad = !instance;
    let userPromise: Promise<void>;

    if (isInitialLoad) {
      ancestorHostElement = plt.ancestorHostElementMap.get(elm);
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
      instance = initComponentInstance(plt, elm);

      if (Build.cmpWillLoad) {
        // fire off the user's componentWillLoad method (if one was provided)
        // componentWillLoad only runs ONCE, after instance's element has been
        // assigned as the host element, but BEFORE render() has been called
        try {
          if (instance.componentWillLoad) {
            userPromise = instance.componentWillLoad();
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
        if (instance.componentWillUpdate) {
          userPromise = instance.componentWillUpdate();
        }
      } catch (e) {
        plt.onError(e, RUNTIME_ERROR.WillUpdateError, elm);
      }
    }

    if (userPromise && userPromise.then) {
      // looks like the user return a promise!
      // let's not actually kick off the render
      // until the user has resolved their promise
      userPromise.then(() => renderUpdate(plt, elm, instance, isInitialLoad));

    } else {
      // user never returned a promise so there's
      // no need to wait on anything, let's do the render now my friend
      renderUpdate(plt, elm, instance, isInitialLoad);
    }
  }
}


export function renderUpdate(plt: PlatformApi, elm: HostElement, instance: ComponentInstance, isInitialLoad: boolean) {
  // if this component has a render function, let's fire
  // it off and generate a vnode for this
  render(plt, plt.getComponentMeta(elm), elm, instance, !isInitialLoad);
  // _hasRendered was just set
  // _onRenderCallbacks were all just fired off

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
        instance.componentDidUpdate && instance.componentDidUpdate();
      }
    }

    callNodeRefs(plt.vnodeMap.get(elm));

  } catch (e) {
    // derp
    plt.onError(e, RUNTIME_ERROR.DidUpdateError, elm, true);
  }
}
