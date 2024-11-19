import { r as registerInstance, h } from "./index-a2c0d171.js";

var foo = "bar", JsonBasic = /** @class */ function() {
  function JsonBasic(n) {
    registerInstance(this, n);
  }
  return JsonBasic.prototype.render = function() {
    return h("div", {
      id: "json-foo"
    }, foo);
  }, JsonBasic;
}();

export { JsonBasic as json_basic };