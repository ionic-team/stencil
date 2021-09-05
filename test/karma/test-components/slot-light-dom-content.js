import { proxyCustomElement } from '@stencil/core/internal/client';
import { S as SlotLightDomContent$1 } from './cmp14.js';

const SlotLightDomContent = /*@__PURE__*/ proxyCustomElement(SlotLightDomContent$1, [4, 'slot-light-dom-content']);
const components = ['slot-light-dom-content'];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach((cmp) => {
    switch (cmp) {
      case 'slot-light-dom-content':
        tagName = 'slot-light-dom-content';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          customElements.define(tagName, SlotLightDomContent);
        }
        break;
    }
  });
};

export { SlotLightDomContent, defineCustomElement };
