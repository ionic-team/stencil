import { h } from '@stencil/core/internal/client';

const SlotBasic = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    return h('header', null, h('section', null, h('article', null, h('slot', null))));
  }
};

export { SlotBasic as S };
