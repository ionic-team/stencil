import * as d from '../declarations';
import { callNodeRefs } from '../renderer/vdom/patch';
import { initEventEmitters } from './init-event-emitters';
import { NODE_TYPE, RUNTIME_ERROR } from '../util/constants';
import { proxyComponentInstance } from './proxy-component-instance';


export function initComponentInstance(
  plt: d.PlatformApi,
  elm: d.HostElement,
  hostSnapshot: d.HostSnapshot,
  instance?: d.ComponentInstance,
  componentConstructor?: d.ComponentConstructor,
  queuedEvents?: any[],
  i?: number
) {
  try {
    // using the user's component class, let's create a new instance
    componentConstructor = plt.getComponentMeta(elm).componentConstructor;
    instance = new (componentConstructor as any)();

    // ok cool, we've got an host element now, and a actual instance
    // and there were no errors creating the instance

    // let's upgrade the data on the host element
    // and let the getters/setters do their jobs
    proxyComponentInstance(plt, componentConstructor, elm, instance, hostSnapshot);

    if (__BUILD_CONDITIONALS__.event) {
      // add each of the event emitters which wire up instance methods
      // to fire off dom events from the host element
      initEventEmitters(plt, componentConstructor.events, instance);
    }

    if (__BUILD_CONDITIONALS__.listener) {
      try {
        // replay any event listeners on the instance that
        // were queued up between the time the element was
        // connected and before the instance was ready
        queuedEvents = plt.queuedEvents.get(elm);
        if (queuedEvents) {
          // events may have already fired before the instance was even ready
          // now that the instance is ready, let's replay all of the events that
          // we queued up earlier that were originally meant for the instance
          for (i = 0; i < queuedEvents.length; i += 2) {
            // data was added in sets of two
            // first item the eventMethodName
            // second item is the event data
            // take a look at initElementListener()
            instance[queuedEvents[i]](queuedEvents[i + 1]);
          }
          plt.queuedEvents.delete(elm);
        }

      } catch (e) {
        plt.onError(e, RUNTIME_ERROR.QueueEventsError, elm);
      }
    }

  } catch (e) {
    // something done went wrong trying to create a component instance
    // create a dumby instance so other stuff can load
    // but chances are the app isn't fully working cuz this component has issues
    instance = {};
    plt.onError(e, RUNTIME_ERROR.InitInstanceError, elm, true);
  }

  plt.instanceMap.set(elm, instance);

  return instance;
}


export function initComponentLoaded(plt: d.PlatformApi, elm: d.HostElement, hydratedCssClass: string, instance?: d.ComponentInstance, onReadyCallbacks?: d.OnReadyCallback[]): any {

  if (__BUILD_CONDITIONALS__.polyfills && !allChildrenHaveConnected(plt, elm)) {
    // this check needs to be done when using the customElements polyfill
    // since the polyfill uses MutationObserver which causes the
    // connectedCallbacks to fire async, which isn't ideal for the code below
    return;
  }

  // all is good, this component has been told it's time to finish loading
  // it's possible that we've already decided to destroy this element
  // check if this element has any actively loading child elements
  if (
    !plt.hasLoadedMap.has(elm) &&
    (instance = plt.instanceMap.get(elm)) &&
    !plt.isDisconnectedMap.has(elm) &&
    (!elm['s-ld'] || !elm['s-ld'].length)
  ) {
    // cool, so at this point this element isn't already being destroyed
    // and it does not have any child elements that are still loading
    // ensure we remove any child references cuz it doesn't matter at this point
    delete elm['s-ld'];

    // sweet, this particular element is good to go
    // all of this element's children have loaded (if any)
    // elm._hasLoaded = true;
    plt.hasLoadedMap.set(elm, true);

    try {
      // fire off the ref if it exists
      callNodeRefs(plt.vnodeMap.get(elm));

      // fire off the user's elm.componentOnReady() callbacks that were
      // put directly on the element (well before anything was ready)
      if (onReadyCallbacks = plt.onReadyCallbacksMap.get(elm)) {
        onReadyCallbacks.forEach(cb => cb(elm));
        plt.onReadyCallbacksMap.delete(elm);
      }

      if (__BUILD_CONDITIONALS__.cmpDidLoad) {
        // fire off the user's componentDidLoad method (if one was provided)
        // componentDidLoad only runs ONCE, after the instance's element has been
        // assigned as the host element, and AFTER render() has been called
        // we'll also fire this method off on the element, just to
        instance.componentDidLoad && instance.componentDidLoad();
      }

    } catch (e) {
      plt.onError(e, RUNTIME_ERROR.DidLoadError, elm);
    }

    // add the css class that this element has officially hydrated
    plt.domApi.$addClass(elm, hydratedCssClass);

    // ( •_•)
    // ( •_•)>⌐■-■
    // (⌐■_■)

    // load events fire from bottom to top
    // the deepest elements load first then bubbles up
    propagateComponentLoaded(plt, elm);
  }
}


function allChildrenHaveConnected(plt: d.PlatformApi, elm: d.HostElement) {
  // Note: in IE11 <svg> does not have the "children" property
  for (let i = 0; i < elm.childNodes.length; i++) {
    if (elm.childNodes[i].nodeType === NODE_TYPE.ElementNode) {
      if (plt.getComponentMeta(elm.childNodes[i] as any) && !plt.hasConnectedMap.has(elm.childNodes[i] as d.HostElement)) {
        // this is a defined componnent
        // but it hasn't connected yet
        return false;
      }
      if (!allChildrenHaveConnected(plt, elm.childNodes[i] as d.HostElement)) {
        // one of the defined child components hasn't connected yet
        return false;
      }
    }
  }
  // everything has connected, we're good
  return true;
}


export function propagateComponentLoaded(plt: d.PlatformApi, elm: d.HostElement, index?: number, ancestorsActivelyLoadingChildren?: d.HostElement[]) {
  // load events fire from bottom to top
  // the deepest elements load first then bubbles up
  const ancestorHostElement = plt.ancestorHostElementMap.get(elm);

  if (ancestorHostElement) {
    // ok so this element already has a known ancestor host element
    // let's make sure we remove this element from its ancestor's
    // known list of child elements which are actively loading
    ancestorsActivelyLoadingChildren = ancestorHostElement['s-ld'] || (ancestorHostElement as any)['$activeLoading'];

    if (ancestorsActivelyLoadingChildren) {
      index = ancestorsActivelyLoadingChildren.indexOf(elm);
      if (index > -1) {
        // yup, this element is in the list of child elements to wait on
        // remove it so we can work to get the length down to 0
        ancestorsActivelyLoadingChildren.splice(index, 1);
      }

      // the ancestor's initLoad method will do the actual checks
      // to see if the ancestor is actually loaded or not
      // then let's call the ancestor's initLoad method if there's no length
      // (which actually ends up as this method again but for the ancestor)
      if (!ancestorsActivelyLoadingChildren.length) {
        ancestorHostElement['s-init'] && ancestorHostElement['s-init']();

        // $initLoad deprecated 2018-04-02
        (ancestorHostElement as any)['$initLoad'] && (ancestorHostElement as any)['$initLoad']();
      }
    }

    plt.ancestorHostElementMap.delete(elm);
  }
}
