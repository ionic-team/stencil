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
  var n, r, i, o, a = {
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
  function verb(s) {
    return function(u) {
      return function(s) {
        if (n) throw new TypeError("Generator is already executing.");
        for (;o && (o = 0, s[0] && (a = 0)), a; ) try {
          if (n = 1, r && (i = 2 & s[0] ? r.return : s[0] ? r.throw || ((i = r.return) && i.call(r), 
          0) : r.next) && !(i = i.call(r, s[1])).done) return i;
          switch (r = 0, i && (s = [ 2 & s[0], i.value ]), s[0]) {
           case 0:
           case 1:
            i = s;
            break;

           case 4:
            return a.label++, {
              value: s[1],
              done: !1
            };

           case 5:
            a.label++, r = s[1], s = [ 0 ];
            continue;

           case 7:
            s = a.ops.pop(), a.trys.pop();
            continue;

           default:
            if (!(i = a.trys, (i = i.length > 0 && i[i.length - 1]) || 6 !== s[0] && 2 !== s[0])) {
              a = 0;
              continue;
            }
            if (3 === s[0] && (!i || s[1] > i[0] && s[1] < i[3])) {
              a.label = s[1];
              break;
            }
            if (6 === s[0] && a.label < i[1]) {
              a.label = i[1], i = s;
              break;
            }
            if (i && a.label < i[2]) {
              a.label = i[2], a.ops.push(s);
              break;
            }
            i[2] && a.ops.pop(), a.trys.pop();
            continue;
          }
          s = e.call(t, a);
        } catch (u) {
          s = [ 6, u ], r = 0;
        } finally {
          n = i = 0;
        }
        if (5 & s[0]) throw s[1];
        return {
          value: s[0] ? s[1] : void 0,
          done: !0
        };
      }([ s, u ]);
    };
  }
};

import { r as registerInstance, h } from "./index-a2c0d171.js";

var DynamicImport = /** @class */ function() {
  function class_1(t) {
    registerInstance(this, t), this.value = void 0;
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
          return [ 4 /*yield*/ , import("./module1-18894616.js") ];

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
    return h("div", null, this.value);
  }, class_1;
}();

export { DynamicImport as dynamic_import };