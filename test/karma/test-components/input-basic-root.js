import { h, proxyCustomElement } from '@stencil/core/internal/client';

const InputBasicRoot$1 = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    return h(
      'div',
      null,
      h('p', null, 'Value: ', h('span', { class: 'value' }, this.value)),
      h('input', { type: 'text', value: this.value, onInput: (ev) => (this.value = ev.target.value) })
    );
  }
  get el() {
    return this;
  }
};

const InputBasicRoot = /*@__PURE__*/ proxyCustomElement(InputBasicRoot$1, [0, 'input-basic-root', { value: [1025] }]);
const components = ['input-basic-root'];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach((cmp) => {
    switch (cmp) {
      case 'input-basic-root':
        tagName = 'input-basic-root';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          customElements.define(tagName, InputBasicRoot);
        }
        break;
    }
  });
};

export { InputBasicRoot, defineCustomElement };
