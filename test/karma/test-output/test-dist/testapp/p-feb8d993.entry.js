import { r as t, h as r } from "./p-55339060.js";

const s = class {
  constructor(r) {
    t(this, r), this.strAttr = void 0, this.anyAttr = void 0, this.nuAttr = void 0;
  }
  render() {
    return [ r("p", null, "strAttr:", " ", r("strong", {
      id: "str-attr"
    }, this.strAttr, " ", typeof this.strAttr)), r("p", null, "anyAttr:", " ", r("strong", {
      id: "any-attr"
    }, this.anyAttr, " ", typeof this.anyAttr)), r("p", null, "nuAttr:", " ", r("strong", {
      id: "nu-attr"
    }, this.nuAttr, " ", typeof this.nuAttr)) ];
  }
};

export { s as attribute_html_root }