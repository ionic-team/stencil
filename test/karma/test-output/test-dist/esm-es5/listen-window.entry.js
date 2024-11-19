import { r as registerInstance, h } from "./index-a2c0d171.js";

var ListenWindow = /** @class */ function() {
  function ListenWindow(i) {
    registerInstance(this, i), this.clicked = 0, this.scrolled = 0;
  }
  return ListenWindow.prototype.winClick = function() {
    this.clicked++;
  }, ListenWindow.prototype.winScroll = function() {
    this.scrolled++;
  }, ListenWindow.prototype.render = function() {
    return h("div", null, h("div", {
      id: "clicked"
    }, "Clicked: ", this.clicked), h("div", null, "Scrolled: ", this.scrolled), h("button", null, "Click!"), h("div", {
      style: {
        background: "gray",
        paddingTop: "2000px"
      }
    }));
  }, ListenWindow;
}();

export { ListenWindow as listen_window };