import { r as registerInstance, h } from "./index-a2c0d171.js";

var cmpRootCss = 'div#relativeToRoot{background-image:url("/assets/favicon.ico?relativeToRoot")}div#relative{background-image:url("../assets/favicon.ico?relative")}div#absolute{background-image:url("https://www.google.com/favicon.ico")}', InitCssRoot = /** @class */ function() {
  function InitCssRoot(o) {
    registerInstance(this, o);
  }
  return InitCssRoot.prototype.render = function() {
    return [ h("div", {
      id: "relative"
    }), h("div", {
      id: "relativeToRoot"
    }), h("div", {
      id: "absolute"
    }) ];
  }, InitCssRoot;
}();

InitCssRoot.style = cmpRootCss;

export { InitCssRoot as init_css_root };