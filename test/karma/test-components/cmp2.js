import { h } from '@stencil/core/internal/client';

const ConditionalRerender = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  render() {
    return h('main', null, h('slot', null), h('nav', null, 'Nav'));
  }
};

export { ConditionalRerender as C };
