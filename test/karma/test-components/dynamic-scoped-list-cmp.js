import { h } from '@stencil/core/internal/client';

const DynamicListScopedComponent = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.items = [];
  }
  render() {
    return h(
      'slot-light-scoped-list',
      null,
      this.items.map((item) => h('div', null, item))
    );
  }
};

export { DynamicListScopedComponent as D };
