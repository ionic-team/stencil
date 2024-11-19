import { r as registerInstance, h, e as Host } from "./index-a2c0d171.js";

var DomReattach = /** @class */ function() {
  function DomReattach(t) {
    registerInstance(this, t), this.willLoad = 0, this.didLoad = 0, this.didUnload = 0;
  }
  return DomReattach.prototype.componentWillLoad = function() {
    this.willLoad++;
  }, DomReattach.prototype.componentDidLoad = function() {
    this.didLoad++;
  }, DomReattach.prototype.disconnectedCallback = function() {
    this.didUnload++;
  }, DomReattach.prototype.render = function() {
    return h(Host, null, h("p", null, "componentWillLoad: ", this.willLoad), h("p", null, "componentDidLoad: ", this.didLoad), h("p", null, "disconnectedCallback: ", this.didUnload));
  }, DomReattach;
}();

export { DomReattach as dom_reattach };