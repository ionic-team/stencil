import * as d from '../declarations';
import { initComponentInstance } from './init-component-instance';
import { render } from './render';
import { RUNTIME_ERROR } from '../util/constants';


export function queueUpdate(plt: d.PlatformApi, meta: d.InternalMeta) {
  // we're actively processing this component
  plt.processingCmp.add(meta.element);

  // only run patch if it isn't queued already
  if (!meta.isQueuedForUpdate) {
    meta.isQueuedForUpdate = true;
    // run the patch in the next tick
    // vdom diff and patch the host element for differences
    if (plt.isAppLoaded) {
      // app has already loaded
      // let's queue this work in the dom write phase
      plt.queue.write(() => update(plt, meta));

    } else {
      // app hasn't finished loading yet
      // so let's use next tick to do everything
      // as fast as possible
      plt.queue.tick(() => update(plt, meta));
    }
  }
}


export async function update(plt: d.PlatformApi, meta: d.InternalMeta) {
  const element = meta.element;

  // no longer queued for update
  meta.isQueuedForUpdate = false;

  // everything is async, so somehow we could have already disconnected
  // this node, so be sure to do nothing if we've already disconnected
  if (!meta.isDisconnected) {
    let instance = meta.instance;

    if (!instance) {
      const ancestorHostElement = meta.ancestorHostElement;

      if (ancestorHostElement && !ancestorHostElement['s-rn']) {
        // this is the intial load
        // this element has an ancestor host element
        // but the ancestor host element has NOT rendered yet
        // so let's just cool our jets and wait for the ancestor to render
        (ancestorHostElement['s-rc'] = ancestorHostElement['s-rc'] || []).push(() => {
          // this will get fired off when the ancestor host element
          // finally gets around to rendering its lazy self
          update(plt, meta);
        });
        return;
      }

      // haven't created a component instance for this host element yet!
      // create the instance from the user's component class
      // https://www.youtube.com/watch?v=olLxrojmvMg
      instance = initComponentInstance(plt, meta);

      if (__BUILD_CONDITIONALS__.cmpWillLoad && instance) {
        // this is the initial load and the instance was just created
        // fire off the user's componentWillLoad method (if one was provided)
        // componentWillLoad only runs ONCE, after instance's element has been
        // assigned as the host element, but BEFORE render() has been called
        try {
          if (instance.componentWillLoad) {
            await instance.componentWillLoad();
          }
        } catch (e) {
          plt.onError(e, RUNTIME_ERROR.WillLoadError, element);
        }
      }

    } else if (__BUILD_CONDITIONALS__.cmpWillUpdate && instance) {
      // component already initialized, this is an update
      // already created an instance and this is an update
      // fire off the user's componentWillUpdate method (if one was provided)
      // componentWillUpdate runs BEFORE render() has been called
      // but only BEFORE an UPDATE and not before the intial render
      // get the returned promise (if one was provided)
      try {
        if (instance.componentWillUpdate) {
          await instance.componentWillUpdate();
        }
      } catch (e) {
        plt.onError(e, RUNTIME_ERROR.WillUpdateError, meta.element);
      }
    }

    // if this component has a render function, let's fire
    // it off and generate a vnode for this
    render(plt, meta, element, instance);

    element['s-init']();

    if (__BUILD_CONDITIONALS__.hotModuleReplacement) {
      element['s-hmr-load'] && element['s-hmr-load']();
    }
  }
}
