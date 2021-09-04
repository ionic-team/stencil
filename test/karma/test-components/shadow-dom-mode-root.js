import { h, proxyCustomElement } from '@stencil/core/internal/client';
import { S as ShadowDomMode } from './cmp7.js';

const ShadowDomModeRoot$1 = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.showRed = false;
  }
  componentDidLoad() {
    setTimeout(() => {
      this.showRed = true;
    }, 50);
  }
  render() {
    return (h("div", null, h("shadow-dom-mode", { id: "blue", colormode: "blue" }), this.showRed ? h("shadow-dom-mode", { id: "red" }) : null));
  }
};

const ShadowDomModeRoot = /*@__PURE__*/proxyCustomElement(ShadowDomModeRoot$1, [0,"shadow-dom-mode-root",{"showRed":[32]}]);
const components = ['shadow-dom-mode-root', 'shadow-dom-mode', ];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach(cmp => {
    switch(cmp) {

      case 'shadow-dom-mode-root':
        tagName = 'shadow-dom-mode-root';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          
          customElements.define(tagName, ShadowDomModeRoot);
        }
        break;

      case 'shadow-dom-mode':
        tagName = 'shadow-dom-mode';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          const ShadowDomMode$1 = /*@__PURE__*/proxyCustomElement(ShadowDomMode, [0,"shadow-dom-mode-root",{"showRed":[32]}]);
          customElements.define(tagName, ShadowDomMode$1);
        }
        break;

    }
  });
};

export { ShadowDomModeRoot, defineCustomElement };
