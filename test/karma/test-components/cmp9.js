import { h } from '@stencil/core/internal/client';

const SlotArrayComplex = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    return [
      h("slot", { name: "start" }),
      h("section", null, h("slot", null)),
      h("slot", { name: "end" }),
    ];
  }
};

export { SlotArrayComplex as S };
