import { r as registerInstance, h, e as Host } from "./index-a2c0d171.js";

var DomReattachCloneHost = /** @class */ function() {
  function DomReattachCloneHost(t) {
    registerInstance(this, t);
  }
  return DomReattachCloneHost.prototype.render = function() {
    return h(Host, null, h("span", {
      class: "component-mark-up"
    }, "Component mark-up"), h("slot", null));
  }, DomReattachCloneHost;
}();

export { DomReattachCloneHost as dom_reattach_clone_host };