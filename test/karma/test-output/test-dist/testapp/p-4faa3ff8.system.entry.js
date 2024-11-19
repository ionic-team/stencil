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
  var n, r, o, i, s = {
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
        for (;i && (i = 0, u[0] && (s = 0)), s; ) try {
          if (n = 1, r && (o = 2 & u[0] ? r.return : u[0] ? r.throw || ((o = r.return) && o.call(r), 
          0) : r.next) && !(o = o.call(r, u[1])).done) return o;
          switch (r = 0, o && (u = [ 2 & u[0], o.value ]), u[0]) {
           case 0:
           case 1:
            o = u;
            break;

           case 4:
            return s.label++, {
              value: u[1],
              done: !1
            };

           case 5:
            s.label++, r = u[1], u = [ 0 ];
            continue;

           case 7:
            u = s.ops.pop(), s.trys.pop();
            continue;

           default:
            if (!(o = s.trys, (o = o.length > 0 && o[o.length - 1]) || 6 !== u[0] && 2 !== u[0])) {
              s = 0;
              continue;
            }
            if (3 === u[0] && (!o || u[1] > o[0] && u[1] < o[3])) {
              s.label = u[1];
              break;
            }
            if (6 === u[0] && s.label < o[1]) {
              s.label = o[1], o = u;
              break;
            }
            if (o && s.label < o[2]) {
              s.label = o[2], s.ops.push(u);
              break;
            }
            o[2] && s.ops.pop(), s.trys.pop();
            continue;
          }
          u = e.call(t, s);
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

System.register([ "./p-329d5583.system.js" ], (function(t) {
  "use strict";
  var e;
  return {
    setters: [ function(t) {
      e = t.r;
    } ],
    execute: function() {
      t("attribute_complex", /** @class */ function() {
        function class_1(t) {
          e(this, t), this._obj = {
            name: "James bond"
          }, this.nu0 = 1, this.nu1 = void 0, this.nu2 = void 0, this.bool0 = !0, this.bool1 = void 0, 
          this.bool2 = void 0, this.str0 = "hello", this.str1 = void 0, this.str2 = void 0;
        }
        return Object.defineProperty(class_1.prototype, "obj", {
          get: function() {
            return JSON.stringify(this._obj);
          },
          set: function(t) {
            "string" == typeof t && (this._obj = {
              name: t
            });
          },
          enumerable: !1,
          configurable: !0
        }), class_1.prototype.getInstance = function() {
          return __awaiter(this, void 0, void 0, (function() {
            return __generator(this, (function(t) {
              return [ 2 /*return*/ , this ];
            }));
          }));
        }, class_1;
      }());
    }
  };
}));