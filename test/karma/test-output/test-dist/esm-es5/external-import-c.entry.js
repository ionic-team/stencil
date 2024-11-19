import { r as registerInstance, h } from "./index-a2c0d171.js";

import { d as data } from "./external-data-e83150db.js";

var ExternalImportB = /** @class */ function() {
  function ExternalImportB(t) {
    registerInstance(this, t);
  }
  return ExternalImportB.prototype.componentWillLoad = function() {
    this.first = data().first, this.last = data().last;
  }, ExternalImportB.prototype.render = function() {
    return h("div", null, this.first, " ", this.last);
  }, ExternalImportB;
}();

export { ExternalImportB as external_import_c };