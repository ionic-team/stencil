import { h } from '@stencil/core/internal/client';

const SlotMapOrder = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    return h('slot', null);
  }
};

export { SlotMapOrder as S };
