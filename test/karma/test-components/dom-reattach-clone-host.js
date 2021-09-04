import { h, Host, proxyCustomElement } from '@stencil/core/internal/client';

const DomReattachCloneHost$1 = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    return (h(Host, null, h("span", { class: "component-mark-up" }, "Component mark-up"), h("slot", null)));
  }
};

const DomReattachCloneHost = /*@__PURE__*/proxyCustomElement(DomReattachCloneHost$1, [4,"dom-reattach-clone-host"]);
const components = ['dom-reattach-clone-host', ];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach(cmp => {
    switch(cmp) {

      case 'dom-reattach-clone-host':
        tagName = 'dom-reattach-clone-host';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          
          customElements.define(tagName, DomReattachCloneHost);
        }
        break;

    }
  });
};

export { DomReattachCloneHost, defineCustomElement };
