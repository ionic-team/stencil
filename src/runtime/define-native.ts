import * as d from '../declarations';
import { supportsShadowDom } from '@platform';
import { BUILD } from '@build-conditionals';
import { CMP_FLAGS } from '@utils';
import { connectedCallback } from './connected-callback';
import { disconnectedCallback } from './disconnected-callback';
import { forceUpdate } from './update-component';
import { proxyComponent } from './proxy-component';
import { PROXY_FLAGS } from './runtime-constants';


export const defineCustomElement = (Cstr: any, compactMeta: d.ComponentRuntimeMetaCompact) => {
  customElements.define(
    compactMeta[1],
    proxyCustomElement(Cstr, compactMeta)
  );
};


export const proxyCustomElement = (Cstr: any, compactMeta: d.ComponentRuntimeMetaCompact) => {
  const cmpMeta: d.ComponentRuntimeMeta = {
    $flags$: compactMeta[0],
    $tagName$: compactMeta[1],
    $members$: compactMeta[2],
    $listeners$: compactMeta[3],
    $watchers$: Cstr.$watchers$
  };
  if (BUILD.reflect) {
    cmpMeta.$attrsToReflect$ = [];
  }
  if (BUILD.shadowDom && !supportsShadowDom && cmpMeta.$flags$ & CMP_FLAGS.shadowDomEncapsulation) {
    cmpMeta.$flags$ |= CMP_FLAGS.needsShadowDomShim;
  }

  Object.assign(Cstr.prototype, {
    forceUpdate() {
      forceUpdate(this, cmpMeta);
    },
    connectedCallback() {
      connectedCallback(this, cmpMeta);
    },
    disconnectedCallback() {
      disconnectedCallback(this);
    }
  });

  return proxyComponent(Cstr, cmpMeta, PROXY_FLAGS.isElementConstructor | PROXY_FLAGS.proxyState) as any;
};
