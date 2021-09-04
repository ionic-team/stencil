import { h, proxyCustomElement } from '@stencil/core/internal/client';

const DomReattachClone$1 = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    return (h("div", { class: "wrapper" }, h("span", { class: "component-mark-up" }, "Component mark-up"), h("slot", null)));
  }
};

const DomReattachClone = /*@__PURE__*/proxyCustomElement(DomReattachClone$1, [4,"dom-reattach-clone"]);
const components = ['dom-reattach-clone', ];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach(cmp => {
    switch(cmp) {

      case 'dom-reattach-clone':
        tagName = 'dom-reattach-clone';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          
          customElements.define(tagName, DomReattachClone);
        }
        break;

    }
  });
};

export { DomReattachClone, defineCustomElement };
