var __awaiter = this && this.__awaiter || function(t, e, r, n) {
  return new (r || (r = Promise))((function(a, i) {
    function fulfilled(t) {
      try {
        step(n.next(t));
      } catch (e) {
        i(e);
      }
    }
    function rejected(t) {
      try {
        step(n.throw(t));
      } catch (e) {
        i(e);
      }
    }
    function step(t) {
      var e;
      t.done ? a(t.value) : (e = t.value, e instanceof r ? e : new r((function(t) {
        t(e);
      }))).then(fulfilled, rejected);
    }
    step((n = n.apply(t, e || [])).next());
  }));
}, __generator = this && this.__generator || function(t, e) {
  var r, n, a, i, o = {
    label: 0,
    sent: function() {
      if (1 & a[0]) throw a[1];
      return a[1];
    },
    trys: [],
    ops: []
  };
  return i = {
    next: verb(0),
    throw: verb(1),
    return: verb(2)
  }, "function" == typeof Symbol && (i[Symbol.iterator] = function() {
    return this;
  }), i;
  function verb(s) {
    return function(l) {
      return function(s) {
        if (r) throw new TypeError("Generator is already executing.");
        for (;i && (i = 0, s[0] && (o = 0)), o; ) try {
          if (r = 1, n && (a = 2 & s[0] ? n.return : s[0] ? n.throw || ((a = n.return) && a.call(n), 
          0) : n.next) && !(a = a.call(n, s[1])).done) return a;
          switch (n = 0, a && (s = [ 2 & s[0], a.value ]), s[0]) {
           case 0:
           case 1:
            a = s;
            break;

           case 4:
            return o.label++, {
              value: s[1],
              done: !1
            };

           case 5:
            o.label++, n = s[1], s = [ 0 ];
            continue;

           case 7:
            s = o.ops.pop(), o.trys.pop();
            continue;

           default:
            if (!(a = o.trys, (a = a.length > 0 && a[a.length - 1]) || 6 !== s[0] && 2 !== s[0])) {
              o = 0;
              continue;
            }
            if (3 === s[0] && (!a || s[1] > a[0] && s[1] < a[3])) {
              o.label = s[1];
              break;
            }
            if (6 === s[0] && o.label < a[1]) {
              o.label = a[1], a = s;
              break;
            }
            if (a && o.label < a[2]) {
              o.label = a[2], o.ops.push(s);
              break;
            }
            a[2] && o.ops.pop(), o.trys.pop();
            continue;
          }
          s = e.call(t, o);
        } catch (l) {
          s = [ 6, l ], n = 0;
        } finally {
          r = a = 0;
        }
        if (5 & s[0]) throw s[1];
        return {
          value: s[0] ? s[1] : void 0,
          done: !0
        };
      }([ s, l ]);
    };
  }
}, __spreadArray = this && this.__spreadArray || function(t, e, r) {
  if (r || 2 === arguments.length) for (var n, a = 0, i = e.length; a < i; a++) !n && a in e || (n || (n = Array.prototype.slice.call(e, 0, a)), 
  n[a] = e[a]);
  return t.concat(n || Array.prototype.slice.call(e));
};

import { r as registerInstance, h } from "./index-a2c0d171.js";

var LifecycleAsyncA = /** @class */ function() {
  function class_1(t) {
    registerInstance(this, t), this.rendered = 0, this.componentWillUpdated = !1, this.componentDidUpdated = !1, 
    this.value = "", this.loads = [], this.updates = [];
  }
  return class_1.prototype.lifecycleLoad = function(t) {
    this.loads = __spreadArray(__spreadArray([], this.loads, !0), [ t.detail ], !1);
  }, class_1.prototype.lifecycleUpdate = function(t) {
    this.updates = __spreadArray(__spreadArray([], this.updates, !0), [ t.detail ], !1);
  }, class_1.prototype.componentWillLoad = function() {
    return __awaiter(this, void 0, void 0, (function() {
      return __generator(this, (function(t) {
        return this.loads = __spreadArray(__spreadArray([], this.loads, !0), [ "componentWillLoad-a" ], !1), 
        [ 2 /*return*/ ];
      }));
    }));
  }, class_1.prototype.componentDidLoad = function() {
    return __awaiter(this, void 0, void 0, (function() {
      return __generator(this, (function(t) {
        return this.loads = __spreadArray(__spreadArray([], this.loads, !0), [ "componentDidLoad-a" ], !1), 
        [ 2 /*return*/ ];
      }));
    }));
  }, class_1.prototype.componentWillUpdate = function() {
    return __awaiter(this, void 0, void 0, (function() {
      return __generator(this, (function(t) {
        return "Updated" !== this.value || this.componentWillUpdated || (this.updates = __spreadArray(__spreadArray([], this.updates, !0), [ "componentWillUpdate-a" ], !1), 
        this.componentWillUpdated = !0), [ 2 /*return*/ ];
      }));
    }));
  }, class_1.prototype.componentDidUpdate = function() {
    return __awaiter(this, void 0, void 0, (function() {
      return __generator(this, (function(t) {
        return "Updated" !== this.value || this.componentDidUpdated || (this.updates = __spreadArray(__spreadArray([], this.updates, !0), [ "componentDidUpdate-a" ], !1), 
        this.componentDidUpdated = !0), [ 2 /*return*/ ];
      }));
    }));
  }, class_1.prototype.testClick = function() {
    this.value = "Updated";
  }, class_1.prototype.render = function() {
    return this.rendered++, h("div", null, h("button", {
      onClick: this.testClick.bind(this),
      class: "test"
    }, "Update"), h("hr", null), h("div", null, "LifecycleAsyncA ", this.value), h("div", {
      class: "rendered-a"
    }, "rendered a: ", this.rendered), h("div", null, "loads a:"), h("ol", {
      class: "lifecycle-loads-a"
    }, this.loads.map((function(t) {
      return h("li", null, t);
    }))), h("div", null, "updates a:"), h("ol", {
      class: "lifecycle-updates-a"
    }, this.updates.map((function(t) {
      return h("li", null, t);
    }))), h("lifecycle-async-b", {
      value: this.value
    }));
  }, class_1;
}();

export { LifecycleAsyncA as lifecycle_async_a };