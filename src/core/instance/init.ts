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
      value: function() {
        render(plt, (<HostElement>this));
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
}


export function initLoad(plt: PlatformApi, elm: HostElement): any {
  // this value is only useful during the initial load, but
  // not accurate after that remove it so there's no confusion
  elm._isLoaded = true;
  elm.classList.add('hydrated');

  // the element is within the DOM now, so let's attach the event listeners
  const listenersMeta = plt.getComponentMeta(elm).listenersMeta;
  listenersMeta && attachListeners(plt.queue, listenersMeta, elm, elm.$instance);

  // sweet, we're good to go
  // all of this component's children have loaded (if any)
  // so now this component is officially loaded. good work team
  (elm.$instance.ionViewDidLoad && elm.$instance.ionViewDidLoad());
}
