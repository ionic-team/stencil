import { h } from '@stencil/core/internal/client';

const SlotReplaceWrapper = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    const TagType = this.href != null ? 'a' : 'div';
    const attrs = this.href != null ? { href: this.href, target: '_blank' } : {};
    return [
      h(
        TagType,
        Object.assign({}, attrs),
        h('slot', { name: 'start' }),
        h('span', null, h('slot', null), h('span', null, h('slot', { name: 'end' })))
      ),
      h('hr', null),
    ];
  }
};

export { SlotReplaceWrapper as S };
