import * as d from '../declarations';
import { forceUpdate, getHostRef, registerHost, styles, supportsShadowDom } from '@platform';
import { BUILD } from '@app-data';
import { CMP_FLAGS } from '@utils';
import { connectedCallback } from './connected-callback';
import { disconnectedCallback } from './disconnected-callback';
import { proxyComponent } from './proxy-component';
import { PROXY_FLAGS } from './runtime-constants';
import { attachStyles, getScopeId, registerStyle } from './styles';
import { computeMode } from './mode';

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
  if (BUILD.shadowDom && !supportsShadowDom && cmpMeta.$flags$ & CMP_FLAGS.shadowDomEncapsulation) {
    cmpMeta.$flags$ |= CMP_FLAGS.needsShadowDomShim;
  }

  const originalConnectedCallback = Cstr.prototype.connectedCallback;
  const originalDisconnectedCallback = Cstr.prototype.disconnectedCallback;
  Object.assign(Cstr.prototype, {
    __registerHost() {
      registerHost(this, cmpMeta);
    },
    connectedCallback() {
      connectedCallback(this);
      originalConnectedCallback && originalConnectedCallback.call(this);
    },
    disconnectedCallback() {
      disconnectedCallback(this);
      originalDisconnectedCallback && originalDisconnectedCallback.call(this);
    },
    forceUpdate() {
      forceUpdate(this);
    }
  });
  return proxyComponent(Cstr, cmpMeta, PROXY_FLAGS.isElementConstructor | PROXY_FLAGS.proxyState);
};

export const forceModeUpdate = (elm: d.RenderNode) => {
  if (BUILD.style && BUILD.mode && !BUILD.lazyLoad) {
    const mode = computeMode(elm);
    const hostRef = getHostRef(elm);
    if (hostRef.$modeName$ !== mode) {
      const cmpMeta = hostRef.$cmpMeta$;
      const oldScopeId = getScopeId(cmpMeta.$tagName$, hostRef.$modeName$);
      const scopeId = getScopeId(cmpMeta.$tagName$, mode);
      const style = (elm.constructor as any).style[mode];
      const flags = cmpMeta.$flags$;
      if (style)  {
        if (!styles.has(scopeId)) {
          registerStyle(scopeId, style, !!(flags & CMP_FLAGS.shadowDomEncapsulation));
        }
        hostRef.$modeName$ = mode;
        elm.classList.remove(oldScopeId + '-h', oldScopeId + '-s');
        attachStyles(hostRef);
        forceUpdate(elm);
      }
    }
  }
};
