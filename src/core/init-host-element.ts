import * as d from '../declarations';
import { attributeChangedCallback } from './attribute-changed';
import { connectedCallback } from './connected';
import { disconnectedCallback } from './disconnected';
import { hmrStart } from './hmr-component';
import { initComponentLoaded } from './init-component-instance';
import { proxyHostElementPrototype } from './proxy-host-element';
import { queueUpdate } from './update';


export function initHostElement(
  plt: d.PlatformApi,
  cmpMeta: d.ComponentMeta,
  HostElementConstructor: d.HostElement,
  hydratedCssClass: string,
  perf: Performance
) {
  // let's wire up our functions to the host element's prototype
  // we can also inject our platform into each one that needs that api
  // note: these cannot be arrow functions cuz "this" is important here hombre

  HostElementConstructor.connectedCallback = function() {
    // coolsville, our host element has just hit the DOM
    connectedCallback(plt, cmpMeta, this, perf);
  };

  HostElementConstructor.disconnectedCallback = function() {
    // the element has left the builing
    disconnectedCallback(plt, this, perf);
  };

  HostElementConstructor['s-init'] = function() {
    initComponentLoaded(plt, this, hydratedCssClass, perf);
  };

  HostElementConstructor.forceUpdate = function() {
    queueUpdate(plt, this, perf);
  };

  if (_BUILD_.hotModuleReplacement) {
    HostElementConstructor['s-hmr'] = function(hmrVersionId) {
      hmrStart(plt, cmpMeta, (this as d.HostElement), hmrVersionId);
    };
  }

  if (cmpMeta.membersMeta) {
    const entries = Object.entries(cmpMeta.membersMeta);
    if (_BUILD_.observeAttr) {
      let attrToProp: any = {};
      entries.forEach(([propName, {attribName}]) => {
        if (attribName) {
          attrToProp[attribName] = propName;
        }
      });
      attrToProp = {...attrToProp};
      HostElementConstructor.attributeChangedCallback = function(attribName: string, _oldVal: string, newVal: string) {
        // the browser has just informed us that an attribute
        // on the host element has changed
        attributeChangedCallback(attrToProp, this, attribName, newVal);
      };
    }

    // add getters/setters to the host element members
    // these would come from the @Prop and @Method decorators that
    // should create the public API to this component
    proxyHostElementPrototype(plt, entries, HostElementConstructor, perf);
  }
}
