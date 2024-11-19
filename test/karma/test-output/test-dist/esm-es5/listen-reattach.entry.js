import { r as registerInstance, h, e as Host } from "./index-a2c0d171.js";

var ListenReattach = /** @class */ function() {
  function ListenReattach(t) {
    registerInstance(this, t), this.clicked = 0;
  }
  return ListenReattach.prototype.click = function() {
    this.clicked++;
  }, ListenReattach.prototype.render = function() {
    return h(Host, null, h("div", {
      id: "clicked"
    }, "Clicked: ", this.clicked));
  }, ListenReattach;
}();

ListenReattach.style = ".sc-listen-reattach-h { display: block; background: gray;}";

export { ListenReattach as listen_reattach };