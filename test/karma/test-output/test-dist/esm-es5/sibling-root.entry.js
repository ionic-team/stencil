import { r as registerInstance, h } from "./index-a2c0d171.js";

var SiblingRoot = /** @class */ function() {
  function SiblingRoot(n) {
    registerInstance(this, n);
  }
  return SiblingRoot.prototype.componentWillLoad = function() {
    return new Promise((function(n) {
      setTimeout(n, 50);
    }));
  }, SiblingRoot.prototype.render = function() {
    return h("div", null, h("section", null, "sibling-shadow-dom"), h("article", null, h("slot", null)));
  }, SiblingRoot;
}();

SiblingRoot.style = ".sc-sibling-root-h {\n      display: block;\n      background: yellow;\n      color: maroon;\n      margin: 20px;\n      padding: 20px;\n    }\n    section.sc-sibling-root {\n      background: blue;\n      color: white;\n    }\n    article.sc-sibling-root {\n      background: maroon;\n      color: white;\n    }";

export { SiblingRoot as sibling_root };