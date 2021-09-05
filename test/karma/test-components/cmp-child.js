import { h, Host } from '@stencil/core/internal/client';

const SlotNestedOrderChild = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    return h(
      Host,
      null,
      h('cmp-3', null, '3'),
      h('i', null, h('slot', null)),
      h('cmp-5', null, '5'),
      h('slot', { name: 'end-slot-name' })
    );
  }
};

export { SlotNestedOrderChild as S };
