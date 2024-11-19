var __awaiter = this && this.__awaiter || function(e, t, n, r) {
  return new (n || (n = Promise))((function(o, i) {
    function fulfilled(e) {
      try {
        step(r.next(e));
      } catch (t) {
        i(t);
      }
    }
    function rejected(e) {
      try {
        step(r.throw(e));
      } catch (t) {
        i(t);
      }
    }
    function step(e) {
      var t;
      e.done ? o(e.value) : (t = e.value, t instanceof n ? t : new n((function(e) {
        e(t);
      }))).then(fulfilled, rejected);
    }
    step((r = r.apply(e, t || [])).next());
  }));
}, __generator = this && this.__generator || function(e, t) {
  var n, r, o, i, c = {
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
  function verb(u) {
    return function(a) {
      return function(u) {
        if (n) throw new TypeError("Generator is already executing.");
        for (;i && (i = 0, u[0] && (c = 0)), c; ) try {
          if (n = 1, r && (o = 2 & u[0] ? r.return : u[0] ? r.throw || ((o = r.return) && o.call(r), 
          0) : r.next) && !(o = o.call(r, u[1])).done) return o;
          switch (r = 0, o && (u = [ 2 & u[0], o.value ]), u[0]) {
           case 0:
           case 1:
            o = u;
            break;

           case 4:
            return c.label++, {
              value: u[1],
              done: !1
            };

           case 5:
            c.label++, r = u[1], u = [ 0 ];
            continue;

           case 7:
            u = c.ops.pop(), c.trys.pop();
            continue;

           default:
            if (!(o = c.trys, (o = o.length > 0 && o[o.length - 1]) || 6 !== u[0] && 2 !== u[0])) {
              c = 0;
              continue;
            }
            if (3 === u[0] && (!o || u[1] > o[0] && u[1] < o[3])) {
              c.label = u[1];
              break;
            }
            if (6 === u[0] && c.label < o[1]) {
              c.label = o[1], o = u;
              break;
            }
            if (o && c.label < o[2]) {
              c.label = o[2], c.ops.push(u);
              break;
            }
            o[2] && c.ops.pop(), c.trys.pop();
            continue;
          }
          u = t.call(e, c);
        } catch (a) {
          u = [ 6, a ], r = 0;
        } finally {
          n = o = 0;
        }
        if (5 & u[0]) throw u[1];
        return {
          value: u[0] ? u[1] : void 0,
          done: !0
        };
      }([ u, a ]);
    };
  }
};

System.register([ "./p-329d5583.system.js", "./p-253bac20.system.js" ], (function(e) {
  "use strict";
  var t, n, r, o;
  return {
    setters: [ function(e) {
      t = e.r, n = e.h, r = e.e;
    }, function(e) {
      o = e.o;
    } ],
    execute: function() {
      e("lifecycle_nested_c", /** @class */ function() {
        function class_1(e) {
          t(this, e);
        }
        return class_1.prototype.componentWillLoad = function() {
          return __awaiter(this, void 0, void 0, (function() {
            return __generator(this, (function(e) {
              return o("componentWillLoad-c"), [ 2 /*return*/ ];
            }));
          }));
        }, class_1.prototype.componentDidLoad = function() {
          o("componentDidLoad-c");
        }, class_1.prototype.render = function() {
          return n(r, null, n("div", null, "hello"));
        }, class_1;
      }());
    }
  };
}));