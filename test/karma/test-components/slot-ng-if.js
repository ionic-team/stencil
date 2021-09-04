import { h, Host, proxyCustomElement } from '@stencil/core/internal/client';

const AngularSlotBinding = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    return (h(Host, null, h("slot", null)));
  }
};

const SlotNgIf = /*@__PURE__*/proxyCustomElement(AngularSlotBinding, [4,"slot-ng-if"]);
const components = ['slot-ng-if', ];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach(cmp => {
    switch(cmp) {

      case 'slot-ng-if':
        tagName = 'slot-ng-if';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          
          customElements.define(tagName, SlotNgIf);
        }
        break;

    }
  });
};

export { SlotNgIf, defineCustomElement };
