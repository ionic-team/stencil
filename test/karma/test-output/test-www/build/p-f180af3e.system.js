var __awaiter = this && this.__awaiter || function(e, t, r, n) {
  return new (r || (r = Promise))((function(o, i) {
    function fulfilled(e) {
      try {
        step(n.next(e));
      } catch (t) {
        i(t);
      }
    }
    function rejected(e) {
      try {
        step(n.throw(e));
      } catch (t) {
        i(t);
      }
    }
    function step(e) {
      var t;
      e.done ? o(e.value) : (t = e.value, t instanceof r ? t : new r((function(e) {
        e(t);
      }))).then(fulfilled, rejected);
    }
    step((n = n.apply(e, t || [])).next());
  }));
}, __generator = this && this.__generator || function(e, t) {
  var r, n, o, i, a = {
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
    return function(c) {
      return function(u) {
        if (r) throw new TypeError("Generator is already executing.");
        for (;i && (i = 0, u[0] && (a = 0)), a; ) try {
          if (r = 1, n && (o = 2 & u[0] ? n.return : u[0] ? n.throw || ((o = n.return) && o.call(n), 
          0) : n.next) && !(o = o.call(n, u[1])).done) return o;
          switch (n = 0, o && (u = [ 2 & u[0], o.value ]), u[0]) {
           case 0:
           case 1:
            o = u;
            break;

           case 4:
            return a.label++, {
              value: u[1],
              done: !1
            };

           case 5:
            a.label++, n = u[1], u = [ 0 ];
            continue;

           case 7:
            u = a.ops.pop(), a.trys.pop();
            continue;

           default:
            if (!(o = a.trys, (o = o.length > 0 && o[o.length - 1]) || 6 !== u[0] && 2 !== u[0])) {
              a = 0;
              continue;
            }
            if (3 === u[0] && (!o || u[1] > o[0] && u[1] < o[3])) {
              a.label = u[1];
              break;
            }
            if (6 === u[0] && a.label < o[1]) {
              a.label = o[1], o = u;
              break;
            }
            if (o && a.label < o[2]) {
              a.label = o[2], a.ops.push(u);
              break;
            }
            o[2] && a.ops.pop(), a.trys.pop();
            continue;
          }
          u = t.call(e, a);
        } catch (c) {
          u = [ 6, c ], n = 0;
        } finally {
          r = o = 0;
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

System.register([], (function(e, t) {
  "use strict";
  return {
    execute: function() {
      e("getResult", (function() {
        return __awaiter(this, void 0, void 0, (function() {
          var e;
          return __generator(this, (function(r) {
            switch (r.label) {
             case 0:
              return [ 4 /*yield*/ , t.import("./p-b749ee77.system.js") ];

             case 1:
              return e = r.sent().concat, n++, [ 2 /*return*/ , e(_word(), "world") + n ];
            }
          }));
        }));
      }));
      var r = 0;
      function _word() {
        return "hello" + ++r;
      }
      var n = 0;
    }
  };
}));