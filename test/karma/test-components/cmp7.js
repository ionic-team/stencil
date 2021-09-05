import { attachShadow, getMode, h } from '@stencil/core/internal/client';

const modeBlueCss = ':host{display:block;padding:100px;background:blue;color:white;font-weight:bold;font-size:32px}';

const modeRedCss = ':host{display:block;padding:100px;background:red;color:white;font-weight:bold;font-size:32px}';

const ShadowDomMode = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    attachShadow(this);
    this.mode = getMode(this);
  }
  render() {
    return h('div', null, this.mode);
  }
  static get style() {
    return {
      blue: modeBlueCss,
      red: modeRedCss,
    };
  }
};

export { ShadowDomMode as S };
