import { BUILD } from '@app-data';
import { forceUpdate, getHostRef, registerHost, styles, supportsShadow } from '@platform';
import { CMP_FLAGS } from '@utils';

import type * as d from '../declarations';
import { connectedCallback } from './connected-callback';
import { disconnectedCallback } from './disconnected-callback';
import { computeMode } from './mode';
import { proxyComponent } from './proxy-component';
import { PROXY_FLAGS } from './runtime-constants';
import { attachStyles, getScopeId, registerStyle } from './styles';

export const defineCustomElement = (Cstr: any, compactMeta: d.ComponentRuntimeMetaCompact) => {
  customElements.define(compactMeta[1], proxyCustomElement(Cstr, compactMeta) as CustomElementConstructor);
};

export const proxyCustomElement = (Cstr: any, compactMeta: d.ComponentRuntimeMetaCompact) => {
  const cmpMeta: d.ComponentRuntimeMeta = {
    $flags$: compactMeta[0],
    $tagName$: compactMeta[1],
  };
  if (BUILD.member) {
    cmpMeta.$members$ = compactMeta[2];
  }
  if (BUILD.hostListener) {
    cmpMeta.$listeners$ = compactMeta[3];
  }
  if (BUILD.watchCallback) {
    cmpMeta.$watchers$ = Cstr.$watchers$;
  }
  if (BUILD.reflect) {
    cmpMeta.$attrsToReflect$ = [];
  }
  if (BUILD.shadowDom && !supportsShadow && cmpMeta.$flags$ & CMP_FLAGS.shadowDomEncapsulation) {
    // TODO(STENCIL-662): Remove code related to deprecated shadowDomShim field
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
      if (BUILD.connectedCallback && originalConnectedCallback) {
        originalConnectedCallback.call(this);
      }
    },
    disconnectedCallback() {
      disconnectedCallback(this);
      if (BUILD.disconnectedCallback && originalDisconnectedCallback) {
        originalDisconnectedCallback.call(this);
      }
    },
    __attachShadow() {
      if (supportsShadow) {
        if (BUILD.shadowDelegatesFocus) {
          this.attachShadow({
            mode: 'open',
            delegatesFocus: !!(cmpMeta.$flags$ & CMP_FLAGS.shadowDelegatesFocus),
          });
        } else {
          this.attachShadow({ mode: 'open' });
        }
      } else {
        (this as any).shadowRoot = this;
      }
    },
  });
  Cstr.is = cmpMeta.$tagName$;

  return proxyComponent(Cstr, cmpMeta, PROXY_FLAGS.isElementConstructor | PROXY_FLAGS.proxyState);
};

export const forceModeUpdate = (elm: d.RenderNode) => {
  if (BUILD.style && BUILD.mode && !BUILD.lazyLoad) {
    const mode = computeMode(elm);
    const hostRef = getHostRef(elm);

    if (hostRef.$modeName$ !== mode) {
      const cmpMeta = hostRef.$cmpMeta$;
      const oldScopeId = elm['s-sc'];
      const scopeId = getScopeId(cmpMeta, mode);
      const style = (elm.constructor as any).style[mode];
      const flags = cmpMeta.$flags$;
      if (style) {
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
