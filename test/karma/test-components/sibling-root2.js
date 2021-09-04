import { h } from '@stencil/core/internal/client';

const SiblingRoot = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  componentWillLoad() {
    return new Promise((resolve) => {
      setTimeout(resolve, 50);
    });
  }
  render() {
    return (h("div", null, h("section", null, "sibling-shadow-dom"), h("article", null, h("slot", null))));
  }
  static get style() { return ".sc-sibling-root-h {\n      display: block;\n      background: yellow;\n      color: maroon;\n      margin: 20px;\n      padding: 20px;\n    }\n    section.sc-sibling-root {\n      background: blue;\n      color: white;\n    }\n    article.sc-sibling-root {\n      background: maroon;\n      color: white;\n    }"; }
};

export { SiblingRoot as S };
