import { attachListeners } from './events';
import { attributeChangedCallback } from './attribute-changed';
import { Component, HostElement, PlatformApi } from '../../util/interfaces';
import { connectedCallback } from './connected';
import { disconnectedCallback } from './disconnected';
import { initProxy } from './proxy';
import { queueUpdate } from './update';
import { render } from './render';


export function initHostConstructor(plt: PlatformApi, HostElementConstructor: HostElement) {
  Object.defineProperties(HostElementConstructor, {
    'connectedCallback': {
      value: function() {
        connectedCallback(plt, (<HostElement>this));
      }
    },
    'attributeChangedCallback': {
      value: function(attribName: string, oldVal: string, newVal: string) {
        attributeChangedCallback(plt, (<HostElement>this), attribName, oldVal, newVal);
      }
    },
    'disconnectedCallback': {
      value: function() {
        disconnectedCallback(plt, (<HostElement>this));
      }
    },
    _queueUpdate: {
      value: function() {
        queueUpdate(plt, (<HostElement>this));
      }
    },
    _initLoad: {
      value: function() {
        initLoad(plt, (<HostElement>this));
      }
    },
    _render: {
      value: function(isInitialRender: boolean) {
        render(plt, (<HostElement>this), isInitialRender);
      }
    }
  });
}


export function initInstance(plt: PlatformApi, elm: HostElement) {
  // using the component's class, let's create a new instance
  const cmpMeta = plt.getComponentMeta(elm);
  const instance: Component = elm.$instance = new cmpMeta.componentModuleMeta();

  // let's automatically add a reference to the host element on the instance
  instance.$el = elm;

  // so we've got an host element now, and a actual instance
  // let's wire them up together with getter/settings
  // the setters are use for change detection and knowing when to re-render
  initProxy(plt, elm, instance, cmpMeta.propsMeta, cmpMeta.statesMeta, cmpMeta.methodsMeta, cmpMeta.watchersMeta);

  // cool, let's actually connect the component to the DOM
  // this largely adds this components styles and determines
  // if it should use shadow dom or not
  plt.attachStyles(cmpMeta, elm, instance);

  // fire off the user's componentWillLoad method (if one was provided)
  // componentWillLoad only runs ONCE, after instance.$el has been assigned
  // the host element, but BEFORE render() has been called
  instance.componentWillLoad && instance.componentWillLoad();
}


export function initLoad(plt: PlatformApi, elm: HostElement): any {
  const instance = elm.$instance;

  // it's possible that we've already decided to destroy this element
  // check if this element has any actively loading child elements
  if (instance && !elm._hasDestroyed && (!elm._activelyLoadingChildren || !elm._activelyLoadingChildren.length)) {

    // cool, so at this point this element isn't already being destroyed
    // and it does not have any child elements that are still loading
    // ensure we remove any child references cuz it doesn't matter at this point
    elm._activelyLoadingChildren = null;

    // the element is within the DOM now, so let's attach the event listeners
    attachListeners(plt.queue, plt.getComponentMeta(elm).listenersMeta, elm, instance);

    // sweet, this particular element is good to go
    // all of this element's children have loaded (if any)
    elm._hasLoaded = true;

    // fire off the user's componentDidLoad method (if one was provided)
    // componentDidLoad only runs ONCE, after instance.$el has been assigned
    // the host element, and AFTER render() has been called
    instance.componentDidLoad && instance.componentDidLoad();

    // add the css class that this element has officially hydrated
    elm.classList.add('hydrated');

    // ( •_•)
    // ( •_•)>⌐■-■
    // (⌐■_■)

    // load events fire from bottom to top, the deepest elements first then bubbles up
    // if this element did have an ancestor host element
    if (elm._ancestorHostElement) {
      // ok so this element already has a known ancestor host element
      // let's make sure we remove this element from its ancestor's
      // known list of child elements which are actively loading
      let ancestorsActivelyLoadingChildren = elm._ancestorHostElement._activelyLoadingChildren;
      let index = ancestorsActivelyLoadingChildren && ancestorsActivelyLoadingChildren.indexOf(elm);
      if (index > -1) {
        // yup, this element is in the list of child elements to wait on
        // remove it so we can work to get the length down to 0
        ancestorsActivelyLoadingChildren.splice(index, 1);
      }

      // the ancestor's initLoad method will do the actual checks
      // to see if the ancestor is actually loaded or not
      // then let's call the ancestor's initLoad method if there's no length
      // (which actually ends up as this method again but for the ancestor)
      !ancestorsActivelyLoadingChildren.length && elm._ancestorHostElement._initLoad();

      // fuhgeddaboudit, no need to keep a reference after this element loaded
      delete elm._ancestorHostElement;
    }

  }

}
