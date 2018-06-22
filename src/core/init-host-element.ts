import * as d from '../declarations';
import { attributeChangedCallback } from './attribute-changed';
import { Build } from '../util/build-conditionals';
import { connectedCallback } from './connected';
import { disconnectedCallback } from './disconnected';
import { hotModuleReplacement } from './hot-module-replacement';
import { initComponentLoaded } from './init-component-instance';
import { proxyHostElementPrototype } from './proxy-host-element';
import { queueUpdate } from './update';


export function initHostElement(
  plt: d.PlatformApi,
  cmpMeta: d.ComponentMeta,
  HostElementConstructor: d.HostElement,
  hydratedCssClass: string,
) {
  // let's wire up our functions to the host element's prototype
  // we can also inject our platform into each one that needs that api
  // note: these cannot be arrow functions cuz "this" is important here hombre

  HostElementConstructor.connectedCallback = function() {
    // coolsville, our host element has just hit the DOM
    connectedCallback(plt, cmpMeta, (this as d.HostElement));
  };

  if (Build.observeAttr) {
    HostElementConstructor.attributeChangedCallback = function(attribName: string, oldVal: string, newVal: string) {
      // the browser has just informed us that an attribute
      // on the host element has changed
      attributeChangedCallback(cmpMeta.membersMeta, (this as d.HostElement), attribName, oldVal, newVal);
    };
  }

  HostElementConstructor.disconnectedCallback = function() {
    // the element has left the builing
    disconnectedCallback(plt, (this as d.HostElement));
  };

  HostElementConstructor['s-init'] = function() {
    initComponentLoaded(plt, (this as d.HostElement), hydratedCssClass);
  };

  if (Build.hotModuleReplacement) {
    HostElementConstructor['s-hmr'] = function(versionId: string) {
      hotModuleReplacement(plt, (this as d.HostElement), versionId);
    };
  }

  HostElementConstructor.forceUpdate = function() {
    queueUpdate(plt, (this as d.HostElement));
  };

  // add getters/setters to the host element members
  // these would come from the @Prop and @Method decorators that
  // should create the public API to this component
  proxyHostElementPrototype(plt, cmpMeta.membersMeta, HostElementConstructor);
}
