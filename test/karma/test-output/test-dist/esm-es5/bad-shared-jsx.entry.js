import { r as registerInstance, h } from "./index-a2c0d171.js";

var BadSharedJSX = /** @class */ function() {
  function BadSharedJSX(r) {
    registerInstance(this, r);
  }
  return BadSharedJSX.prototype.render = function() {
    var r = h("div", null, "Do Not Share JSX Nodes!");
    return h("div", null, r, r);
  }, BadSharedJSX;
}();

export { BadSharedJSX as bad_shared_jsx };