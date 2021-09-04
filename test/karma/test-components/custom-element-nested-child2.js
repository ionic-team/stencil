import { attachShadow, h } from '@stencil/core/internal/client';

const CustomElementNestedChild = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    attachShadow(this);
  }
  render() {
    return (h("div", null, h("strong", null, "Nested child Loaded!")));
  }
};

export { CustomElementNestedChild as C };
