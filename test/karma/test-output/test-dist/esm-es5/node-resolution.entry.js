import { r as registerInstance, h } from "./index-a2c0d171.js";

var location$1 = "module.js", location = "module/index.js", NodeResolution = /** @class */ function() {
  function NodeResolution(o) {
    registerInstance(this, o);
  }
  return NodeResolution.prototype.render = function() {
    return h("div", null, h("h1", null, "node-resolution"), h("p", {
      id: "module-index"
    }, location), h("p", {
      id: "module"
    }, location$1));
  }, NodeResolution;
}();

export { NodeResolution as node_resolution };