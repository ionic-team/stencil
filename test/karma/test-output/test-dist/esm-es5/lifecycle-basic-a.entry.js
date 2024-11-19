var __spreadArray = this && this.__spreadArray || function(e, t, a) {
  if (a || 2 === arguments.length) for (var i, s = 0, c = t.length; s < c; s++) !i && s in t || (i || (i = Array.prototype.slice.call(t, 0, s)), 
  i[s] = t[s]);
  return e.concat(i || Array.prototype.slice.call(t));
};

import { r as registerInstance, h } from "./index-a2c0d171.js";

var LifecycleBasicA = /** @class */ function() {
  function LifecycleBasicA(e) {
    registerInstance(this, e), this.componentWillUpdated = !1, this.componentDidUpdated = !1, 
    this.value = "", this.rendered = 0, this.loads = [], this.updates = [];
  }
  return LifecycleBasicA.prototype.lifecycleLoad = function(e) {
    this.loads = __spreadArray(__spreadArray([], this.loads, !0), [ e.detail ], !1);
  }, LifecycleBasicA.prototype.lifecycleUpdate = function(e) {
    this.updates = __spreadArray(__spreadArray([], this.updates, !0), [ e.detail ], !1);
  }, LifecycleBasicA.prototype.componentWillLoad = function() {
    this.loads = __spreadArray(__spreadArray([], this.loads, !0), [ "componentWillLoad-a" ], !1);
  }, LifecycleBasicA.prototype.componentDidLoad = function() {
    this.loads = __spreadArray(__spreadArray([], this.loads, !0), [ "componentDidLoad-a" ], !1);
  }, LifecycleBasicA.prototype.componentWillUpdate = function() {
    "Updated" !== this.value || this.componentWillUpdated || (this.updates = __spreadArray(__spreadArray([], this.updates, !0), [ "componentWillUpdate-a" ], !1), 
    this.componentWillUpdated = !0);
  }, LifecycleBasicA.prototype.componentDidUpdate = function() {
    "Updated" !== this.value || this.componentDidUpdated || (this.updates = __spreadArray(__spreadArray([], this.updates, !0), [ "componentDidUpdate-a" ], !1), 
    this.componentDidUpdated = !0);
  }, LifecycleBasicA.prototype.testClick = function() {
    this.value = "Updated";
  }, LifecycleBasicA.prototype.render = function() {
    return this.rendered++, h("div", null, h("button", {
      onClick: this.testClick.bind(this),
      class: "test"
    }, "Update"), h("hr", null), h("div", null, "LifecycleBasicA ", this.value), h("div", {
      class: "rendered-a"
    }, "rendered a: ", this.rendered), h("div", null, "loads a:"), h("ol", {
      class: "lifecycle-loads-a"
    }, this.loads.map((function(e) {
      return h("li", null, e);
    }))), h("div", null, "updates a:"), h("ol", {
      class: "lifecycle-updates-a"
    }, this.updates.map((function(e) {
      return h("li", null, e);
    }))), h("lifecycle-basic-b", {
      value: this.value
    }));
  }, LifecycleBasicA;
}();

export { LifecycleBasicA as lifecycle_basic_a };