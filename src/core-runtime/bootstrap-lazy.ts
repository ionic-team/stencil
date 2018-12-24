import * as d from '../declarations';
import { attributeChangedCallback } from './attribute-changed';
import { connectedCallback } from './connected';
import { disconnectedCallback } from './disconnected';
import { ENCAPSULATION } from '../util/constants';
import { proxyComponent } from './proxy-component';
import { refs } from './data';
import { resolved } from './task-queue';


export const bootstrapLazy = (cmpLazyMetaData: d.ComponentLazyMeta[]) => {
  // bootstrapLazy

  cmpLazyMetaData.forEach(cmpLazyMeta => {
    const cmpMeta: d.ComponentRuntimeMeta = {
      lazyBundleIds: cmpLazyMeta[1]
    };
    if (BUILD.observeAttr) {
      cmpMeta.attrNameToPropName = new Map();
    }
    if (BUILD.member) {
      cmpMeta.members = cmpLazyMeta[3];
    }
    if (BUILD.shadowDom) {
      cmpMeta.shadowDomEncapsulation = cmpLazyMeta[4] === ENCAPSULATION.ShadowDom;
    }
    if (BUILD.scoped) {
      cmpMeta.scopedDomEncapsulation = cmpLazyMeta[4] === ENCAPSULATION.ScopedCss;
    }

    class StencilLayHost extends HTMLElement {
      // StencilLazyHost

      constructor() {
        super();

        const elmData: d.ElementData = {
          elm: this,
          instanceValues: new Map(),
          instance: null
        };

        refs.set(this, elmData);
      }

      connectedCallback() {
        connectedCallback(this, cmpMeta);
      }

      disconnectedCallback() {
        if (BUILD.lazyLoad || BUILD.vdomListener || BUILD.listener) {
          disconnectedCallback(this);
        }
      }

      attributeChangedCallback(attrName: string, _oldValue: string, newValue: string) {
        if (BUILD.observeAttr) {
          attributeChangedCallback(this, cmpMeta.attrNameToPropName, attrName, newValue);
        }
      }

      's-init'() {
        if (BUILD.lazyLoad) {
          // initComponentLoaded(plt, this);
        }
      }

      forceUpdate() {
        if (BUILD.updatable) {
          // queueUpdate(plt, this, plt.getElmData(this));
        }
      }

      componentOnReady(): any {
        if (BUILD.lifecycle || BUILD.updatable) {
          const elmData = refs.get(this);
          if (!elmData.onReadyPromise) {
            elmData.onReadyPromise = new Promise(resolve => elmData.firedDidLoad ? resolve() : (elmData.onReadyResolve = resolve));
          }
          return elmData.onReadyPromise;

        } else if (BUILD.lazyLoad) {
          return resolved;
        }
      }

    }

    if (BUILD.member && cmpMeta.members) {
      if (BUILD.observeAttr) {
        (StencilLayHost as any).observedAttributes = cmpMeta.members
          .filter(m => m[3])
          .map(m => (cmpMeta.attrNameToPropName.set(m[0], m[3]), m[3]));
      }

      proxyComponent(StencilLayHost as any, cmpMeta, cmpMeta.members);
    }

    customElements.define(cmpLazyMeta[0], StencilLayHost as any);
  });
};
