import { h } from '@stencil/core/internal/client';

const SlotLightList = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    return [
      h('section', null, 'These are my items:'),
      h('article', { class: 'list-wrapper', style: { border: '2px solid blue' } }, h('slot', null)),
      h('div', null, "That's it...."),
    ];
  }
};

export { SlotLightList as S };
