var __awaiter = this && this.__awaiter || function(t, e, n, r) {
  return new (n || (n = Promise))((function(o, i) {
    function fulfilled(t) {
      try {
        step(r.next(t));
      } catch (e) {
        i(e);
      }
    }
    function rejected(t) {
      try {
        step(r.throw(t));
      } catch (e) {
        i(e);
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
  var n, r, o, i, a = {
    label: 0,
    sent: function() {
      if (1 & o[0]) throw o[1];
      return o[1];
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
  function verb(c) {
    return function(u) {
      return function(c) {
        if (n) throw new TypeError("Generator is already executing.");
        for (;i && (i = 0, c[0] && (a = 0)), a; ) try {
          if (n = 1, r && (o = 2 & c[0] ? r.return : c[0] ? r.throw || ((o = r.return) && o.call(r), 
          0) : r.next) && !(o = o.call(r, c[1])).done) return o;
          switch (r = 0, o && (c = [ 2 & c[0], o.value ]), c[0]) {
           case 0:
           case 1:
            o = c;
            break;

           case 4:
            return a.label++, {
              value: c[1],
              done: !1
            };

           case 5:
            a.label++, r = c[1], c = [ 0 ];
            continue;

           case 7:
            c = a.ops.pop(), a.trys.pop();
            continue;

           default:
            if (!(o = a.trys, (o = o.length > 0 && o[o.length - 1]) || 6 !== c[0] && 2 !== c[0])) {
              a = 0;
              continue;
            }
            if (3 === c[0] && (!o || c[1] > o[0] && c[1] < o[3])) {
              a.label = c[1];
              break;
            }
            if (6 === c[0] && a.label < o[1]) {
              a.label = o[1], o = c;
              break;
            }
            if (o && a.label < o[2]) {
              a.label = o[2], a.ops.push(c);
              break;
            }
            o[2] && a.ops.pop(), a.trys.pop();
            continue;
          }
          c = e.call(t, a);
        } catch (u) {
          c = [ 6, u ], r = 0;
        } finally {
          n = o = 0;
        }
        if (5 & c[0]) throw c[1];
        return {
          value: c[0] ? c[1] : void 0,
          done: !0
        };
      }([ c, u ]);
    };
  }
};

import { r as registerInstance, h, e as Host } from "./index-a2c0d171.js";

import { o as output } from "./output-37e541c2.js";

var Cmpc = /** @class */ function() {
  function class_1(t) {
    registerInstance(this, t);
  }
  return class_1.prototype.componentWillLoad = function() {
    return __awaiter(this, void 0, void 0, (function() {
      return __generator(this, (function(t) {
        return output("componentWillLoad-c"), [ 2 /*return*/ ];
      }));
    }));
  }, class_1.prototype.componentDidLoad = function() {
    output("componentDidLoad-c");
  }, class_1.prototype.render = function() {
    return h(Host, null, h("div", null, "hello"));
  }, class_1;
}();

export { Cmpc as lifecycle_nested_c };