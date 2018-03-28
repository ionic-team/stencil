import * as d from '../declarations';


export function initCoreComponentOnReady(plt: d.PlatformApi, App: d.AppGlobal) {
  // create the function the HTMLElement.prototype.componentOnReady will end up calling

  App.componentOnReady = (elm, resolve) => {
    if (plt.getComponentMeta(elm) && !plt.hasLoadedMap.has(elm)) {
      // this is a known component and the
      // host element hasn't finished loading yet
      const onReadyCallbacks = plt.onReadyCallbacksMap.get(elm) || [];
      onReadyCallbacks.push(resolve);
      plt.onReadyCallbacksMap.set(elm, onReadyCallbacks);

    } else {
      // either the host element has already loaded
      // or it's not even a component
      resolve(elm);
    }
  };

  // drain the queue that could have been filled up before the core fully loaded
  App.$r && App.$r.forEach(r => App.componentOnReady(r[0], r[1]));

  // remove the queue now that the core file has initialized
  App.$r = null;
}
