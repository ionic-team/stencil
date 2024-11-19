import { r as registerInstance, h } from "./index-a2c0d171.js";

var ShadowDomSlotNestedRoot = /** @class */ function() {
  function ShadowDomSlotNestedRoot(o) {
    registerInstance(this, o);
  }
  return ShadowDomSlotNestedRoot.prototype.render = function() {
    var o = [ 0, 1, 2 ].map((function(o) {
      return h("shadow-dom-slot-nested", {
        i: o
      }, "light dom: ", o);
    }));
    return [ h("section", null, "shadow-dom-slot-nested"), h("article", null, o) ];
  }, ShadowDomSlotNestedRoot;
}();

ShadowDomSlotNestedRoot.style = ":host {\n      color: green;\n      font-weight: bold;\n    }";

export { ShadowDomSlotNestedRoot as shadow_dom_slot_nested_root };