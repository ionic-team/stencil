import { r as registerInstance, h } from "./index-a2c0d171.js";

import { s as store } from "./external-store-9286228d.js";

import "./external-data-e83150db.js";

var ExternalImportA = /** @class */ function() {
  function ExternalImportA(t) {
    registerInstance(this, t);
  }
  return ExternalImportA.prototype.componentWillLoad = function() {
    var t = store().data;
    this.first = t.first, this.last = t.last;
  }, ExternalImportA.prototype.render = function() {
    return h("div", null, this.first, " ", this.last);
  }, ExternalImportA;
}();

export { ExternalImportA as external_import_a };