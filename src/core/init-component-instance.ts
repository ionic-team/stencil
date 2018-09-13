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


export function initComponentLoaded(plt: d.PlatformApi, elm: d.HostElement, hydratedCssClass: string, instance?: d.ComponentInstance, onReadyCallbacks?: d.OnReadyCallback[], hasCmpLoaded?: boolean): any {

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
    (instance = plt.instanceMap.get(elm)) &&
    !plt.isDisconnectedMap.has(elm) &&
    (!elm['s-ld'] || !elm['s-ld'].length)
  ) {
    // cool, so at this point this element isn't already being destroyed
    // and it does not have any child elements that are still loading

    // all of this element's children have loaded (if any)
    plt.isCmpReady.set(elm, true);

    if (!(hasCmpLoaded = plt.isCmpLoaded.has(elm))) {
      // remember that this component has loaded
      // isCmpLoaded map is useful to know if we should fire
      // the lifecycle componentDidLoad() or componentDidUpdate()
      plt.isCmpLoaded.set(elm, true);

      // ensure we remove any child references cuz it doesn't matter at this point
      elm['s-ld'] = undefined;

      // add the css class that this element has officially hydrated
      plt.domApi.$addClass(elm, hydratedCssClass);
    }

    try {
      // fire off the ref if it exists
      callNodeRefs(plt.vnodeMap.get(elm));

      // fire off the user's elm.componentOnReady() callbacks that were
      // put directly on the element (well before anything was ready)
      if (onReadyCallbacks = plt.onReadyCallbacksMap.get(elm)) {
        onReadyCallbacks.forEach(cb => cb(elm));
        plt.onReadyCallbacksMap.delete(elm);
      }

      if (__BUILD_CONDITIONALS__.cmpDidLoad && !hasCmpLoaded && instance.componentDidLoad) {
        // we've never loaded this component
        // fire off the user's componentDidLoad method (if one was provided)
        // componentDidLoad only runs ONCE, after the instance's element has been
        // assigned as the host element, and AFTER render() has been called
        // and all the child componenets have finished loading
        instance.componentDidLoad();

      } else if (__BUILD_CONDITIONALS__.cmpDidUpdate && hasCmpLoaded && instance.componentDidUpdate) {
        // we've already loaded this component
        // fire off the user's componentDidUpdate method (if one was provided)
        // componentDidUpdate runs AFTER render() has been called
        // and all child components have finished updating
        instance.componentDidUpdate();
      }

    } catch (e) {
      plt.onError(e, RUNTIME_ERROR.DidLoadError, elm);
    }

    // ( •_•)
    // ( •_•)>⌐■-■
    // (⌐■_■)

    // load events fire from bottom to top
    // the deepest elements load first then bubbles up
    propagateComponentReady(plt, elm);
  }
}


function allChildrenHaveConnected(plt: d.PlatformApi, elm: d.HostElement) {
  // Note: in IE11 <svg> does not have the "children" property
  for (let i = 0; i < elm.childNodes.length; i++) {
    const child = elm.childNodes[i] as d.HostElement;
    if (child.nodeType === NODE_TYPE.ElementNode) {
      if (plt.getComponentMeta(child) && !plt.hasConnectedMap.has(child)) {
        // this is a defined componnent
        // but it hasn't connected yet
        return false;
      }
      if (!allChildrenHaveConnected(plt, child)) {
        // one of the defined child components hasn't connected yet
        return false;
      }
    }
  }
  // everything has connected, we're good
  return true;
}


export function propagateComponentReady(plt: d.PlatformApi, elm: d.HostElement, index?: number, ancestorsActivelyLoadingChildren?: d.HostElement[], ancestorHostElement?: d.HostElement, cb?: Function) {

  // we're no longer processing this component
  plt.processingCmp.delete(elm);

  // load events fire from bottom to top
  // the deepest elements load first then bubbles up
  if ((ancestorHostElement = plt.ancestorHostElementMap.get(elm))) {
    // ok so this element already has a known ancestor host element
    // let's make sure we remove this element from its ancestor's
    // known list of child elements which are actively loading
    ancestorsActivelyLoadingChildren = ancestorHostElement['s-ld'];

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
      }
    }

    plt.ancestorHostElementMap.delete(elm);
  }

  if (plt.onAppReadyCallbacks.length && !plt.processingCmp.size) {
    // we've got some promises waiting on the entire app to be done processing
    // so it should have an empty queue and no longer rendering
    while ((cb = plt.onAppReadyCallbacks.shift())) {
      cb();
    }
  }
}
