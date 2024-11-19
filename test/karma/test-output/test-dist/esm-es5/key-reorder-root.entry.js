import { r as registerInstance, h } from "./index-a2c0d171.js";

var KeyReorderRoot = /** @class */ function() {
  function KeyReorderRoot(e) {
    registerInstance(this, e), this.isReversed = !1;
  }
  return KeyReorderRoot.prototype.testClick = function() {
    this.isReversed = !this.isReversed;
  }, KeyReorderRoot.prototype.render = function() {
    var e = [ 0, 1, 2, 3, 4 ];
    return this.isReversed && e.reverse(), [ h("button", {
      onClick: this.testClick.bind(this)
    }, "Test"), h("div", null, e.map((function(e) {
      return h("div", {
        key: e,
        id: "item-" + e
      }, e);
    }))) ];
  }, KeyReorderRoot;
}();

export { KeyReorderRoot as key_reorder_root };