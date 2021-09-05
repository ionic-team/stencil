import { proxyCustomElement } from '@stencil/core/internal/client';

const AttributeBoolean$1 = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
};

const AttributeBoolean = /*@__PURE__*/ proxyCustomElement(AttributeBoolean$1, [
  0,
  'attribute-boolean',
  { boolState: [516, 'bool-state'], strState: [513, 'str-state'], noreflect: [4] },
]);
const components = ['attribute-boolean'];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach((cmp) => {
    switch (cmp) {
      case 'attribute-boolean':
        tagName = 'attribute-boolean';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          customElements.define(tagName, AttributeBoolean);
        }
        break;
    }
  });
};

export { AttributeBoolean, defineCustomElement };
