import { attachShadow, h } from '@stencil/core/internal/client';

const ShadowDomBasic = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    attachShadow(this);
  }
  render() {
    return [h('div', null, 'shadow'), h('slot', null)];
  }
  static get style() {
    return 'div {\n      background: rgb(0, 0, 0);\n      color: white;\n    }';
  }
};

export { ShadowDomBasic as S };
