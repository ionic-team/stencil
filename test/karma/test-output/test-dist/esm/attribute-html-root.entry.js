import { r as registerInstance, h } from './index-a2c0d171.js';

const AttributeHtmlRoot = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.strAttr = undefined;
    this.anyAttr = undefined;
    this.nuAttr = undefined;
  }
  render() {
    return [
      h("p", null, "strAttr:", ' ', h("strong", { id: "str-attr" }, this.strAttr, " ", typeof this.strAttr)),
      h("p", null, "anyAttr:", ' ', h("strong", { id: "any-attr" }, this.anyAttr, " ", typeof this.anyAttr)),
      h("p", null, "nuAttr:", ' ', h("strong", { id: "nu-attr" }, this.nuAttr, " ", typeof this.nuAttr)),
    ];
  }
};

export { AttributeHtmlRoot as attribute_html_root };
