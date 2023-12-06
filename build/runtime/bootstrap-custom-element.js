import { BUILD } from '@app-data';
import { forceUpdate, getHostRef, registerHost, styles, supportsShadow } from '@platform';
import { connectedCallback } from './connected-callback';
import { disconnectedCallback } from './disconnected-callback';
import { patchChildSlotNodes, patchCloneNode, patchPseudoShadowDom, patchSlotAppendChild, patchTextContent, } from './dom-extras';
import { computeMode } from './mode';
import { proxyComponent } from './proxy-component';
import { attachStyles, getScopeId, registerStyle } from './styles';
export const defineCustomElement = (Cstr, compactMeta) => {
    customElements.define(compactMeta[1], proxyCustomElement(Cstr, compactMeta));
};
export const proxyCustomElement = (Cstr, compactMeta) => {
    const cmpMeta = {
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
    if (BUILD.shadowDom && !supportsShadow && cmpMeta.$flags$ & 1 /* CMP_FLAGS.shadowDomEncapsulation */) {
        // TODO(STENCIL-854): Remove code related to legacy shadowDomShim field
        cmpMeta.$flags$ |= 8 /* CMP_FLAGS.needsShadowDomShim */;
    }
    // TODO(STENCIL-914): this check and `else` block can go away and be replaced by just `BUILD.scoped` once we
    // default our pseudo-slot behavior
    if (BUILD.experimentalSlotFixes && BUILD.scoped) {
        patchPseudoShadowDom(Cstr.prototype, cmpMeta);
    }
    else {
        if (BUILD.slotChildNodesFix) {
            patchChildSlotNodes(Cstr.prototype, cmpMeta);
        }
        if (BUILD.cloneNodeFix) {
            patchCloneNode(Cstr.prototype);
        }
        if (BUILD.appendChildSlotFix) {
            patchSlotAppendChild(Cstr.prototype);
        }
        if (BUILD.scopedSlotTextContentFix) {
            patchTextContent(Cstr.prototype, cmpMeta);
        }
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
                        delegatesFocus: !!(cmpMeta.$flags$ & 16 /* CMP_FLAGS.shadowDelegatesFocus */),
                    });
                }
                else {
                    this.attachShadow({ mode: 'open' });
                }
            }
            else {
                this.shadowRoot = this;
            }
        },
    });
    Cstr.is = cmpMeta.$tagName$;
    return proxyComponent(Cstr, cmpMeta, 1 /* PROXY_FLAGS.isElementConstructor */ | 2 /* PROXY_FLAGS.proxyState */);
};
export const forceModeUpdate = (elm) => {
    if (BUILD.style && BUILD.mode && !BUILD.lazyLoad) {
        const mode = computeMode(elm);
        const hostRef = getHostRef(elm);
        if (hostRef.$modeName$ !== mode) {
            const cmpMeta = hostRef.$cmpMeta$;
            const oldScopeId = elm['s-sc'];
            const scopeId = getScopeId(cmpMeta, mode);
            const style = elm.constructor.style[mode];
            const flags = cmpMeta.$flags$;
            if (style) {
                if (!styles.has(scopeId)) {
                    registerStyle(scopeId, style, !!(flags & 1 /* CMP_FLAGS.shadowDomEncapsulation */));
                }
                hostRef.$modeName$ = mode;
                elm.classList.remove(oldScopeId + '-h', oldScopeId + '-s');
                attachStyles(hostRef);
                forceUpdate(elm);
            }
        }
    }
};
//# sourceMappingURL=bootstrap-custom-element.js.map