import { h } from '@stencil/core/internal/client';

const SlotLightDomContent = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    return (h("header", null, h("section", null, h("article", null, h("slot", null)))));
  }
};

export { SlotLightDomContent as S };
