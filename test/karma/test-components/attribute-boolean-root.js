import { h, Host, proxyCustomElement } from '@stencil/core/internal/client';

const AttributeBooleanRoot$1 = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.state = false;
  }
  async toggleState() {
    this.state = !this.state;
  }
  hostData() {
    return {
      readonly: this.state,
      tappable: this.state,
      str: this.state ? 'hello' : null,
      'aria-hidden': `${this.state}`,
      fixedtrue: 'true',
      fixedfalse: 'false',
      'no-appear': undefined,
      'no-appear2': false,
    };
  }
  __stencil_render() {
    const AttributeBoolean = 'attribute-boolean';
    return [
      h('button', { onClick: this.toggleState.bind(this) }, 'Toggle attributes'),
      h(AttributeBoolean, {
        boolState: this.state,
        strState: this.state,
        noreflect: this.state,
        tappable: this.state,
        'aria-hidden': `${this.state}`,
      }),
    ];
  }
  get el() {
    return this;
  }
  render() {
    return h(Host, this.hostData(), this.__stencil_render());
  }
};

const AttributeBooleanRoot = /*@__PURE__*/ proxyCustomElement(AttributeBooleanRoot$1, [
  0,
  'attribute-boolean-root',
  { state: [32] },
]);
const components = ['attribute-boolean-root'];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach((cmp) => {
    switch (cmp) {
      case 'attribute-boolean-root':
        tagName = 'attribute-boolean-root';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          customElements.define(tagName, AttributeBooleanRoot);
        }
        break;
    }
  });
};

export { AttributeBooleanRoot, defineCustomElement };
