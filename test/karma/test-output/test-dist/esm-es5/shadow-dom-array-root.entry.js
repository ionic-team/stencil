var __spreadArray = this && this.__spreadArray || function(r, a, o) {
  if (o || 2 === arguments.length) for (var t, e = 0, s = a.length; e < s; e++) !t && e in a || (t || (t = Array.prototype.slice.call(a, 0, e)), 
  t[e] = a[e]);
  return r.concat(t || Array.prototype.slice.call(a));
};

import { r as registerInstance, h } from "./index-a2c0d171.js";

var ShadowDomArrayRoot = /** @class */ function() {
  function ShadowDomArrayRoot(r) {
    registerInstance(this, r), this.values = [ 0 ];
  }
  return ShadowDomArrayRoot.prototype.addValue = function() {
    this.values = __spreadArray(__spreadArray([], this.values, !0), [ this.values.length ], !1);
  }, ShadowDomArrayRoot.prototype.render = function() {
    return h("div", null, h("button", {
      onClick: this.addValue.bind(this)
    }, "Add Value"), h("shadow-dom-array", {
      values: this.values,
      class: "results1"
    }));
  }, ShadowDomArrayRoot;
}();

export { ShadowDomArrayRoot as shadow_dom_array_root };