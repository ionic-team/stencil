var __spreadArray = this && this.__spreadArray || function(t, e, a) {
  if (a || 2 === arguments.length) for (var s, i = 0, d = e.length; i < d; i++) !s && i in e || (s || (s = Array.prototype.slice.call(e, 0, i)), 
  s[i] = e[i]);
  return t.concat(s || Array.prototype.slice.call(e));
};

System.register([ "./p-329d5583.system.js" ], (function(t) {
  "use strict";
  var e, a;
  return {
    setters: [ function(t) {
      e = t.r, a = t.h;
    } ],
    execute: function() {
      t("lifecycle_basic_a", /** @class */ function() {
        function class_1(t) {
          e(this, t), this.componentWillUpdated = !1, this.componentDidUpdated = !1, this.value = "", 
          this.rendered = 0, this.loads = [], this.updates = [];
        }
        return class_1.prototype.lifecycleLoad = function(t) {
          this.loads = __spreadArray(__spreadArray([], this.loads, !0), [ t.detail ], !1);
        }, class_1.prototype.lifecycleUpdate = function(t) {
          this.updates = __spreadArray(__spreadArray([], this.updates, !0), [ t.detail ], !1);
        }, class_1.prototype.componentWillLoad = function() {
          this.loads = __spreadArray(__spreadArray([], this.loads, !0), [ "componentWillLoad-a" ], !1);
        }, class_1.prototype.componentDidLoad = function() {
          this.loads = __spreadArray(__spreadArray([], this.loads, !0), [ "componentDidLoad-a" ], !1);
        }, class_1.prototype.componentWillUpdate = function() {
          "Updated" !== this.value || this.componentWillUpdated || (this.updates = __spreadArray(__spreadArray([], this.updates, !0), [ "componentWillUpdate-a" ], !1), 
          this.componentWillUpdated = !0);
        }, class_1.prototype.componentDidUpdate = function() {
          "Updated" !== this.value || this.componentDidUpdated || (this.updates = __spreadArray(__spreadArray([], this.updates, !0), [ "componentDidUpdate-a" ], !1), 
          this.componentDidUpdated = !0);
        }, class_1.prototype.testClick = function() {
          this.value = "Updated";
        }, class_1.prototype.render = function() {
          return this.rendered++, a("div", null, a("button", {
            onClick: this.testClick.bind(this),
            class: "test"
          }, "Update"), a("hr", null), a("div", null, "LifecycleBasicA ", this.value), a("div", {
            class: "rendered-a"
          }, "rendered a: ", this.rendered), a("div", null, "loads a:"), a("ol", {
            class: "lifecycle-loads-a"
          }, this.loads.map((function(t) {
            return a("li", null, t);
          }))), a("div", null, "updates a:"), a("ol", {
            class: "lifecycle-updates-a"
          }, this.updates.map((function(t) {
            return a("li", null, t);
          }))), a("lifecycle-basic-b", {
            value: this.value
          }));
        }, class_1;
      }());
    }
  };
}));