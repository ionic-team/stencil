import { attachShadow, h } from '@stencil/core/internal/client';

const ShadowDomArray = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    attachShadow(this);
    this.values = [];
  }
  render() {
    return this.values.map((v) => h("div", null, v));
  }
};

export { ShadowDomArray as S };
