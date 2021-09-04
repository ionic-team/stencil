import { attachShadow, h, proxyCustomElement } from '@stencil/core/internal/client';

const SvgAddClass = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    attachShadow(this);
  }
  render() {
    return (h("div", null, h("svg", { viewBox: "0 0 8 8", class: "existing-css-class" }, h("circle", { cx: "2", cy: "2", width: "64", height: "64", r: "2" }))));
  }
};

const Es5AddclassSvg = /*@__PURE__*/proxyCustomElement(SvgAddClass, [1,"es5-addclass-svg"]);
const components = ['es5-addclass-svg', ];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach(cmp => {
    switch(cmp) {

      case 'es5-addclass-svg':
        tagName = 'es5-addclass-svg';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          
          customElements.define(tagName, Es5AddclassSvg);
        }
        break;

    }
  });
};

export { Es5AddclassSvg, defineCustomElement };
