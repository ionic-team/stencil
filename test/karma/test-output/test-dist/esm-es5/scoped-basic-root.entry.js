import { r as registerInstance, h } from "./index-a2c0d171.js";

var cmpRootMdCss = ".sc-scoped-basic-root-md-h{color:white}", ScopedBasicRoot = /** @class */ function() {
  function ScopedBasicRoot(o) {
    registerInstance(this, o);
  }
  return ScopedBasicRoot.prototype.render = function() {
    return h("scoped-basic", null, h("span", null, "light"));
  }, ScopedBasicRoot;
}();

ScopedBasicRoot.style = {
  md: cmpRootMdCss
};

export { ScopedBasicRoot as scoped_basic_root };