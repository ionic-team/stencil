import * as d from '../declarations';
import { getHostRef, postUpdateComponent, supportsShadowDom } from '@platform';
import { BUILD } from '@build-conditionals';
import { CMP_FLAGS } from '@utils';
import { scheduleUpdate } from './update-component';
import { connectedCallback } from './connected-callback';
import { disconnectedCallback } from './disconnected-callback';
import { proxyComponent } from './proxy-component';

export const attachShadow = (el: HTMLElement) => {
  if (supportsShadowDom) {
    el.attachShadow({ mode: 'open' });
  } else {
    (el as any).shadowRoot = el;
  }
};

export const proxyNative = (Cstr: any, compactMeta: d.ComponentRuntimeMetaCompact) => {
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
  if (BUILD.shadowDom && cmpMeta.$flags$ & CMP_FLAGS.shadowDomEncapsulation && !supportsShadowDom) {
    cmpMeta.$flags$ |= CMP_FLAGS.needsShadowDomShim;
  }

  Object.assign(Cstr.prototype, {
    's-init'() {
      const hostRef = getHostRef(this);
      if (hostRef.$lazyInstance$) {
        postUpdateComponent(this, hostRef);
      }
    },
    forceUpdate() {
      if (BUILD.updatable) {
        const hostRef = getHostRef(this);
        scheduleUpdate(
          this,
          hostRef,
          cmpMeta,
          false
        );
      }
    },
    componentOnReady() {
      return getHostRef(this).$onReadyPromise$;
    },
    connectedCallback() {
      connectedCallback(this, cmpMeta);
    },
    disconnectedCallback() {
      disconnectedCallback(this);
    }
  });
  return proxyComponent(Cstr, cmpMeta, 1, 1);
};
