var __awaiter = this && this.__awaiter || function(t, e, n, r) {
  return new (n || (n = Promise))((function(i, o) {
    function fulfilled(t) {
      try {
        step(r.next(t));
      } catch (e) {
        o(e);
      }
    }
    function rejected(t) {
      try {
        step(r.throw(t));
      } catch (e) {
        o(e);
      }
    }
    function step(t) {
      var e;
      t.done ? i(t.value) : (e = t.value, e instanceof n ? e : new n((function(t) {
        t(e);
      }))).then(fulfilled, rejected);
    }
    step((r = r.apply(t, e || [])).next());
  }));
}, __generator = this && this.__generator || function(t, e) {
  var n, r, i, o, u = {
    label: 0,
    sent: function() {
      if (1 & i[0]) throw i[1];
      return i[1];
    },
    trys: [],
    ops: []
  };
  return o = {
    next: verb(0),
    throw: verb(1),
    return: verb(2)
  }, "function" == typeof Symbol && (o[Symbol.iterator] = function() {
    return this;
  }), o;
  function verb(a) {
    return function(s) {
      return function(a) {
        if (n) throw new TypeError("Generator is already executing.");
        for (;o && (o = 0, a[0] && (u = 0)), u; ) try {
          if (n = 1, r && (i = 2 & a[0] ? r.return : a[0] ? r.throw || ((i = r.return) && i.call(r), 
          0) : r.next) && !(i = i.call(r, a[1])).done) return i;
          switch (r = 0, i && (a = [ 2 & a[0], i.value ]), a[0]) {
           case 0:
           case 1:
            i = a;
            break;

           case 4:
            return u.label++, {
              value: a[1],
              done: !1
            };

           case 5:
            u.label++, r = a[1], a = [ 0 ];
            continue;

           case 7:
            a = u.ops.pop(), u.trys.pop();
            continue;

           default:
            if (!(i = u.trys, (i = i.length > 0 && i[i.length - 1]) || 6 !== a[0] && 2 !== a[0])) {
              u = 0;
              continue;
            }
            if (3 === a[0] && (!i || a[1] > i[0] && a[1] < i[3])) {
              u.label = a[1];
              break;
            }
            if (6 === a[0] && u.label < i[1]) {
              u.label = i[1], i = a;
              break;
            }
            if (i && u.label < i[2]) {
              u.label = i[2], u.ops.push(a);
              break;
            }
            i[2] && u.ops.pop(), u.trys.pop();
            continue;
          }
          a = e.call(t, u);
        } catch (s) {
          a = [ 6, s ], r = 0;
        } finally {
          n = i = 0;
        }
        if (5 & a[0]) throw a[1];
        return {
          value: a[0] ? a[1] : void 0,
          done: !0
        };
      }([ a, s ]);
    };
  }
};

System.register([ "./p-329d5583.system.js" ], (function(t, e) {
  "use strict";
  var n, r;
  return {
    setters: [ function(t) {
      n = t.r, r = t.h;
    } ],
    execute: function() {
      t("dynamic_import", /** @class */ function() {
        function class_1(t) {
          n(this, t), this.value = void 0;
        }
        return class_1.prototype.componentWillLoad = function() {
          return __awaiter(this, void 0, void 0, (function() {
            return __generator(this, (function(t) {
              switch (t.label) {
               case 0:
                return [ 4 /*yield*/ , this.update() ];

               case 1:
                return t.sent(), [ 2 /*return*/ ];
              }
            }));
          }));
        }, class_1.prototype.getResult = function() {
          return __awaiter(this, void 0, void 0, (function() {
            return __generator(this, (function(t) {
              switch (t.label) {
               case 0:
                return [ 4 /*yield*/ , e.import("./p-f180af3e.system.js") ];

               case 1:
                return [ 2 /*return*/ , t.sent().getResult() ];
              }
            }));
          }));
        }, class_1.prototype.update = function() {
          return __awaiter(this, void 0, void 0, (function() {
            var t;
            return __generator(this, (function(e) {
              switch (e.label) {
               case 0:
                return t = this, [ 4 /*yield*/ , this.getResult() ];

               case 1:
                return t.value = e.sent(), [ 2 /*return*/ ];
              }
            }));
          }));
        }, class_1.prototype.render = function() {
          return r("div", null, this.value);
        }, class_1;
      }());
    }
  };
}));