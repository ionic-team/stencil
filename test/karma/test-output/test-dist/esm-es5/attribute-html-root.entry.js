import { r as registerInstance, h } from "./index-a2c0d171.js";

var AttributeHtmlRoot = /** @class */ function() {
  function AttributeHtmlRoot(t) {
    registerInstance(this, t), this.strAttr = void 0, this.anyAttr = void 0, this.nuAttr = void 0;
  }
  return AttributeHtmlRoot.prototype.render = function() {
    return [ h("p", null, "strAttr:", " ", h("strong", {
      id: "str-attr"
    }, this.strAttr, " ", typeof this.strAttr)), h("p", null, "anyAttr:", " ", h("strong", {
      id: "any-attr"
    }, this.anyAttr, " ", typeof this.anyAttr)), h("p", null, "nuAttr:", " ", h("strong", {
      id: "nu-attr"
    }, this.nuAttr, " ", typeof this.nuAttr)) ];
  }, AttributeHtmlRoot;
}();

export { AttributeHtmlRoot as attribute_html_root };