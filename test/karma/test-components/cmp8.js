import { attachShadow, h } from '@stencil/core/internal/client';

const ShadowDomSlotNested = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    attachShadow(this);
  }
  render() {
    return [h('header', null, 'shadow dom: ', this.i), h('footer', null, h('slot', null))];
  }
  static get style() {
    return 'header {\n      color: red;\n    }';
  }
};

export { ShadowDomSlotNested as S };
