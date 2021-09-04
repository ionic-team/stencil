import { h } from '@stencil/core/internal/client';

const SlotBasicOrder = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    return h("slot", null);
  }
};

export { SlotBasicOrder as S };
