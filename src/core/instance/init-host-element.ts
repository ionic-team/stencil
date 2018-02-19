import { attributeChangedCallback } from './attribute-changed';
import { Build } from '../../util/build-conditionals';
import { ComponentMeta, HostElement, OnReadyCallback, PlatformApi } from '../../declarations';
import { connectedCallback } from './connected';
import { disconnectedCallback } from './disconnected';
import { initComponentLoaded } from './init-component-instance';
import { proxyHostElementPrototype } from './proxy-host-element';
import { queueUpdate } from './update';


export function initHostElement(plt: PlatformApi, cmpMeta: ComponentMeta, HostElementConstructor: HostElement, hydratedCssClass?: string) {
  // let's wire up our functions to the host element's prototype
  // we can also inject our platform into each one that needs that api
  // note: these cannot be arrow functions cuz "this" is important here hombre

  HostElementConstructor.connectedCallback = function() {
    // coolsville, our host element has just hit the DOM
    connectedCallback(plt, cmpMeta, (this as HostElement));
  };

  if (Build.observeAttr) {
    HostElementConstructor.attributeChangedCallback = function(attribName: string, oldVal: string, newVal: string) {
      // the browser has just informed us that an attribute
      // on the host element has changed
      attributeChangedCallback(cmpMeta.membersMeta, (this as HostElement), attribName, oldVal, newVal);
    };
  }

  HostElementConstructor.disconnectedCallback = function() {
    // the element has left the builing
    disconnectedCallback(plt, (this as HostElement));
  };

  HostElementConstructor.componentOnReady = function(cb: (elm: HostElement) => void, promise?: Promise<any>) {
    if (!cb) {
      promise = new Promise(resolve => cb = resolve);
    }
    componentOnReady(plt, (this as HostElement), cb);
    return promise;
  };

  HostElementConstructor.$initLoad = function() {
    initComponentLoaded(plt, (this as HostElement), hydratedCssClass);
  };

  HostElementConstructor.forceUpdate = function() {
    queueUpdate(plt, (this as HostElement));
  };

  // add getters/setters to the host element members
  // these would come from the @Prop and @Method decorators that
  // should create the public API to this component
  proxyHostElementPrototype(plt, cmpMeta.membersMeta, HostElementConstructor);
}


function componentOnReady(plt: PlatformApi, elm: HostElement, cb: (elm: HostElement) => void, onReadyCallbacks?: OnReadyCallback[]) {
  if (!plt.isDisconnectedMap.has(elm)) {
    if (plt.hasLoadedMap.has(elm)) {
      cb(elm);

    } else {
      onReadyCallbacks = plt.onReadyCallbacksMap.get(elm) || [];
      onReadyCallbacks.push(cb);
      plt.onReadyCallbacksMap.set(elm, onReadyCallbacks);
    }
  }
}
