import { attachShadow, h, Host, proxyCustomElement } from '@stencil/core/internal/client';

const delegatesFocusCss =
  ':host{display:block;border:5px solid red;padding:10px;margin:10px}input{display:block;width:100%}:host(:focus){border:5px solid blue}';

const DelegatesFocus$1 = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    attachShadow(this);
  }
  render() {
    return h(Host, null, h('input', null));
  }
  static get delegatesFocus() {
    return true;
  }
  static get style() {
    return delegatesFocusCss;
  }
};

const DelegatesFocus = /*@__PURE__*/ proxyCustomElement(DelegatesFocus$1, [17, 'delegates-focus']);
const components = ['delegates-focus'];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach((cmp) => {
    switch (cmp) {
      case 'delegates-focus':
        tagName = 'delegates-focus';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          customElements.define(tagName, DelegatesFocus);
        }
        break;
    }
  });
};

export { DelegatesFocus, defineCustomElement };
