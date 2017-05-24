import { attachListeners } from './events';
import { collectedHostContentNodes } from './host';
import { Component, ConfigApi, ListenMeta, PlatformApi, ProxyElement } from '../util/interfaces';
import { getParentElement } from '../util/helpers';
import { initProxy } from './proxy';
import { RendererApi } from '../util/interfaces';


export function queueUpdate(plt: PlatformApi, config: ConfigApi, renderer: RendererApi, elm: ProxyElement, tag: string) {
  // only run patch if it isn't queued already
  if (!elm.$queued) {
    elm.$queued = true;

    // run the patch in the next tick
    plt.queue.add(function queueUpdateNextTick() {

      // vdom diff and patch the host element for differences
      update(plt, config, renderer, elm, tag);

      // no longer queued
      elm.$queued = false;
    });
  }
}


export function update(plt: PlatformApi, config: ConfigApi, renderer: RendererApi, elm: ProxyElement, tag: string) {
  const cmpMeta = plt.getComponentMeta(tag);

  let isInitialLoad = false;
  let isSsrHydrated = false;

  let instance = elm.$instance;
  if (!instance) {
    isInitialLoad = true;
    isSsrHydrated = !plt.isServer && elm.classList.contains('ssr');

    // using the component's class, let's create a new instance
    instance = elm.$instance = new cmpMeta.componentModule();

    // let's automatically add a reference to the host element on the instance
    instance.$el = elm;
    instance.$meta = cmpMeta;

    // so we've got an host element now, and a actual instance
    // let's wire them up together with getter/settings
    // the setters are use for change detection and knowing when to re-render
    initProxy(plt, config, renderer, elm, tag, instance, cmpMeta.props, cmpMeta.methods, cmpMeta.watchers);

    // cool, let's actually attach the component to the DOM
    // this largely adds this components styles and determines
    // if it should use shadow dom or not
    plt.$attachComponent(elm, cmpMeta, instance);

    if (!cmpMeta.shadow && instance.render && !isSsrHydrated) {
      // this component is not using shadow dom
      // but it does have a render function
      // and it hasn't already been SSR hydrated
      // collect up the host content nodes so we can
      // manually move them around to the correct slot

      if (cmpMeta.tag === 'ion-item' || cmpMeta.tag === 'ion-item-divider') {
        // TODO!!
        cmpMeta.namedSlots = ['start', 'end'];
      }

      // collect up references to each of the host elements direct children
      elm.$hostContent = collectedHostContentNodes(elm, cmpMeta.namedSlots);
    }
  }

  // if this component has a render function, let's fire
  // it off and generate a vnode for this
  const vnode = instance.render && instance.render();
  if (vnode) {
    // this component has a render fn and now a vnode
    // make some quick adjustments since we're reusing the initial
    // element already in the dom (vs. replacing it entirely)
    vnode.elm = elm;
    delete vnode.sel;

    // if this is the intial load, then we give the renderer the actual element
    // if this is a re-render, then give the renderer the last vnode we created
    instance.$vnode = renderer(instance.$vnode ? instance.$vnode : elm, vnode, elm.$hostContent, isSsrHydrated);
  }

  if (isInitialLoad) {
    // this item has completed rendering
    // if it rendered more child components, than more elements
    // would have been added to the $awaitLoads array
    elm.$hasRendered = true;

    // find the top most element which is in charge of loading
    const topLoadingElm = getLoadingParentComponent(elm);
    if (topLoadingElm) {
      // get the array of all the components we're actively loading
      let awaitLoads = topLoadingElm.$awaitLoads;

      // if the last element hasn't rendered yet
      // or there is an element we're waiting doesn't have an instance yet
      // then don't bother continuing and wait for them all to be ready
      if (!awaitLoads[awaitLoads.length - 1].$hasRendered || awaitLoads.some(hasUninitializeInstance)) {
        return;
      }

      // sort the elements from the deepest nested to the top
      // starting at the deepest elements, start calling their load method
      awaitLoads = awaitLoads.sort(sortElementsByDepth);
      for (var i = 0; i < awaitLoads.length; i++) {
        awaitLoads[i].$initLoadComponent();
      }

      // we're good here, let's just remove this guy now
      delete topLoadingElm.$awaitLoads;

    } else {
      // never found a top loading component, so let's just load this one
      elm.$initLoadComponent();
    }
  }
}


function sortElementsByDepth(a: ProxyElement, b: ProxyElement) {
  if (a.$depth < b.$depth) return 1;
  if (a.$depth > b.$depth) return -1;
  return 0;
}


function hasUninitializeInstance(elm: ProxyElement) {
  return !elm.$instance;
}


export function initLoadComponent(plt: PlatformApi, listeners: ListenMeta[], elm: ProxyElement, instance: Component) {
  // this value is only useful during the initial load, but
  // not accurate after that remove it so there's no confusion
  elm.$isLoaded = true;
  plt.$setClass(elm, 'hydrated', true);

  // the element is within the DOM now, so let's attach the event listeners
  listeners && attachListeners(plt.queue, listeners, instance);

  // sweet, we're good to go
  // all of this component's children have loaded (if any)
  // so now this component is officially loaded. good work team
  instance.ionViewDidLoad && instance.ionViewDidLoad();
}


export function getLoadingParentComponent(elm: ProxyElement) {
  while (elm) {
    if (elm.$awaitLoads) {
      return elm;
    }

    // just keep swimming
    elm = getParentElement(elm);
  }

  return null;
}


export function addToLoadingParentComponent(plt: PlatformApi, elm: ProxyElement) {
  let parentElm: ProxyElement = getParentElement(elm);
  let topProxyElm: ProxyElement = elm;
  let depth = 1;

  while (parentElm) {
    if (parentElm.$isLoaded) {
      // we hit an ancestor who's already loaded
      // so this component and anything above it couldn't be loading
      break;
    }

    if (parentElm.$awaitLoads) {
      // we found a ancestor element that is already collecting elements
      // as the top level loading component
      topProxyElm = parentElm;
      break;
    }

    if (plt.getComponentMeta(parentElm.tagName.toLowerCase())) {
      // this ancestor element is a known component
      // let's remember this for later incase this
      // ends up being the component to use
      topProxyElm = parentElm;
    }

    // keep climbing up the tree
    parentElm = getParentElement(parentElm);
    depth++;
  }

  if (topProxyElm.$awaitLoads) {
    // we already have an array collecting child elements
    // add this element to it's collection of elements we're waiting on
    elm.$depth = depth;
    topProxyElm.$awaitLoads.push(elm);

  } else {
    // this is the top level component that is not a child
    // of another component which is loading
    // create a collection of child components which we
    // should be tracking while they're all loading
    topProxyElm.$awaitLoads = [elm];
    topProxyElm.$depth = 0;
  }
}
