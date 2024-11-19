var __awaiter = this && this.__awaiter || function(t, e, n, r) {
  return new (n || (n = Promise))((function(o, a) {
    function fulfilled(t) {
      try {
        step(r.next(t));
      } catch (e) {
        a(e);
      }
    }
    function rejected(t) {
      try {
        step(r.throw(t));
      } catch (e) {
        a(e);
      }
    }
    function step(t) {
      var e;
      t.done ? o(t.value) : (e = t.value, e instanceof n ? e : new n((function(t) {
        t(e);
      }))).then(fulfilled, rejected);
    }
    step((r = r.apply(t, e || [])).next());
  }));
}, __generator = this && this.__generator || function(t, e) {
  var n, r, o, a, i = {
    label: 0,
    sent: function() {
      if (1 & o[0]) throw o[1];
      return o[1];
    },
    trys: [],
    ops: []
  };
  return a = {
    next: verb(0),
    throw: verb(1),
    return: verb(2)
  }, "function" == typeof Symbol && (a[Symbol.iterator] = function() {
    return this;
  }), a;
  function verb(u) {
    return function(c) {
      return function(u) {
        if (n) throw new TypeError("Generator is already executing.");
        for (;a && (a = 0, u[0] && (i = 0)), i; ) try {
          if (n = 1, r && (o = 2 & u[0] ? r.return : u[0] ? r.throw || ((o = r.return) && o.call(r), 
          0) : r.next) && !(o = o.call(r, u[1])).done) return o;
          switch (r = 0, o && (u = [ 2 & u[0], o.value ]), u[0]) {
           case 0:
           case 1:
            o = u;
            break;

           case 4:
            return i.label++, {
              value: u[1],
              done: !1
            };

           case 5:
            i.label++, r = u[1], u = [ 0 ];
            continue;

           case 7:
            u = i.ops.pop(), i.trys.pop();
            continue;

           default:
            if (!(o = i.trys, (o = o.length > 0 && o[o.length - 1]) || 6 !== u[0] && 2 !== u[0])) {
              i = 0;
              continue;
            }
            if (3 === u[0] && (!o || u[1] > o[0] && u[1] < o[3])) {
              i.label = u[1];
              break;
            }
            if (6 === u[0] && i.label < o[1]) {
              i.label = o[1], o = u;
              break;
            }
            if (o && i.label < o[2]) {
              i.label = o[2], i.ops.push(u);
              break;
            }
            o[2] && i.ops.pop(), i.trys.pop();
            continue;
          }
          u = e.call(t, i);
        } catch (c) {
          u = [ 6, c ], r = 0;
        } finally {
          n = o = 0;
        }
        if (5 & u[0]) throw u[1];
        return {
          value: u[0] ? u[1] : void 0,
          done: !0
        };
      }([ u, c ]);
    };
  }
};

import { r as registerInstance, h } from "./index-a2c0d171.js";

import { o as output } from "./output-37e541c2.js";

var Cmpa = /** @class */ function() {
  function class_1(t) {
    registerInstance(this, t);
  }
  return class_1.prototype.componentWillLoad = function() {
    return __awaiter(this, void 0, void 0, (function() {
      return __generator(this, (function(t) {
        return output("componentWillLoad-a"), [ 2 /*return*/ ];
      }));
    }));
  }, class_1.prototype.componentDidLoad = function() {
    return __awaiter(this, void 0, void 0, (function() {
      return __generator(this, (function(t) {
        return output("componentDidLoad-a"), [ 2 /*return*/ ];
      }));
    }));
  }, class_1.prototype.render = function() {
    return h("slot", null);
  }, class_1;
}();

export { Cmpa as lifecycle_nested_a };