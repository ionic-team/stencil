import { r as registerInstance, h } from "./index-a2c0d171.js";

import { s as store } from "./external-store-9286228d.js";

import "./external-data-e83150db.js";

var ExternalImportB = /** @class */ function() {
  function ExternalImportB(t) {
    registerInstance(this, t);
  }
  return ExternalImportB.prototype.componentWillLoad = function() {
    var t = store().data;
    this.first = t.first, this.last = t.last;
  }, ExternalImportB.prototype.render = function() {
    return h("div", null, this.first, " ", this.last);
  }, ExternalImportB;
}();

export { ExternalImportB as external_import_b };