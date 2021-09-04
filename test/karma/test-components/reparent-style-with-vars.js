import { attachShadow, h, proxyCustomElement } from '@stencil/core/internal/client';

const reparentStyleWithVarsCss = ":root{--custom-color:blue}:host{background-color:var(--custom-color, blue);display:block;padding:2em}.css-entry{color:purple;font-weight:bold}";

const ReparentStyleWithVars$1 = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    attachShadow(this);
  }
  render() {
    return h("div", { class: "css-entry" }, "With CSS Vars");
  }
  static get style() { return reparentStyleWithVarsCss; }
};

const ReparentStyleWithVars = /*@__PURE__*/proxyCustomElement(ReparentStyleWithVars$1, [1,"reparent-style-with-vars"]);
const components = ['reparent-style-with-vars', ];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach(cmp => {
    switch(cmp) {

      case 'reparent-style-with-vars':
        tagName = 'reparent-style-with-vars';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          
          customElements.define(tagName, ReparentStyleWithVars);
        }
        break;

    }
  });
};

export { ReparentStyleWithVars, defineCustomElement };
