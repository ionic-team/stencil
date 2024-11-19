import { r as registerInstance, h, B as Build, e as Host } from "./index-a2c0d171.js";

var BuildData = /** @class */ function() {
  function BuildData(s) {
    registerInstance(this, s);
  }
  return BuildData.prototype.render = function() {
    return h(Host, null, h("p", {
      class: "is-dev"
    }, "isDev: ", "".concat(Build.isDev)), h("p", {
      class: "is-browser"
    }, "isBrowser: ", "".concat(Build.isBrowser)), h("p", {
      class: "is-testing"
    }, "isTesting: ", "".concat(Build.isTesting)));
  }, BuildData;
}();

export { BuildData as build_data };