import { h } from '@stencil/core/internal/client';

const SlotDynamicWrapper = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.tag = 'section';
  }
  render() {
    return h(this.tag, null, h('slot', null));
  }
};

export { SlotDynamicWrapper as S };
