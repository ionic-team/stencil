import * as d from '../declarations';


export function initCoreComponentOnReady(plt: d.PlatformApi, App: d.AppGlobal, win?: any, apps?: string[], queuedComponentOnReadys?: d.QueuedComponentOnReady[]) {

  // add componentOnReady() to the App object
  // this also is used to know that the App's core is ready
  App.componentOnReady = (elm, resolve) => {

    if (!elm.nodeName.includes('-')) {
      resolve(null);
      return false;
    }

    const meta = plt.metaHostMap.get(elm);
    const cmpMeta = meta.cmpMeta;
    if (cmpMeta) {
      if (meta.isCmpReady) {
        // element has already loaded, pass the resolve the element component
        // so we know that the resolve knows it this element is an app component
        resolve(elm);

      } else {
        // element hasn't loaded yet or it has an update in progress
        // add this resolve specifically to this elements on ready queue
        meta.onReadyCallbacks.push(resolve);
      }
    }

    // return a boolean if this app recognized this element or not
    return !!cmpMeta;
  };

  if (queuedComponentOnReadys) {
    // we've got some componentOnReadys in the queue before the app was ready
    for (let i = queuedComponentOnReadys.length - 1; i >= 0; i--) {
      // go through each element and see if this app recongizes it
      if (App.componentOnReady(queuedComponentOnReadys[i][0], queuedComponentOnReadys[i][1])) {
        // turns out this element belongs to this app
        // remove the resolve from the queue so in the end
        // all that's left in the queue are elements not apart of any apps
        queuedComponentOnReadys.splice(i, 1);
      }
    }

    for (let i = 0; i < apps.length; i++) {
      if (!win[apps[i]].componentOnReady) {
        // there is at least 1 apps that isn't ready yet
        // so let's stop here cuz there's still app cores loading
        return;
      }
    }

    // if we got to this point then that means all of the apps are ready
    // and they would have removed any of their elements from queuedComponentOnReadys
    // so let's do the cleanup of the  remaining queuedComponentOnReadys
    for (let i = 0; i < queuedComponentOnReadys.length; i++) {
      // resolve any queued componentsOnReadys that are left over
      // since these elements were not apart of any apps
      // call the resolve fn, but pass null so it's know this wasn't a known app component
      queuedComponentOnReadys[i][1](null);
    }
    queuedComponentOnReadys.length = 0;
  }
}
