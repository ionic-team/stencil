import { callNodeRefs } from '../renderer/vdom/patch';
import { DomApi, HostElement, PlatformApi } from '../declarations';
import { NODE_TYPE } from '../util/constants';
import { propagateComponentReady } from './init-component-instance';


export function disconnectedCallback(plt: PlatformApi, elm: HostElement, perf: Performance) {
  // only disconnect if we're not temporarily disconnected
  // tmpDisconnected will happen when slot nodes are being relocated
  if (!plt.tmpDisconnected && isDisconnected(plt.domApi, elm)) {
    if (__BUILD_CONDITIONALS__.perf) {
      perf.mark(`disconnected_start:${elm.nodeName.toLowerCase()}:${elm['s-id']}`);
    }

    // ok, let's officially destroy this thing
    // set this to true so that any of our pending async stuff
    // doesn't continue since we already decided to destroy this node
    // elm._hasDestroyed = true;
    plt.isDisconnectedMap.set(elm, true);

    // double check that we've informed the ancestor host elements
    // that they're good to go and loaded (cuz this one is on its way out)
    propagateComponentReady(plt, elm);

    // since we're disconnecting, call all of the JSX ref's with null
    callNodeRefs(plt.vnodeMap.get(elm), true);

    // detatch any event listeners that may have been added
    // because we're not passing an exact event name it'll
    // remove all of this element's event, which is good
    plt.domApi.$removeEventListener(elm);
    plt.hasListenersMap.delete(elm);

    if (__BUILD_CONDITIONALS__.cmpDidUnload) {
      // call instance componentDidUnload
      // if we've created an instance for this
      const instance = plt.instanceMap.get(elm);
      if (instance && instance.componentDidUnload) {
        // call the user's componentDidUnload if there is one
        instance.componentDidUnload();
      }
    }

    // clear CSS var-shim tracking
    if (__BUILD_CONDITIONALS__.cssVarShim && plt.customStyle) {
      plt.customStyle.removeHost(elm);
    }

    // clear any references to other elements
    // more than likely we've already deleted these references
    // but let's double check there pal
    [
      plt.ancestorHostElementMap,
      plt.onReadyCallbacksMap,
      plt.hostSnapshotMap
    ].forEach(wm => wm.delete(elm));

    if (__BUILD_CONDITIONALS__.perf) {
      perf.mark(`disconnected_end:${elm.nodeName.toLowerCase()}:${elm['s-id']}`);
      perf.measure(`disconnected:${elm.nodeName.toLowerCase()}:${elm['s-id']}`, `disconnected_start:${elm.nodeName.toLowerCase()}:${elm['s-id']}`, `disconnected_end:${elm.nodeName.toLowerCase()}:${elm['s-id']}`);
    }
  }
}


export function isDisconnected(domApi: DomApi, elm: Node): any {
  while (elm) {
    if (!domApi.$parentNode(elm)) {
      return domApi.$nodeType(elm) !== NODE_TYPE.DocumentNode;
    }
    elm = domApi.$parentNode(elm);
  }
}
