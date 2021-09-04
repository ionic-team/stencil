import { attachShadow, h } from '@stencil/core/internal/client';

const CustomElementChildA = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    attachShadow(this);
  }
  render() {
    return (h("div", null, h("strong", null, "Basic Nested Component Loaded!")));
  }
};

export { CustomElementChildA as C };
