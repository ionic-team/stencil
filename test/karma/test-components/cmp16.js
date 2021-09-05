import { h } from '@stencil/core/internal/client';

const SlotReorder = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.reordered = false;
  }
  render() {
    if (this.reordered) {
      return h(
        'div',
        { class: 'reordered' },
        h('slot', { name: 'slot-b' }, h('div', null, 'fallback slot-b')),
        h('slot', null, h('div', null, 'fallback default')),
        h('slot', { name: 'slot-a' }, h('div', null, 'fallback slot-a'))
      );
    }
    return h(
      'div',
      null,
      h('slot', null, h('div', null, 'fallback default')),
      h('slot', { name: 'slot-a' }, h('div', null, 'fallback slot-a')),
      h('slot', { name: 'slot-b' }, h('div', null, 'fallback slot-b'))
    );
  }
};

export { SlotReorder as S };
