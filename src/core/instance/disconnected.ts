import { Build } from '../../util/build-conditionals';
import { callNodeRefs } from '../renderer/patch';
import { DomApi, HostElement, PlatformApi } from '../../util/interfaces';
import { NODE_TYPE } from '../../util/constants';
import { propagateElementLoaded } from './init-component';


export function disconnectedCallback(plt: PlatformApi, elm: HostElement) {
  // only disconnect if we're not temporarily disconnected
  // tmpDisconnected will happen when slot nodes are being relocated
  if (!plt.tmpDisconnected && isDisconnected(plt.domApi, elm)) {

    // ok, let's officially destroy this thing
    // set this to true so that any of our pending async stuff
    // doesn't continue since we already decided to destroy this node
    elm._hasDestroyed = true;

    // double check that we've informed the ancestor host elements
    // that they're good to go and loaded (cuz this one is on its way out)
    propagateElementLoaded(elm);

    // since we're disconnecting, call all of the JSX ref's with null
    callNodeRefs(elm._vnode, true);

    // detatch any event listeners that may have been added
    // because we're not passing an exact event name it'll
    // remove all of this element's event, which is good
    plt.domApi.$removeEventListener(elm);

    if (Build.slot && elm._hostContentNodes) {
      // overreacting here just to reduce any memory leak issues
      elm._hostContentNodes = elm._hostContentNodes.defaultSlot = elm._hostContentNodes.namedSlots = null;
    }

    // call instance Did Unload and destroy instance stuff
    // if we've created an instance for this
    if (elm._instance) {
      if (Build.cmpDidUnload) {
        // call the user's componentDidUnload if there is one
        elm._instance.componentDidUnload && elm._instance.componentDidUnload();
      }
      elm._instance = elm._instance.__el = null;
    }

    // fuhgeddaboudit
    // set it all to null to ensure we forget references
    // and reset values incase this node gets reused somehow
    // (possible that it got disconnected, but the node was reused)
    elm.$activeLoading = elm.$connected = elm.$defaultHolder = elm._root = elm._values = elm._vnode = elm._ancestorHostElement = elm._hasLoaded = elm._isQueuedForUpdate = elm._observer = null;
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
