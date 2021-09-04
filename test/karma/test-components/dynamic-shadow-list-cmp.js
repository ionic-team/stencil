import { attachShadow, h } from '@stencil/core/internal/client';

const DynamicListShadowComponent = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    attachShadow(this);
    this.items = [];
  }
  render() {
    return (h("slot-light-list", null, this.items.map((item) => (h("div", null, item)))));
  }
};

export { DynamicListShadowComponent as D };
