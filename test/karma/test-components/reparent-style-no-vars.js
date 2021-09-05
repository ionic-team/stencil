import { attachShadow, h, proxyCustomElement } from '@stencil/core/internal/client';

const reparentStyleNoVarsCss =
  ':host{background-color:teal;display:block;padding:2em}.css-entry{color:purple;font-weight:bold}';

const ReparentStyleNoVars$1 = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    attachShadow(this);
  }
  render() {
    return h('div', { class: 'css-entry' }, 'No CSS Variables');
  }
  static get style() {
    return reparentStyleNoVarsCss;
  }
};

const ReparentStyleNoVars = /*@__PURE__*/ proxyCustomElement(ReparentStyleNoVars$1, [1, 'reparent-style-no-vars']);
const components = ['reparent-style-no-vars'];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach((cmp) => {
    switch (cmp) {
      case 'reparent-style-no-vars':
        tagName = 'reparent-style-no-vars';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          customElements.define(tagName, ReparentStyleNoVars);
        }
        break;
    }
  });
};

export { ReparentStyleNoVars, defineCustomElement };
