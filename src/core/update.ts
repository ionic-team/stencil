import * as d from '../declarations';
import { initComponentInstance } from './init-component-instance';
import { render } from './render';
import { RUNTIME_ERROR } from '../util/constants';


export function queueUpdate(plt: d.PlatformApi, elm: d.HostElement, perf: Performance) {
  if (__BUILD_CONDITIONALS__.profile) {
    perf.mark(`queue:${elm.nodeName.toLowerCase()}:${elm['s-id']}`);
  }

  // we're actively processing this component
  plt.processingCmp.add(elm);

  // only run patch if it isn't queued already
  if (!plt.isQueuedForUpdate.has(elm)) {
    plt.isQueuedForUpdate.set(elm, true);
    // run the patch in the next tick
    // vdom diff and patch the host element for differences
    if (plt.isAppLoaded) {
      // app has already loaded
      // let's queue this work in the dom write phase
      plt.queue.write(() => update(plt, elm, perf));

    } else {
      // app hasn't finished loading yet
      // so let's use next tick to do everything
      // as fast as possible
      plt.queue.tick(() => update(plt, elm, perf));
    }
  }
}


export async function update(plt: d.PlatformApi, elm: d.HostElement, perf: Performance, isInitialLoad?: boolean, instance?: d.ComponentInstance, ancestorHostElement?: d.HostElement) {
  if (__BUILD_CONDITIONALS__.isDev) {
    perf.mark(`update_start:${elm.nodeName.toLowerCase()}:${elm['s-id']}`);
  }

  // no longer queued for update
  plt.isQueuedForUpdate.delete(elm);

  // everything is async, so somehow we could have already disconnected
  // this node, so be sure to do nothing if we've already disconnected
  if (!plt.isDisconnectedMap.has(elm)) {
    instance = plt.instanceMap.get(elm);
    isInitialLoad = !instance;

    if (isInitialLoad) {
      ancestorHostElement = plt.ancestorHostElementMap.get(elm);

      if (ancestorHostElement && !ancestorHostElement['s-rn']) {
        // this is the intial load
        // this element has an ancestor host element
        // but the ancestor host element has NOT rendered yet
        // so let's just cool our jets and wait for the ancestor to render
        (ancestorHostElement['s-rc'] = ancestorHostElement['s-rc'] || []).push(() => {
          // this will get fired off when the ancestor host element
          // finally gets around to rendering its lazy self
          update(plt, elm, perf);
        });
        return;
      }

      // haven't created a component instance for this host element yet!
      // create the instance from the user's component class
      // https://www.youtube.com/watch?v=olLxrojmvMg
      instance = initComponentInstance(plt, elm, plt.hostSnapshotMap.get(elm), perf);

      if (__BUILD_CONDITIONALS__.cmpWillLoad && instance) {
        // this is the initial load and the instance was just created
        // fire off the user's componentWillLoad method (if one was provided)
        // componentWillLoad only runs ONCE, after instance's element has been
        // assigned as the host element, but BEFORE render() has been called
        try {
          if (instance.componentWillLoad) {
            if (__BUILD_CONDITIONALS__.profile) {
              perf.mark(`componentWillLoad_start:${elm.nodeName.toLowerCase()}:${elm['s-id']}`);
            }

            await instance.componentWillLoad();

            if (__BUILD_CONDITIONALS__.profile) {
              perf.mark(`componentWillLoad_end:${elm.nodeName.toLowerCase()}:${elm['s-id']}`);
              perf.measure(`componentWillLoad:${elm.nodeName.toLowerCase()}:${elm['s-id']}`, `componentWillLoad_start:${elm.nodeName.toLowerCase()}:${elm['s-id']}`, `componentWillLoad_end:${elm.nodeName.toLowerCase()}:${elm['s-id']}`);
            }
          }
        } catch (e) {
          plt.onError(e, RUNTIME_ERROR.WillLoadError, elm);
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
          if (__BUILD_CONDITIONALS__.profile) {
            perf.mark(`componentWillUpdate_start:${elm.nodeName.toLowerCase()}:${elm['s-id']}`);
          }

          await instance.componentWillUpdate();

          if (__BUILD_CONDITIONALS__.profile) {
            perf.mark(`componentWillUpdate_end:${elm.nodeName.toLowerCase()}:${elm['s-id']}`);
          }
        }
      } catch (e) {
        plt.onError(e, RUNTIME_ERROR.WillUpdateError, elm);
      }
    }

    // if this component has a render function, let's fire
    // it off and generate a vnode for this
    render(plt, plt.getComponentMeta(elm), elm, instance, perf);

    if (__BUILD_CONDITIONALS__.isDev) {
      perf.mark(`update_end:${elm.nodeName.toLowerCase()}:${elm['s-id']}`);
      perf.measure(`update:${elm.nodeName.toLowerCase()}:${elm['s-id']}`, `update_start:${elm.nodeName.toLowerCase()}:${elm['s-id']}`, `update_end:${elm.nodeName.toLowerCase()}:${elm['s-id']}`);
    }

    elm['s-init']();

    if (__BUILD_CONDITIONALS__.hotModuleReplacement) {
      elm['s-hmr-load'] && elm['s-hmr-load']();
    }
  }
}
